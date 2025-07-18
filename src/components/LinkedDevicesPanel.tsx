import React from 'react';
import { Link, Unlink, Smartphone, Clock, Plus } from 'lucide-react';
import { DeviceLink } from '../utils/deviceLinking';

interface LinkedDevicesPanelProps {
  linkedDevices: DeviceLink[];
  onAddDevice: () => void;
  onUnlinkDevice: (deviceId: string) => void;
  deviceName: string;
}

const LinkedDevicesPanel: React.FC<LinkedDevicesPanelProps> = ({
  linkedDevices,
  onAddDevice,
  onUnlinkDevice,
  deviceName
}) => {
  const formatLastSeen = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Nu';
    if (minutes < 60) return `${minutes}m geleden`;
    if (hours < 24) return `${hours}u geleden`;
    return `${days}d geleden`;
  };

  const isOnline = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    return diff < 2 * 60 * 1000; // Online if seen within 2 minutes
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 sm:p-3 bg-purple-100 rounded-full">
            <Link className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">
              Gekoppelde Apparaten
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              {linkedDevices.length} apparaten gekoppeld
            </p>
          </div>
        </div>
        
        <button
          onClick={onAddDevice}
          className="px-3 py-2 bg-purple-100 hover:bg-purple-200 active:bg-purple-300 text-purple-700 rounded-lg font-medium text-sm transition-colors duration-200 touch-manipulation flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Koppelen</span>
        </button>
      </div>

      {/* Current Device */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Smartphone className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Dit Apparaat</span>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
        <p className="text-sm text-blue-700">{deviceName}</p>
      </div>

      {/* Linked Devices */}
      {linkedDevices.length > 0 ? (
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700 mb-2">Gekoppelde Apparaten:</div>
          {linkedDevices.map((device) => (
            <div
              key={device.deviceId}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className={`w-2 h-2 rounded-full ${
                  isOnline(device.lastSeen) ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                }`}></div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-800 truncate">{device.deviceName}</p>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{formatLastSeen(device.lastSeen)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onUnlinkDevice(device.deviceId)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200 flex-shrink-0"
                title="Apparaat ontkoppelen"
              >
                <Unlink className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <Link className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Geen apparaten gekoppeld</p>
          <p className="text-xs mt-1">Klik op "Koppelen" om een apparaat toe te voegen</p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-600">
          <p className="mb-1">
            <strong>Hoe het werkt:</strong> Gekoppelde apparaten synchroniseren automatisch taken en voortgang.
          </p>
          <p>
            Gebruik QR-codes of 6-cijferige codes om apparaten veilig te koppelen.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LinkedDevicesPanel;