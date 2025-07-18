import React from 'react';
import { Calendar } from 'lucide-react';
import CurrentTime from './components/CurrentTime';
import TimeBlockCard from './components/TimeBlockCard';
import ProgressStats from './components/ProgressStats';
import AddTaskModal from './components/AddTaskModal';
import { useSchedule } from './hooks/useSchedule';

function App() {
  const { 
    schedule, 
    currentTimeBlock, 
    toggleTask, 
    addCustomTask,
    removeCustomTask,
    resetAllTasks, 
    getCompletionStats 
  } = useSchedule();
  
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = React.useState(false);

  const stats = getCompletionStats();

  const handleAddTask = (taskText: string) => {
    if (currentTimeBlock) {
      addCustomTask(currentTimeBlock.id, taskText);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-white rounded-full shadow-md">
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 leading-tight">
              Werkdag Planning
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600 px-4">
            Dynamische taakplanning gebaseerd op de huidige tijd
          </p>
        </div>

        {/* Current Time */}
        <CurrentTime />

        {/* Progress Stats */}
        <ProgressStats stats={stats} onReset={resetAllTasks} />

        {/* Current Time Block Highlight */}
        {currentTimeBlock && (
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center px-1">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></span>
              Nu Actief
            </h2>
            <TimeBlockCard
              timeBlock={currentTimeBlock}
              isActive={true}
              onTaskToggle={toggleTask}
              onAddTask={() => setIsAddTaskModalOpen(true)}
              onRemoveTask={removeCustomTask}
            />
          </div>
        )}

        {/* All Time Blocks */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 px-1">
            Volledige Dagplanning
          </h2>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
            {schedule.map((timeBlock) => (
              <TimeBlockCard
                key={timeBlock.id}
                timeBlock={timeBlock}
                isActive={currentTimeBlock?.id === timeBlock.id}
                onTaskToggle={toggleTask}
                onAddTask={currentTimeBlock?.id === timeBlock.id ? () => setIsAddTaskModalOpen(true) : undefined}
                onRemoveTask={removeCustomTask}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6 sm:py-8 border-t border-gray-200">
          <p className="text-xs sm:text-sm text-gray-500 px-4">
            Gemaakt voor optimale productiviteit en overzicht
          </p>
        </div>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onAddTask={handleAddTask}
        timeBlockTitle={currentTimeBlock?.title || ''}
      />
    </div>
  );
}

export default App;