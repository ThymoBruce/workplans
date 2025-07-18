import React from 'react';
import { Check } from 'lucide-react';
import { Task } from '../types/schedule';

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle }) => {
  return (
    <div 
      className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 cursor-pointer ${
        task.completed ? 'bg-green-50' : 'bg-white'
      }`}
      onClick={() => onToggle(task.id)}
    >
      <div className={`
        w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200
        ${task.completed 
          ? 'bg-green-500 border-green-500' 
          : 'border-gray-300 hover:border-green-400'
        }
      `}>
        {task.completed && <Check className="h-3 w-3 text-white" />}
      </div>
      <span className={`
        text-sm transition-all duration-200
        ${task.completed 
          ? 'line-through text-gray-500' 
          : 'text-gray-700'
        }
      `}>
        {task.text}
      </span>
    </div>
  );
};

export default TaskItem;