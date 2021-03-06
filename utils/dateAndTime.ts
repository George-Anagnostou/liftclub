const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const getCurrYearMonthDay = () => {
  const date = new Date();
  const currYear = date.getFullYear();
  const currMonth = date.getMonth();
  const currDay = date.getDate();

  return { year: currYear, month: currMonth, day: currDay };
};

export const timeSince = (previous: number, current = Date.now()) => {
  if (isNaN(previous)) return;

  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    const seconds = Math.round(elapsed / 1000);
    return seconds > 1 ? seconds + " seconds ago" : seconds + " second ago";
  } else if (elapsed < msPerHour) {
    const minutes = Math.round(elapsed / msPerMinute);
    return minutes > 1 ? minutes + " minutes ago" : minutes + " minute ago";
  } else if (elapsed < msPerDay) {
    const hours = Math.round(elapsed / msPerHour);
    return hours > 1 ? hours + " hours ago" : hours + " hour ago";
  } else if (elapsed < msPerMonth) {
    const days = Math.round(elapsed / msPerDay);
    return days > 1 ? days + " days ago" : days + " day ago";
  } else if (elapsed < msPerYear) {
    const months = Math.round(elapsed / msPerMonth);
    return months > 1 ? months + " months ago" : months + " month ago";
  } else {
    const years = Math.round(elapsed / msPerYear);
    return years > 1 ? years + " years ago" : years + " year ago";
  }
};

export const daysBetween = (iso1: string, iso2: string) => {
  var msPerDay = 1000 * 60 * 60 * 24;
  var elapsed = new Date(iso2).getTime() - new Date(iso1).getTime();

  const days = Math.round(elapsed / msPerDay);
  return days;
};

/**
 *
 * @param isoDate ISO date string
 * @param offset Positive or negative number signifying how many days you want the date to be offset from the isoDate parameter
 * @returns a string Eg: "May 21, 2021"
 */
export const formatIsoDate = (isoDate: string, offset: number = 0) => {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate() + offset;

  return `${MONTHS[month]} ${day}, ${year}`;
};

/**
 * @param date1 iso date string
 * @param date2 iso date string
 * @returns boolean signifying whether the two iso dates are the same day
 */
export const areTheSameDate = (date1: string, date2: string): boolean => {
  if (!date1 || !date2) return false;
  return date1.substring(0, 10) === date2.substring(0, 10);
};

/**
 *
 * @param date Date Object
 * @returns local ISO date string
 */
export const dateToISOWithLocal = (date: Date) => {
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  const msLocal = date.getTime() - offsetMs;
  const dateLocal = new Date(msLocal);
  const iso = dateLocal.toISOString();
  const isoLocal = iso.slice(0, 19);
  return isoLocal;
};

/**
 *
 * @param date1
 * @param date2
 * @returns
 */
export function dateCompare(date1: string, date2: string) {
  return new Date(date2) > new Date(date1);
}

/**
 *
 * @param numOfDaysToShift optional parameter for how many days to shift the returned date (positive is future, negative is past)
 * @returns the first 10 characters of an ISO date string. Eg: "2021-05-10"
 */
export const formatWorkoutLogKeyString = (numOfDaysToShift: number = 0) => {
  const { year, month, day } = getCurrYearMonthDay();
  // Current date
  const date = new Date(year, month, day);
  // Shifted date
  date.setDate(date.getDate() + numOfDaysToShift);

  const newDate = date.toISOString().substring(0, 10);
  return newDate;
};
