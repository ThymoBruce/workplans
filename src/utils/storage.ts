export interface StoredScheduleData {
  completedTasks: string[];
  customTasks: {
    timeBlockId: string;
    task: {
      id: string;
      text: string;
      completed: boolean;
      isCustom: boolean;
    };
  }[];
  lastUpdated: string;
}

const STORAGE_KEY = 'work-schedule-data';

export const saveScheduleData = (data: StoredScheduleData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save schedule data to localStorage:', error);
  }
};

export const loadScheduleData = (): StoredScheduleData | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const data = JSON.parse(stored) as StoredScheduleData;
    
    // Check if data is from today (reset if it's a new day)
    const today = new Date().toDateString();
    const lastUpdated = new Date(data.lastUpdated).toDateString();
    
    if (today !== lastUpdated) {
      // Clear old data if it's a new day
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    
    return data;
  } catch (error) {
    console.warn('Failed to load schedule data from localStorage:', error);
    return null;
  }
};

export const clearScheduleData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear schedule data from localStorage:', error);
  }
};