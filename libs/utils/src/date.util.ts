import * as dayjs from 'dayjs';
import * as isBetween from 'dayjs/plugin/isBetween.js';
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';
import * as utc from 'dayjs/plugin/utc.js';

dayjs.extend(utc);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(isBetween);

type DateValue = Date | string | number;

export const newDate = (date: DateValue) => new Date(date);

export const getStartDate = (date: DateValue) =>
  new Date(new Date(date).setHours(0, 0, 0, 0));

export const getEndDate = (date: DateValue) =>
  new Date(new Date(date).setHours(23, 59, 59, 999));

export const getStartAndEndDate = (date: DateValue | undefined) =>
  date ? [getStartDate(date), getEndDate(date)] : [undefined, undefined];

export const getStartMonth = (date: DateValue) =>
  new Date(new Date(date).setDate(1));

export const getEndMonth = (date: DateValue) =>
  new Date(new Date(date).getFullYear(), new Date(date).getMonth() + 1, 1);

export const getAllDatesBetween = (
  startDate: DateValue,
  endDate: DateValue,
) => {
  const dates: Date[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

interface TimeSlot {
  start: string;
  end: string;
}

export function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function toTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function isOverlap(
  startA: number,
  endA: number,
  startB: number,
  endB: number,
): boolean {
  return startA < endB && startB < endA;
}

export function getFreeSlot(
  workingHours: TimeSlot,
  events: TimeSlot[],
  stepMinutes: number,
): string[] {
  const busySlots = events.map((e) => ({
    start: toMinutes(e.start),
    end: toMinutes(e.end),
  }));

  const result: string[] = [];
  const start = toMinutes(workingHours.start);
  const end = toMinutes(workingHours.end);

  for (let t = start; t + stepMinutes <= end; t += stepMinutes) {
    const slotStart = t;
    const slotEnd = t + stepMinutes;

    const overlap = busySlots.some((event) =>
      isOverlap(slotStart, slotEnd, event.start, event.end),
    );

    if (!overlap) {
      result.push(toTime(slotStart));
    }
  }

  return result;
}

export class DateJS {
  static isBetween(
    date: dayjs.ConfigType,
    a: dayjs.ConfigType,
    b: dayjs.ConfigType,
    c?: dayjs.OpUnitType | null,
    d?: '()' | '[]' | '[)' | '(]',
  ) {
    return dayjs.utc(date).isBetween(a, b, c, d);
  }

  static utc(date?: dayjs.ConfigType) {
    return dayjs.utc(date);
  }
  static sameOrBefore(
    date: dayjs.ConfigType,
    dateToCompare?: dayjs.ConfigType,
    unit?: dayjs.OpUnitType,
  ) {
    return dayjs.utc(date).isSameOrBefore(dateToCompare, unit);
  }
  static sameOrAfter(
    date: dayjs.ConfigType,
    dateToCompare?: dayjs.ConfigType,
    unit?: dayjs.OpUnitType,
  ) {
    return dayjs.utc(date).isSameOrAfter(dateToCompare, unit);
  }
  /**
   * Get the start of the day
   * @param date - The date to get the start of the day from
   * @param value - The hours to add to the start of the day
   * @returns The start of the day
   */
  static getStartOfDay(date: dayjs.ConfigType, value = 0) {
    return dayjs(date).startOf('day').add(value, 'hour');
  }
  /**
   * Get the end of the day
   * @param date - The date to get the end of the day from
   * @param value - The hours to add to the end of the day
   * @returns The end of the day
   */
  static getEndOfDay(date: dayjs.ConfigType, value = 0) {
    return dayjs(date).endOf('day').add(value, 'hour');
  }
  /**
   * Check if the date is a weekend
   * @param date - The date to check if it is a weekend
   * @returns True if the date is a weekend, false otherwise
   */
  static isWeekend(date: dayjs.ConfigType) {
    return dayjs(date).get('day') === 0 || dayjs(date).get('day') === 6;
  }

  /**
   * Format the date
   * @param date - The date to format
   * @param format - The format to format the date to
   * @returns The formatted date
   */
  static format(date: dayjs.ConfigType, format: string) {
    return dayjs(date).format(format);
  }

  /**
   * Set the time of the date
   * @param date - The date to set the time of
   * @param time - The time to set the date to
   * @returns The date with the time set
   */
  static setTime(date: dayjs.ConfigType, time: [number, number]) {
    return dayjs(date).set('hour', time[0]).set('minute', time[1]);
  }

  /**
   * Get the time from a time string
   * @param timeString - The time string to get the time from HH:mm
   * @returns [hour: number, minute: number]
   *
   */
  static getTimeFromString(timeString: string) {
    const [hour, minute] = timeString.split(':').map(Number);
    return [hour, minute];
  }

  /**
   * Get the time from a date
   * @param date - The date to get the time from Date object
   * @returns [hour: number, minute: number]
   *
   */
  static getTimeFromDate(date: dayjs.ConfigType) {
    return [dayjs(date).get('hour'), dayjs(date).get('minute')];
  }

  static now() {
    return dayjs();
  }

  static make(date: dayjs.ConfigType) {
    return dayjs(date);
  }

  static diff(
    start: dayjs.ConfigType,
    end: dayjs.ConfigType,
    unit: dayjs.OpUnitType,
  ) {
    return dayjs(end).diff(start, unit);
  }
}
