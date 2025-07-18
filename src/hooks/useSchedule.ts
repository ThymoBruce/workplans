import { useState, useEffect } from 'react';
import { scheduleData } from '../data/schedule';
import { TimeBlock } from '../types/schedule';
import { getCurrentTimeInMinutes, isTimeInRange } from '../utils/timeUtils';
import { saveScheduleData, loadScheduleData, clearScheduleData, StoredScheduleData } from '../utils/storage';

export const useSchedule = () => {
  const [schedule, setSchedule] = useState<TimeBlock[]>(scheduleData);
  const [currentTimeBlock, setCurrentTimeBlock] = useState<TimeBlock | null>(null);

  // Load saved data on component mount
  useEffect(() => {
    const savedData = loadScheduleData();
    if (savedData) {
      setSchedule(prevSchedule => {
        let updatedSchedule = prevSchedule.map(block => ({
          ...block,
          tasks: block.tasks.map(task => ({
            ...task,
            completed: savedData.completedTasks.includes(task.id)
          }))
        }));

        // Add custom tasks
        savedData.customTasks.forEach(({ timeBlockId, task }) => {
          updatedSchedule = updatedSchedule.map(block =>
            block.id === timeBlockId
              ? { ...block, tasks: [...block.tasks, task] }
              : block
          );
        });

        return updatedSchedule;
      });
    }
  }, []);

  // Save data whenever schedule changes
  useEffect(() => {
    const saveData = () => {
      const completedTasks = schedule
        .flatMap(block => block.tasks)
        .filter(task => task.completed)
        .map(task => task.id);

      const customTasks = schedule
        .flatMap(block => 
          block.tasks
            .filter(task => task.isCustom)
            .map(task => ({
              timeBlockId: block.id,
              task
            }))
        );

      const dataToSave: StoredScheduleData = {
        completedTasks,
        customTasks,
        lastUpdated: new Date().toISOString()
      };

      saveScheduleData(dataToSave);
    };

    // Debounce saving to avoid excessive localStorage writes
    const timeoutId = setTimeout(saveData, 500);
    return () => clearTimeout(timeoutId);
  }, [schedule]);

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

  const addCustomTask = (timeBlockId: string, taskText: string) => {
    const customTask = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: taskText,
      completed: false,
      isCustom: true
    };

    setSchedule(prevSchedule =>
      prevSchedule.map(block =>
        block.id === timeBlockId
          ? { ...block, tasks: [...block.tasks, customTask] }
          : block
      )
    );
  };

  const removeCustomTask = (taskId: string) => {
    setSchedule(prevSchedule =>
      prevSchedule.map(block => ({
        ...block,
        tasks: block.tasks.filter(task => task.id !== taskId)
      }))
    );
  };

  const resetAllTasks = () => {
    clearScheduleData();
    setSchedule(prevSchedule =>
      prevSchedule.map(block => ({
        ...block,
        tasks: block.tasks
          .filter(task => !task.isCustom)
          .map(task => ({
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
    addCustomTask,
    removeCustomTask,
    resetAllTasks,
    getCompletionStats
  };
};