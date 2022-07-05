export interface IUpdateTodoDTO {
  id: string;
  content?: string;
  is_completed?: boolean;
  due_to?: Date;
}
