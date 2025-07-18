export interface Task {
  id: string;
  text: string;
  completed: boolean;
  isCustom?: boolean;
}

export interface TimeBlock {
  id: string;
  startTime: string;
  endTime: string;
  title: string;
  emoji: string;
  tasks: Task[];
  why: string;
  whyNow: string;
  isRecurring?: boolean;
}