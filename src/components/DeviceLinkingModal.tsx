import React, { useState, useEffect, useRef } from 'react';
import { X, Smartphone, QrCode, Hash, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import QRCode from 'qrcode';

interface DeviceLinkingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateCode: () => string;
  onLinkWithCode: (code: string) => Promise<boolean>;
  deviceName: string;
}

const DeviceLinkingModal: React.FC<DeviceLinkingModalProps> = ({
  isOpen,
  onClose,
  onGenerateCode,
  onLinkWithCode,
  deviceName
}) => {
  const [mode, setMode] = useState<'choose' | 'generate' | 'scan' | 'enter'>('choose');
  const [linkCode, setLinkCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isLinking, setIsLinking] = useState(false);
  const [linkStatus, setLinkStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen) {
      setMode('choose');
      setLinkCode('');
      setInputCode('');
      setQrCodeUrl('');
      setIsLinking(false);
      setLinkStatus('idle');
      setErrorMessage('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (mode === 'generate' && !linkCode) {
      const code = onGenerateCode();
      setLinkCode(code);
      generateQRCode(code);
    }
  }, [mode, linkCode, onGenerateCode]);

  const generateQRCode = async (code: string) => {
    try {
      const qrData = JSON.stringify({
        type: 'device_link',
        code: code,
        deviceName: deviceName
      });
      const url = await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#1f2937',
          light: '#ffffff'
        }
      });
      setQrCodeUrl(url);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  };

  const handleLinkWithCode = async () => {
    if (!inputCode.trim()) return;
    
    setIsLinking(true);
    setLinkStatus('idle');
    setErrorMessage('');

    try {
      const success = await onLinkWithCode(inputCode.trim());
      if (success) {
        setLinkStatus('success');
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setLinkStatus('error');
        setErrorMessage('Kon geen apparaat vinden met deze code. Controleer of het andere apparaat een code heeft gegenereerd.');
      }
    } catch (error) {
      setLinkStatus('error');
      setErrorMessage('Er is een fout opgetreden bij het koppelen van apparaten.');
    } finally {
      setIsLinking(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Failed to start camera:', error);
      setErrorMessage('Kon camera niet starten. Gebruik de code-invoer optie.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    if (mode === 'scan') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [mode]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto transform transition-all duration-200">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Apparaten Koppelen
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {mode === 'choose' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Smartphone className="h-12 w-12 mx-auto text-blue-600 mb-3" />
                <p className="text-gray-600 text-sm">
                  Koppel dit apparaat met een ander apparaat om taken te synchroniseren
                </p>
              </div>

              <button
                onClick={() => setMode('generate')}
                className="w-full p-4 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 rounded-lg border border-blue-200 transition-colors duration-200 flex items-center space-x-3"
              >
                <QrCode className="h-6 w-6 text-blue-600" />
                <div className="text-left">
                  <div className="font-medium text-blue-800">Code Genereren</div>
                  <div className="text-sm text-blue-600">Maak een QR-code of 6-cijferige code</div>
                </div>
              </button>

              <button
                onClick={() => setMode('enter')}
                className="w-full p-4 bg-green-50 hover:bg-green-100 active:bg-green-200 rounded-lg border border-green-200 transition-colors duration-200 flex items-center space-x-3"
              >
                <Hash className="h-6 w-6 text-green-600" />
                <div className="text-left">
                  <div className="font-medium text-green-800">Code Invoeren</div>
                  <div className="text-sm text-green-600">Voer een 6-cijferige code in</div>
                </div>
              </button>
            </div>
          )}

          {mode === 'generate' && (
            <div className="text-center space-y-4">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">Scan QR-code of gebruik code</h3>
                <p className="text-sm text-gray-600">
                  Laat het andere apparaat deze code scannen of invoeren
                </p>
              </div>

              {qrCodeUrl && (
                <div className="bg-white p-4 rounded-lg border border-gray-200 inline-block">
                  <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 mx-auto" />
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">6-cijferige code:</div>
                <div className="text-2xl font-mono font-bold text-gray-800 tracking-wider">
                  {linkCode}
                </div>
              </div>

              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Loader className="h-4 w-4 animate-spin" />
                <span>Wacht op ander apparaat...</span>
              </div>

              <button
                onClick={() => setMode('choose')}
                className="w-full px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg transition-colors duration-200 font-medium text-sm"
              >
                Terug
              </button>
            </div>
          )}

          {mode === 'enter' && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <Hash className="h-12 w-12 mx-auto text-green-600 mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">Code Invoeren</h3>
                <p className="text-sm text-gray-600">
                  Voer de 6-cijferige code in van het andere apparaat
                </p>
              </div>

              <div>
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-center text-xl font-mono tracking-wider"
                  maxLength={6}
                />
              </div>

              {linkStatus === 'success' && (
                <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Apparaten succesvol gekoppeld!</span>
                </div>
              )}

              {linkStatus === 'error' && (
                <div className="flex items-start space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{errorMessage}</span>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => setMode('choose')}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg transition-colors duration-200 font-medium text-sm"
                >
                  Terug
                </button>
                <button
                  onClick={handleLinkWithCode}
                  disabled={inputCode.length !== 6 || isLinking}
                  className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 font-medium text-sm flex items-center justify-center space-x-2"
                >
                  {isLinking ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      <span>Koppelen...</span>
                    </>
                  ) : (
                    <span>Koppelen</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeviceLinkingModal;