import dayjs from 'dayjs';

export const formatDisplayDate = (date: Date | undefined) => {
  if (!date) return '';
  return dayjs(date).format('MMMM DD, YYYY');
};

export const toIsoDateString = (
  date: Date | string,
  format: string = 'YYYY-MM-DD',
): string => {
  return dayjs(date).format(format);
};

export const isValidDate = (date: Date | undefined) => {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
};
