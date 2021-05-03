export const getCurrYearMonthDay = () => {
  const date = new Date();
  const currYear = date.getFullYear();
  const currMonth = date.getMonth();
  const currDay = date.getDate();

  return { year: currYear, month: currMonth, day: currDay };
};
