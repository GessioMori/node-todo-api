export interface ICreateTodoDTO {
  account_id: string;
  content: string;
  is_completed?: boolean;
  due_to?: Date;
}
