export const getCurrentTimeInMinutes = (): number => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

export const timeStringToMinutes = (timeString: string): number => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

export const isTimeInRange = (currentTime: number, startTime: string, endTime: string): boolean => {
  const start = timeStringToMinutes(startTime);
  const end = timeStringToMinutes(endTime);
  return currentTime >= start && currentTime < end;
};