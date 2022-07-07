export interface ITodo {
  id: string;

  account_id?: string;

  content: string;

  is_completed: boolean;

  due_to: Date;

  created_at: Date;
}
