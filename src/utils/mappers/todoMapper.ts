type originalTodo = {
  id: string;
  account_id: string;
  content: string;
  created_at: Date;
  is_completed: boolean;
  due_to: Date | null;
};

export type mappedTodo = Omit<originalTodo, "account_id">;

export function todoMapper(todo: originalTodo): mappedTodo {
  delete todo.account_id;
  return todo;
}
