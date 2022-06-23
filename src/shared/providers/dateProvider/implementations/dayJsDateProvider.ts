import dayjs from "dayjs";
import { IDateProvider } from "../IDateProvider";

export class dayJsDateProvider implements IDateProvider {
  getDate(): string {
    return dayjs().format();
  }

  addDaysFromNow(days: number): Date {
    return dayjs().add(days, "days").toDate();
  }

  checkIfPast(date: Date): boolean {
    return dayjs().isAfter(date);
  }
}
