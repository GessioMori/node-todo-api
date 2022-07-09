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
  return {
    id: todo.id,
    content: todo.content,
    created_at: todo.created_at,
    is_completed: todo.is_completed,
    due_to: todo.due_to,
  };
}
