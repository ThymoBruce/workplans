import { useState, useEffect, useRef } from 'react';
import { DeviceLinking, DeviceLink } from '../utils/deviceLinking';

export const useDeviceLinking = (
  deviceId: string,
  deviceName: string,
  onDataSync: (data: any) => void
) => {
  const [linkedDevices, setLinkedDevices] = useState<DeviceLink[]>([]);
  const deviceLinkingRef = useRef<DeviceLinking | null>(null);

  useEffect(() => {
    const handleDeviceLinked = (device: DeviceLink) => {
      setLinkedDevices(prev => {
        const existing = prev.find(d => d.deviceId === device.deviceId);
        if (existing) {
          return prev.map(d => d.deviceId === device.deviceId ? device : d);
        }
        return [...prev, device];
      });
    };

    const handleDeviceUnlinked = (deviceId: string) => {
      setLinkedDevices(prev => prev.filter(d => d.deviceId !== deviceId));
    };

    deviceLinkingRef.current = new DeviceLinking(
      deviceId,
      deviceName,
      handleDeviceLinked,
      handleDeviceUnlinked
    );

    // Load existing linked devices
    setLinkedDevices(deviceLinkingRef.current.getLinkedDevices());
    
    // Start pinging
    deviceLinkingRef.current.startPinging();

    return () => {
      if (deviceLinkingRef.current) {
        deviceLinkingRef.current.destroy();
      }
    };
  }, [deviceId, deviceName, onDataSync]);

  const generateLinkCode = (): string => {
    if (deviceLinkingRef.current) {
      return deviceLinkingRef.current.generateLinkCode();
    }
    return '';
  };

  const linkWithCode = async (code: string): Promise<boolean> => {
    if (deviceLinkingRef.current) {
      return await deviceLinkingRef.current.linkWithCode(code);
    }
    return false;
  };

  const unlinkDevice = (deviceId: string): void => {
    if (deviceLinkingRef.current) {
      deviceLinkingRef.current.unlinkDevice(deviceId);
    }
  };

  const isDeviceLinked = (deviceId: string): boolean => {
    if (deviceLinkingRef.current) {
      return deviceLinkingRef.current.isDeviceLinked(deviceId);
    }
    return false;
  };

  return {
    linkedDevices,
    generateLinkCode,
    linkWithCode,
    unlinkDevice,
    isDeviceLinked
  };
};