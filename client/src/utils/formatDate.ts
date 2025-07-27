import { format } from 'date-fns';

export const formattedDate = (date: Date): string => {
  return format(new Date(date), 'dd MMMM yyyy');
};
