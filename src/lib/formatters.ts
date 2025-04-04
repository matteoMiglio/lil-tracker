import { formatDate } from "date-fns";

export const currencyFormatter = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const formatDateString = (date: string) => {
  const parsedDate = new Date(date);
  return formatDate(parsedDate, "dd/MM/yyyy");
};
