export interface LinkingSession {
  sessionId: string;
  deviceId: string;
  deviceName: string;
  timestamp: number;
  isInitiator: boolean;
}

export interface DeviceLink {
  deviceId: string;
  deviceName: string;
  linkCode: string;
  timestamp: number;
  lastSeen: number;
}

export class DeviceLinking {
  private deviceId: string;
  private deviceName: string;
  private linkedDevices: Map<string, DeviceLink> = new Map();
  private activeSessions: Map<string, LinkingSession> = new Map();
  private onDeviceLinked: (device: DeviceLink) => void;
  private onDeviceUnlinked: (deviceId: string) => void;
  private broadcastChannel: BroadcastChannel;

  constructor(
    deviceId: string,
    deviceName: string,
    onDeviceLinked: (device: DeviceLink) => void,
    onDeviceUnlinked: (deviceId: string) => void
  ) {
    this.deviceId = deviceId;
    this.deviceName = deviceName;
    this.onDeviceLinked = onDeviceLinked;
    this.onDeviceUnlinked = onDeviceUnlinked;
    this.broadcastChannel = new BroadcastChannel('device-linking');
    
    this.setupBroadcastChannel();
    this.loadLinkedDevices();
  }

  private setupBroadcastChannel(): void {
    this.broadcastChannel.onmessage = (event) => {
      const message = event.data;
      
      if (message.deviceId === this.deviceId) return; // Ignore own messages

      switch (message.type) {
        case 'link_request':
          this.handleLinkRequest(message);
          break;
        case 'link_response':
          this.handleLinkResponse(message);
          break;
        case 'link_confirm':
          this.handleLinkConfirm(message);
          break;
        case 'device_ping':
          this.handleDevicePing(message);
          break;
      }
    };
  }

  private loadLinkedDevices(): void {
    try {
      const stored = localStorage.getItem('linked-devices');
      if (stored) {
        const devices = JSON.parse(stored) as DeviceLink[];
        devices.forEach(device => {
          this.linkedDevices.set(device.deviceId, device);
        });
      }
    } catch (error) {
      console.warn('Failed to load linked devices:', error);
    }
  }

  private saveLinkedDevices(): void {
    try {
      const devices = Array.from(this.linkedDevices.values());
      localStorage.setItem('linked-devices', JSON.stringify(devices));
    } catch (error) {
      console.warn('Failed to save linked devices:', error);
    }
  }

  public generateLinkCode(): string {
    const sessionId = this.generateSessionId();
    const linkCode = this.generateShortCode();
    
    const session: LinkingSession = {
      sessionId,
      deviceId: this.deviceId,
      deviceName: this.deviceName,
      timestamp: Date.now(),
      isInitiator: true
    };

    this.activeSessions.set(sessionId, session);

    // Broadcast link availability
    this.broadcastChannel.postMessage({
      type: 'link_request',
      sessionId,
      deviceId: this.deviceId,
      deviceName: this.deviceName,
      linkCode,
      timestamp: Date.now()
    });

    // Clean up session after 5 minutes
    setTimeout(() => {
      this.activeSessions.delete(sessionId);
    }, 5 * 60 * 1000);

    return linkCode;
  }

  public async linkWithCode(linkCode: string): Promise<boolean> {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve(false);
      }, 30000); // 30 second timeout

      const messageHandler = (event: MessageEvent) => {
        const message = event.data;
        
        if (message.type === 'link_request' && message.linkCode === linkCode) {
          clearTimeout(timeout);
          this.broadcastChannel.removeEventListener('message', messageHandler);
          
          // Respond to link request
          this.broadcastChannel.postMessage({
            type: 'link_response',
            sessionId: message.sessionId,
            deviceId: this.deviceId,
            deviceName: this.deviceName,
            linkCode,
            timestamp: Date.now()
          });

          resolve(true);
        }
      };

      this.broadcastChannel.addEventListener('message', messageHandler);
    });
  }

  private handleLinkRequest(message: any): void {
    // This is handled by linkWithCode method
  }

  private handleLinkResponse(message: any): void {
    const session = this.activeSessions.get(message.sessionId);
    if (session && session.isInitiator) {
      // Confirm the link
      this.broadcastChannel.postMessage({
        type: 'link_confirm',
        sessionId: message.sessionId,
        deviceId: this.deviceId,
        deviceName: this.deviceName,
        timestamp: Date.now()
      });

      // Add device to linked devices
      const deviceLink: DeviceLink = {
        deviceId: message.deviceId,
        deviceName: message.deviceName,
        linkCode: message.linkCode,
        timestamp: Date.now(),
        lastSeen: Date.now()
      };

      this.linkedDevices.set(message.deviceId, deviceLink);
      this.saveLinkedDevices();
      this.onDeviceLinked(deviceLink);
      
      this.activeSessions.delete(message.sessionId);
    }
  }

  private handleLinkConfirm(message: any): void {
    // Add device to linked devices
    const deviceLink: DeviceLink = {
      deviceId: message.deviceId,
      deviceName: message.deviceName,
      linkCode: '',
      timestamp: Date.now(),
      lastSeen: Date.now()
    };

    this.linkedDevices.set(message.deviceId, deviceLink);
    this.saveLinkedDevices();
    this.onDeviceLinked(deviceLink);
  }

  private handleDevicePing(message: any): void {
    const device = this.linkedDevices.get(message.deviceId);
    if (device) {
      device.lastSeen = Date.now();
      this.saveLinkedDevices();
    }
  }

  public startPinging(): void {
    // Ping linked devices every 30 seconds
    setInterval(() => {
      if (this.linkedDevices.size > 0) {
        this.broadcastChannel.postMessage({
          type: 'device_ping',
          deviceId: this.deviceId,
          deviceName: this.deviceName,
          timestamp: Date.now()
        });
      }
    }, 30000);
  }

  public unlinkDevice(deviceId: string): void {
    this.linkedDevices.delete(deviceId);
    this.saveLinkedDevices();
    this.onDeviceUnlinked(deviceId);
  }

  public getLinkedDevices(): DeviceLink[] {
    return Array.from(this.linkedDevices.values());
  }

  public isDeviceLinked(deviceId: string): boolean {
    return this.linkedDevices.has(deviceId);
  }

  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateShortCode(): string {
    // Generate a 6-digit code
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  public destroy(): void {
    this.broadcastChannel.close();
    this.activeSessions.clear();
  }
}