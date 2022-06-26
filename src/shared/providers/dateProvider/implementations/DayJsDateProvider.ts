import dayjs from "dayjs";
import { IDateProvider } from "../IDateProvider";

export class DayJsDateProvider implements IDateProvider {
  getDate(): string {
    return dayjs().format();
  }

  addDaysFromNow(days: number): Date {
    return dayjs().add(days, "days").toDate();
  }

  addHoursFromNow(hours: number): Date {
    return dayjs().add(hours, "hours").toDate();
  }

  checkIfPast(date: Date): boolean {
    return dayjs().isAfter(date);
  }
}
