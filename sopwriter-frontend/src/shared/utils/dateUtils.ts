/**
 * Format a date string into separate date and time components
 * @param dateString - ISO date string to format
 * @returns Object containing formatted date and time strings
 */
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  };
};

/**
 * Format a date string for display in tables
 * @param dateString - ISO date string to format
 * @returns Formatted date string
 */
export const formatTableDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

/**
 * Format a date and time for display in tables
 * @param dateString - ISO date string to format
 * @returns Formatted date and time string
 */
export const formatTableDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })}`;
};