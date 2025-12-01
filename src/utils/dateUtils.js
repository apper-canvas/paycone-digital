import { format, formatDistance, isToday, isYesterday } from "date-fns";

export const formatTransactionDate = (date) => {
  const transactionDate = new Date(date);
  
  if (isToday(transactionDate)) {
    return `Today, ${format(transactionDate, "h:mm a")}`;
  }
  
  if (isYesterday(transactionDate)) {
    return `Yesterday, ${format(transactionDate, "h:mm a")}`;
  }
  
  return format(transactionDate, "MMM dd, h:mm a");
};

export const formatRelativeTime = (date) => {
  return formatDistance(new Date(date), new Date(), { addSuffix: true });
};

export const formatDateOnly = (date) => {
  return format(new Date(date), "MMM dd, yyyy");
};