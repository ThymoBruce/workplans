import React from 'react';
import { Check, X } from 'lucide-react';
import { Task } from '../types/schedule';

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onRemove?: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onRemove }) => {
  return (
    <div 
      className={`flex items-center space-x-3 p-3 sm:p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 active:bg-gray-100 cursor-pointer touch-manipulation ${
        task.completed ? 'bg-green-50' : task.isCustom ? 'bg-blue-50' : 'bg-white'
      }`}
    >
      <div className={`
        w-5 h-5 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0
        ${task.completed 
          ? 'bg-green-500 border-green-500' 
          : 'border-gray-300 hover:border-green-400'
        }
      `}>
        {task.completed && <Check className="h-3 w-3 sm:h-3 sm:w-3 text-white" />}
      </div>
      <span 
        className={`
        text-sm sm:text-sm transition-all duration-200 leading-relaxed flex-1 cursor-pointer
        ${task.completed 
          ? 'line-through text-gray-500' 
          : task.isCustom 
            ? 'text-blue-700 font-medium' 
            : 'text-gray-700'
        }
      `}
        onClick={() => onToggle(task.id)}
      >
        {task.text}
      </span>
      {task.isCustom && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(task.id);
          }}
          className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors duration-200 flex-shrink-0"
          title="Verwijder aangepaste taak"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
};

export default TaskItem;