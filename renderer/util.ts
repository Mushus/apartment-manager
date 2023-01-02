import dayjs from 'dayjs';

export const numToForm = (v: number | null) => (v || v === 0 ? String(v) : '');
export const formToNum = (v: string) => {
  const num = Number.parseFloat(v);
  return Number.isInteger(num) ? num : null;
};
export const dateToForm = (v: Date | null) => {
  if (v === null) return null;
  return dayjs(v).format('YYYY-MM-DD');
};
export const formToDate = (v: string | null) => {
  if (v === null) return null;
  return dayjs(v).toDate();
};
