const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const getCurrYearMonthDay = () => {
  const date = new Date();
  const currYear = date.getFullYear();
  const currMonth = date.getMonth();
  const currDay = date.getDate();

  return { year: currYear, month: currMonth, day: currDay };
};

export const timeSince = (previous, current = Date.now()) => {
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
  return days > 1 ? days + " days" : days + " day";
};

export const formatIsoDate = (isoDate: string) => {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  return `${MONTHS[month]} ${day}, ${year}`;
};

/**
 * @param date1 iso date string
 * @param date2 iso date string
 * @returns boolean signifying whether the two iso dates are the same day
 */
export const stripTimeAndCompareDates = (date1: string, date2: string): boolean => {
  if (!date1 || !date2) return false;
  return date1.substring(0, 10) === date2.substring(0, 10);
};
