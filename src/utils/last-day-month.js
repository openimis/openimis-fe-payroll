export default function getLastDayOfMonth(runMonth, runYear) {
  // Create a new Date object for the first day of the next month
  const nextMonthDate = new Date(runYear, runMonth, 1);

  // Subtract 1 day from the first day of the next month to get the last day of the current month
  const lastDayOfMonth = new Date(nextMonthDate - 1);

  return lastDayOfMonth;
}
