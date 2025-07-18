import { useState, useEffect, useRef } from 'react';
import { P2PSync, ConnectedDevice } from '../utils/p2pSync';
import { StoredScheduleData } from '../utils/storage';

export const useP2PSync = (
  getCurrentData: () => any,
  onDataReceived: (data: StoredScheduleData) => void
) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState<ConnectedDevice[]>([]);
  const [deviceInfo, setDeviceInfo] = useState<{ id: string; name: string } | null>(null);
  const p2pSyncRef = useRef<P2PSync | null>(null);
  const getCurrentDataRef = useRef(getCurrentData);

  // Update the ref when getCurrentData changes
  useEffect(() => {
    getCurrentDataRef.current = getCurrentData;
  }, [getCurrentData]);

  useEffect(() => {
    const handleDataReceived = (data: StoredScheduleData) => {
      console.log('Received sync data from peer:', data);
      onDataReceived(data);
    };

    const handleDeviceConnected = (deviceId: string, deviceName: string) => {
      console.log(`Device connected: ${deviceName} (${deviceId})`);
      updateConnectedDevices();
    };

    const handleDeviceDisconnected = (deviceId: string) => {
      console.log(`Device disconnected: ${deviceId}`);
      updateConnectedDevices();
    };

    const updateConnectedDevices = () => {
      if (p2pSyncRef.current) {
        setConnectedDevices(p2pSyncRef.current.getConnectedDevices());
      }
    };

    // Initialize P2P sync
    p2pSyncRef.current = new P2PSync(
      handleDataReceived,
      handleDeviceConnected,
      handleDeviceDisconnected
    );

    setDeviceInfo(p2pSyncRef.current.getDeviceInfo());
    
    // Set the callback to get current data
    p2pSyncRef.current.setCurrentDataCallback(() => getCurrentDataRef.current());

    return () => {
      if (p2pSyncRef.current) {
        p2pSyncRef.current.destroy();
      }
    };
  }, [onDataReceived]);

  const enableSync = () => {
    if (p2pSyncRef.current) {
      p2pSyncRef.current.enable();
      setIsEnabled(true);
    }
  };

  const disableSync = () => {
    if (p2pSyncRef.current) {
      p2pSyncRef.current.disable();
      setIsEnabled(false);
      setConnectedDevices([]);
    }
  };

  const broadcastUpdate = (data: StoredScheduleData) => {
    if (p2pSyncRef.current && isEnabled) {
      p2pSyncRef.current.broadcastUpdate(data);
    }
  };

  // Expose the P2P sync instance
  const getP2PSyncInstance = () => p2pSyncRef.current;

  return {
    isEnabled,
    connectedDevices,
    deviceInfo,
    enableSync,
    disableSync,
    broadcastUpdate,
    getP2PSyncInstance
  };
};