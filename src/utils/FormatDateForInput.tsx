import { format, parseISO, isValid } from 'date-fns';

export const formatDateForInput = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    // Parse the ISO string
    const date = parseISO(dateString);
    
    // Check if date is valid
    if (!isValid(date)) return '';
    
    // Format as YYYY-MM-DD
    return format(date, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};
