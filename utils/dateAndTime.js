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
