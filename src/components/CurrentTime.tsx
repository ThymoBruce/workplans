import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const CurrentTime: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('nl-NL', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('nl-NL', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
      <div className="flex items-center justify-center space-x-4">
        <div className="p-3 bg-blue-100 rounded-full">
          <Clock className="h-6 w-6 text-blue-600" />
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-800 font-mono">
            {formatTime(currentTime)}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {formatDate(currentTime)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentTime;