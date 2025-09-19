// Simple date formatting utilities to replace date-fns
export function format(date: Date, formatStr: string): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const shortMonthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  switch (formatStr) {
    case "yyyy-MM-dd":
      return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    case "MMM d, yyyy":
      return `${shortMonthNames[date.getMonth()]} ${day}, ${year}`;
    case "MMMM d, yyyy":
      return `${monthNames[date.getMonth()]} ${day}, ${year}`;
    case "PPP":
      return `${monthNames[date.getMonth()]} ${day}, ${year}`;
    default:
      return date.toLocaleDateString();
  }
}
