import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (taskText: string) => void;
  timeBlockTitle: string;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ 
  isOpen, 
  onClose, 
  onAddTask, 
  timeBlockTitle 
}) => {
  const [taskText, setTaskText] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTaskText('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskText.trim()) {
      onAddTask(taskText.trim());
      setTaskText('');
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto transform transition-all duration-200"
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Taak Toevoegen
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Voor tijdblok: <span className="text-blue-600 font-semibold">{timeBlockTitle}</span>
            </label>
            <input
              type="text"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              placeholder="Beschrijf je taak..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm"
              autoFocus
              maxLength={100}
            />
            <div className="text-xs text-gray-500 mt-1">
              {taskText.length}/100 karakters
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg transition-colors duration-200 font-medium text-sm"
            >
              Annuleren
            </button>
            <button
              type="submit"
              disabled={!taskText.trim()}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 font-medium text-sm flex items-center justify-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Toevoegen</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;