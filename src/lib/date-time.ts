import dayjs from "dayjs";

export function formatDateTime(date: Date | string | number) {
  return dayjs(date).format("h:mm A");
}
