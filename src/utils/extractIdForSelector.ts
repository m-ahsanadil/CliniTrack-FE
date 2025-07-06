  export const extractId = (value: any): string => {
    if (typeof value === 'string') {
      return value;
    }
    if (typeof value === 'object' && value !== null) {
      return value._id || value.id || '';
    }
    return '';
  };