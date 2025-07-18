export interface SyncMessage {
  type: 'sync_request' | 'sync_response' | 'sync_update' | 'device_discovery' | 'device_response';
  deviceId: string;
  deviceName: string;
  timestamp: number;
  data?: {
    completedTasks: string[];
    customTasks: {
      timeBlockId: string;
      task: {
        id: string;
        text: string;
        completed: boolean;
        isCustom: boolean;
      };
    }[];
  };
}

export interface ConnectedDevice {
  id: string;
  name: string;
  connection: RTCPeerConnection;
  dataChannel: RTCDataChannel;
  lastSeen: number;
}

export class P2PSync {
  private deviceId: string;
  private deviceName: string;
  private connectedDevices: Map<string, ConnectedDevice> = new Map();
  private onDataReceived: (data: any) => void;
  private onDeviceConnected: (deviceId: string, deviceName: string) => void;
  private onDeviceDisconnected: (deviceId: string) => void;
  private broadcastChannel: BroadcastChannel;
  private isEnabled: boolean = false;

  constructor(
    onDataReceived: (data: any) => void,
    onDeviceConnected: (deviceId: string, deviceName: string) => void,
    onDeviceDisconnected: (deviceId: string) => void
  ) {
    this.deviceId = this.generateDeviceId();
    this.deviceName = this.generateDeviceName();
    this.onDataReceived = onDataReceived;
    this.onDeviceConnected = onDeviceConnected;
    this.onDeviceDisconnected = onDeviceDisconnected;
    this.broadcastChannel = new BroadcastChannel('work-schedule-sync');
    
    this.setupBroadcastChannel();
    this.startDeviceDiscovery();
  }

  private generateDeviceId(): string {
    return `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateDeviceName(): string {
    const adjectives = ['Quick', 'Smart', 'Bright', 'Swift', 'Sharp', 'Clear'];
    const nouns = ['Laptop', 'Phone', 'Tablet', 'Desktop', 'Device', 'Computer'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adj} ${noun}`;
  }

  private setupBroadcastChannel(): void {
    this.broadcastChannel.onmessage = async (event) => {
      const message: SyncMessage = event.data;
      
      if (message.deviceId === this.deviceId) return; // Ignore own messages

      switch (message.type) {
        case 'device_discovery':
          this.handleDeviceDiscovery(message);
          break;
        case 'device_response':
          this.handleDeviceResponse(message);
          break;
        case 'sync_request':
          this.handleSyncRequest(message);
          break;
        case 'sync_update':
          this.handleSyncUpdate(message);
          break;
      }
    };
  }

  private async handleDeviceDiscovery(message: SyncMessage): Promise<void> {
    if (!this.isEnabled) return;

    // Respond to device discovery
    this.broadcastChannel.postMessage({
      type: 'device_response',
      deviceId: this.deviceId,
      deviceName: this.deviceName,
      timestamp: Date.now()
    });

    // Try to establish connection if not already connected
    if (!this.connectedDevices.has(message.deviceId)) {
      await this.establishConnection(message.deviceId, message.deviceName, false);
    }
  }

  private async handleDeviceResponse(message: SyncMessage): Promise<void> {
    if (!this.isEnabled) return;

    if (!this.connectedDevices.has(message.deviceId)) {
      await this.establishConnection(message.deviceId, message.deviceName, true);
    }
  }

  private async establishConnection(deviceId: string, deviceName: string, isInitiator: boolean): Promise<void> {
    try {
      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      let dataChannel: RTCDataChannel;

      if (isInitiator) {
        dataChannel = peerConnection.createDataChannel('sync', {
          ordered: true
        });
      } else {
        peerConnection.ondatachannel = (event) => {
          dataChannel = event.channel;
          this.setupDataChannel(dataChannel, deviceId, deviceName);
        };
      }

      if (isInitiator) {
        this.setupDataChannel(dataChannel, deviceId, deviceName);
      }

      // Store connection
      this.connectedDevices.set(deviceId, {
        id: deviceId,
        name: deviceName,
        connection: peerConnection,
        dataChannel: dataChannel!,
        lastSeen: Date.now()
      });

      peerConnection.oniceconnectionstatechange = () => {
        if (peerConnection.iceConnectionState === 'disconnected' || 
            peerConnection.iceConnectionState === 'failed') {
          this.handleDeviceDisconnection(deviceId);
        }
      };

    } catch (error) {
      console.warn('Failed to establish P2P connection:', error);
    }
  }

  private setupDataChannel(dataChannel: RTCDataChannel, deviceId: string, deviceName: string): void {
    dataChannel.onopen = () => {
      console.log(`Connected to device: ${deviceName}`);
      this.onDeviceConnected(deviceId, deviceName);
      
      // Request initial sync
      this.sendToDevice(deviceId, {
        type: 'sync_request',
        deviceId: this.deviceId,
        deviceName: this.deviceName,
        timestamp: Date.now()
      });
    };

    dataChannel.onmessage = (event) => {
      try {
        const message: SyncMessage = JSON.parse(event.data);
        this.handleDataChannelMessage(message);
      } catch (error) {
        console.warn('Failed to parse sync message:', error);
      }
    };

    dataChannel.onclose = () => {
      this.handleDeviceDisconnection(deviceId);
    };
  }

  private handleDataChannelMessage(message: SyncMessage): void {
    switch (message.type) {
      case 'sync_request':
        this.handleSyncRequest(message);
        break;
      case 'sync_response':
      case 'sync_update':
        this.handleSyncUpdate(message);
        break;
    }
  }

  private handleSyncRequest(message: SyncMessage): void {
    // Send current data as response
    const currentData = this.getCurrentData();
    this.sendToDevice(message.deviceId, {
      type: 'sync_response',
      deviceId: this.deviceId,
      deviceName: this.deviceName,
      timestamp: Date.now(),
      data: currentData
    });
  }

  private handleSyncUpdate(message: SyncMessage): void {
    if (message.data) {
      this.onDataReceived(message.data);
    }
  }

  private handleDeviceDisconnection(deviceId: string): void {
    const device = this.connectedDevices.get(deviceId);
    if (device) {
      console.log(`Disconnected from device: ${device.name}`);
      this.connectedDevices.delete(deviceId);
      this.onDeviceDisconnected(deviceId);
    }
  }

  private sendToDevice(deviceId: string, message: SyncMessage): void {
    const device = this.connectedDevices.get(deviceId);
    if (device && device.dataChannel.readyState === 'open') {
      device.dataChannel.send(JSON.stringify(message));
    }
  }

  private getCurrentData(): any {
    // This will be called from the hook to get current schedule data
    return {};
  }

  private startDeviceDiscovery(): void {
    // Broadcast device discovery every 10 seconds
    setInterval(() => {
      if (this.isEnabled) {
        this.broadcastChannel.postMessage({
          type: 'device_discovery',
          deviceId: this.deviceId,
          deviceName: this.deviceName,
          timestamp: Date.now()
        });
      }
    }, 10000);
  }

  public enable(): void {
    this.isEnabled = true;
    // Immediate discovery broadcast
    this.broadcastChannel.postMessage({
      type: 'device_discovery',
      deviceId: this.deviceId,
      deviceName: this.deviceName,
      timestamp: Date.now()
    });
  }

  public disable(): void {
    this.isEnabled = false;
    // Disconnect all devices
    this.connectedDevices.forEach((device) => {
      device.connection.close();
    });
    this.connectedDevices.clear();
  }

  public broadcastUpdate(data: any): void {
    if (!this.isEnabled) return;

    const message: SyncMessage = {
      type: 'sync_update',
      deviceId: this.deviceId,
      deviceName: this.deviceName,
      timestamp: Date.now(),
      data
    };

    // Send to all connected devices
    this.connectedDevices.forEach((device) => {
      this.sendToDevice(device.id, message);
    });
  }

  public getConnectedDevices(): ConnectedDevice[] {
    return Array.from(this.connectedDevices.values());
  }

  public getDeviceInfo(): { id: string; name: string } {
    return {
      id: this.deviceId,
      name: this.deviceName
    };
  }

  public destroy(): void {
    this.disable();
    this.broadcastChannel.close();
  }
}