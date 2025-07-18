import { useState, useEffect } from 'react';
import { scheduleData } from '../data/schedule';
import { TimeBlock } from '../types/schedule';
import { getCurrentTimeInMinutes, isTimeInRange } from '../utils/timeUtils';

export const useSchedule = () => {
  const [schedule, setSchedule] = useState<TimeBlock[]>(scheduleData);
  const [currentTimeBlock, setCurrentTimeBlock] = useState<TimeBlock | null>(null);

  useEffect(() => {
    const updateCurrentTimeBlock = () => {
      const currentTime = getCurrentTimeInMinutes();
      const activeBlock = schedule.find(block => 
        isTimeInRange(currentTime, block.startTime, block.endTime)
      );
      setCurrentTimeBlock(activeBlock || null);
    };

    // Update immediately
    updateCurrentTimeBlock();

    // Update every minute
    const interval = setInterval(updateCurrentTimeBlock, 60000);

    return () => clearInterval(interval);
  }, [schedule]);

  const toggleTask = (taskId: string) => {
    setSchedule(prevSchedule => 
      prevSchedule.map(block => ({
        ...block,
        tasks: block.tasks.map(task => 
          task.id === taskId 
            ? { ...task, completed: !task.completed }
            : task
        )
      }))
    );
  };

  const resetAllTasks = () => {
    setSchedule(prevSchedule =>
      prevSchedule.map(block => ({
        ...block,
        tasks: block.tasks.map(task => ({
          ...task,
          completed: false
        }))
      }))
    );
  };

  const getCompletionStats = () => {
    const allTasks = schedule.flatMap(block => block.tasks);
    const completedTasks = allTasks.filter(task => task.completed);
    return {
      total: allTasks.length,
      completed: completedTasks.length,
      percentage: allTasks.length > 0 ? (completedTasks.length / allTasks.length) * 100 : 0
    };
  };

  return {
    schedule,
    currentTimeBlock,
    toggleTask,
    resetAllTasks,
    getCompletionStats
  };
};