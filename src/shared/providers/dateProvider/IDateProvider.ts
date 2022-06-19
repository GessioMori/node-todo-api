export interface IDateProvider {
  getDate(): string;
  addDaysFromNow(days: number): Date;
  checkIfPast(date: Date): boolean;
}
