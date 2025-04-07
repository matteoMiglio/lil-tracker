import { formatDate } from "date-fns";
import { it } from "date-fns/locale";
import {
  DateFormatter,
  getLocalTimeZone,
  type DateValue,
} from "@internationalized/date";

export const currencyFormatter = new Intl.NumberFormat(it.code, {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const formatDateString = (date: string) => {
  const parsedDate = new Date(date);
  return formatDate(parsedDate, "dd/MM/yyyy", {
    locale: it,
  });
};

export const formatLongDateString = (date: string) => {
  const parsedDate = new Date(date);
  return formatDate(parsedDate, "PPPP - p", {
    locale: it,
  });
};

const df = new DateFormatter(it.code, {
  dateStyle: "long",
});

export const formatDateValue = (date: DateValue) => {
  return df.format(date.toDate(getLocalTimeZone()));
};
