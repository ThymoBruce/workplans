import React from 'react';
import { Target, RotateCcw } from 'lucide-react';

interface ProgressStatsProps {
  stats: {
    total: number;
    completed: number;
    percentage: number;
  };
  onReset: () => void;
}

const ProgressStats: React.FC<ProgressStatsProps> = ({ stats, onReset }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-100">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
          <div className="p-2 sm:p-3 bg-green-100 rounded-full flex-shrink-0">
            <Target className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Dagvoortgang</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              {stats.completed} van {stats.total} taken voltooid
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-bold text-gray-800">
              {Math.round(stats.percentage)}%
            </div>
            <div className="w-24 sm:w-32 bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
          </div>
          
          <button
            onClick={onReset}
            className="p-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-full transition-colors duration-200 touch-manipulation"
            title="Reset alle taken (wist ook opgeslagen voortgang)"
          >
            <RotateCcw className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressStats;