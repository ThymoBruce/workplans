import React from 'react';
import { Info, Plus } from 'lucide-react';
import { TimeBlock } from '../types/schedule';
import TaskItem from './TaskItem';

interface TimeBlockCardProps {
  timeBlock: TimeBlock;
  isActive: boolean;
  onTaskToggle: (taskId: string) => void;
  onAddTask?: () => void;
  onRemoveTask?: (taskId: string) => void;
}

const TimeBlockCard: React.FC<TimeBlockCardProps> = ({ 
  timeBlock, 
  isActive, 
  onTaskToggle,
  onAddTask,
  onRemoveTask
}) => {
  const completedTasks = timeBlock.tasks.filter(task => task.completed).length;
  const totalTasks = timeBlock.tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const hasCustomTasks = timeBlock.tasks.some(task => task.isCustom);

  return (
    <div className={`
      bg-white rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl active:scale-[0.98] sm:active:scale-105
      ${isActive 
        ? 'border-blue-500 ring-2 ring-blue-200 sm:scale-105' 
        : timeBlock.isRecurring 
          ? 'border-orange-200 hover:border-orange-300' 
          : 'border-gray-200 hover:border-gray-300'
      }
    `}>
      <div className={`
        p-3 sm:p-4 rounded-t-xl
        ${isActive 
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
          : timeBlock.isRecurring 
            ? 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800' 
            : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800'
        }
      `}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
            <span className="text-xl sm:text-2xl flex-shrink-0">{timeBlock.emoji}</span>
            <div>
              <h3 className="font-semibold text-base sm:text-lg leading-tight pr-2">{timeBlock.title}</h3>
              <p className="text-xs sm:text-sm opacity-90 mt-1">
                {timeBlock.startTime} – {timeBlock.endTime}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isActive && onAddTask && (
              <button
                onClick={onAddTask}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 active:bg-opacity-40 rounded-full p-2 transition-all duration-200 touch-manipulation"
                title="Taak toevoegen"
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
            {isActive && (
              <div className="bg-white bg-opacity-20 rounded-full px-2 sm:px-3 py-1 flex-shrink-0">
                <span className="text-xs font-medium whitespace-nowrap">ACTIEF</span>
              </div>
            )}
          </div>
        </div>
        
        {totalTasks > 0 && (
          <div className="mt-3 sm:mt-3">
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

      <div className="p-3 sm:p-4">
        {timeBlock.tasks.length > 0 ? (
          <div className="space-y-1 sm:space-y-2">
            {timeBlock.tasks.map((task) => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onToggle={onTaskToggle} 
                onRemove={task.isCustom ? onRemoveTask : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-3 sm:py-4 text-gray-500">
            <span className="text-sm">Geen specifieke taken</span>
            {isActive && onAddTask && (
              <button
                onClick={onAddTask}
                className="block mx-auto mt-2 px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 active:bg-blue-300 text-blue-700 rounded-full transition-colors duration-200 touch-manipulation"
              >
                + Taak toevoegen
              </button>
            )}
          </div>
        )}

        {hasCustomTasks && (
          <div className="mt-2 pt-2 border-t border-blue-100">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-blue-600 font-medium">Aangepaste taken</span>
            </div>
          </div>
        )}

        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
          <div className="flex items-start space-x-2">
            <Info className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 mt-0.5 flex-shrink-0" />
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