import React from 'react';
import { Wifi, WifiOff, Smartphone, Users, Info } from 'lucide-react';
import { ConnectedDevice } from '../utils/p2pSync';

interface SyncPanelProps {
  isEnabled: boolean;
  connectedDevices: ConnectedDevice[];
  deviceInfo: { id: string; name: string } | null;
  onToggleSync: () => void;
}

const SyncPanel: React.FC<SyncPanelProps> = ({
  isEnabled,
  connectedDevices,
  deviceInfo,
  onToggleSync
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 sm:p-3 rounded-full ${isEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
            {isEnabled ? (
              <Wifi className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            ) : (
              <WifiOff className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
            )}
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">
              Apparaat Synchronisatie
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              {isEnabled ? 'Actief - zoekt naar apparaten' : 'Uitgeschakeld'}
            </p>
          </div>
        </div>
        
        <button
          onClick={onToggleSync}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 touch-manipulation ${
            isEnabled
              ? 'bg-red-100 hover:bg-red-200 active:bg-red-300 text-red-700'
              : 'bg-green-100 hover:bg-green-200 active:bg-green-300 text-green-700'
          }`}
        >
          {isEnabled ? 'Uitschakelen' : 'Inschakelen'}
        </button>
      </div>

      {isEnabled && (
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Users className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Verbonden Apparaten ({connectedDevices.length})
            </span>
          </div>
          
          {connectedDevices.length > 0 ? (
            <div className="space-y-2">
              {connectedDevices.map((device) => (
                <div
                  key={device.id}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="text-sm font-medium text-green-800">{device.name}</p>
                      <p className="text-xs text-green-600">
                        Verbonden • {new Date(device.lastSeen).toLocaleTimeString('nl-NL')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <Wifi className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Zoekt naar apparaten op hetzelfde netwerk...</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-start space-x-2">
          <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-gray-600">
            <p className="mb-1">
              <strong>Hoe het werkt:</strong> Apparaten op hetzelfde WiFi-netwerk kunnen automatisch synchroniseren.
            </p>
            <p>
              Geen externe servers - alle data blijft lokaal tussen jouw apparaten.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyncPanel;