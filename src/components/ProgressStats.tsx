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
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-green-100 rounded-full">
            <Target className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Dagvoortgang</h3>
            <p className="text-sm text-gray-600">
              {stats.completed} van {stats.total} taken voltooid
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-800">
              {Math.round(stats.percentage)}%
            </div>
            <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
          </div>
          
          <button
            onClick={onReset}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
            title="Reset alle taken"
          >
            <RotateCcw className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressStats;