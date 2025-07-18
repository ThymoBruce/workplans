import React from 'react';
import { Calendar } from 'lucide-react';
import CurrentTime from './components/CurrentTime';
import TimeBlockCard from './components/TimeBlockCard';
import ProgressStats from './components/ProgressStats';
import { useSchedule } from './hooks/useSchedule';

function App() {
  const { 
    schedule, 
    currentTimeBlock, 
    toggleTask, 
    resetAllTasks, 
    getCompletionStats 
  } = useSchedule();

  const stats = getCompletionStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-white rounded-full shadow-md">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">
              Werkdag Planning
            </h1>
          </div>
          <p className="text-gray-600">
            Dynamische taakplanning gebaseerd op de huidige tijd
          </p>
        </div>

        {/* Current Time */}
        <CurrentTime />

        {/* Progress Stats */}
        <ProgressStats stats={stats} onReset={resetAllTasks} />

        {/* Current Time Block Highlight */}
        {currentTimeBlock && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></span>
              Nu Actief
            </h2>
            <TimeBlockCard
              timeBlock={currentTimeBlock}
              isActive={true}
              onTaskToggle={toggleTask}
            />
          </div>
        )}

        {/* All Time Blocks */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Volledige Dagplanning
          </h2>
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {schedule.map((timeBlock) => (
              <TimeBlockCard
                key={timeBlock.id}
                timeBlock={timeBlock}
                isActive={currentTimeBlock?.id === timeBlock.id}
                onTaskToggle={toggleTask}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Gemaakt voor optimale productiviteit en overzicht
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;