import React from 'react';
import { Info } from 'lucide-react';
import { TimeBlock } from '../types/schedule';
import TaskItem from './TaskItem';

interface TimeBlockCardProps {
  timeBlock: TimeBlock;
  isActive: boolean;
  onTaskToggle: (taskId: string) => void;
}

const TimeBlockCard: React.FC<TimeBlockCardProps> = ({ 
  timeBlock, 
  isActive, 
  onTaskToggle 
}) => {
  const completedTasks = timeBlock.tasks.filter(task => task.completed).length;
  const totalTasks = timeBlock.tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className={`
      bg-white rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl
      ${isActive 
        ? 'border-blue-500 ring-2 ring-blue-200 scale-105' 
        : timeBlock.isRecurring 
          ? 'border-orange-200 hover:border-orange-300' 
          : 'border-gray-200 hover:border-gray-300'
      }
    `}>
      <div className={`
        p-4 rounded-t-xl
        ${isActive 
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
          : timeBlock.isRecurring 
            ? 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800' 
            : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800'
        }
      `}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{timeBlock.emoji}</span>
            <div>
              <h3 className="font-semibold text-lg">{timeBlock.title}</h3>
              <p className="text-sm opacity-90">
                {timeBlock.startTime} – {timeBlock.endTime}
              </p>
            </div>
          </div>
          {isActive && (
            <div className="bg-white bg-opacity-20 rounded-full px-3 py-1">
              <span className="text-xs font-medium">ACTIEF</span>
            </div>
          )}
        </div>
        
        {totalTasks > 0 && (
          <div className="mt-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs opacity-90">Voortgang</span>
              <span className="text-xs opacity-90">{completedTasks}/{totalTasks}</span>
            </div>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        {timeBlock.tasks.length > 0 ? (
          <div className="space-y-2">
            {timeBlock.tasks.map((task) => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onToggle={onTaskToggle} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <span className="text-sm">Geen specifieke taken</span>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-start space-x-2">
            <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-gray-600">
              <p className="mb-1">
                <strong>Waarom:</strong> {timeBlock.why}
              </p>
              <p>
                <strong>Waarom nu:</strong> {timeBlock.whyNow}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeBlockCard;