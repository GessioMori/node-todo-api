import "reflect-metadata";

import { ICreateTodoDTO } from "@modules/todos/dtos/ICreateTodoDTO";
import { ITodosRepository } from "@modules/todos/repositories/ITodosRepository";
import { CreateTodoUseCase } from "@modules/todos/useCases/createTodo/CreateTodoUseCase";
import { DeleteTodoUseCase } from "@modules/todos/useCases/deleteTodo/DeleteTodoUseCase";
import { AppError } from "@shared/errors/AppError";
import { TodosRepositoryInMemory } from "@test/inMemoryRepositories/TodosRepositoryInMemory";
import { mappedTodo } from "@utils/mappers/todoMapper";

describe("Delete todo use case", () => {
  let todosRepository: ITodosRepository;

  let createTodoUseCase: CreateTodoUseCase;

  let todoData: ICreateTodoDTO;

  let todo: mappedTodo;

  let deleteTodoUseCase: DeleteTodoUseCase;

  beforeAll(async () => {
    todosRepository = new TodosRepositoryInMemory();
    createTodoUseCase = new CreateTodoUseCase(todosRepository);
    deleteTodoUseCase = new DeleteTodoUseCase(todosRepository);

    todoData = {
      account_id: "9091e661-a3e2-41de-aa7c-f3f291f12494",
      content: "Test todo",
      is_completed: false,
      due_to: new Date(),
    };
    todo = await createTodoUseCase.execute(todoData);
  });

  it("Should be able to delete a todo with right credentials.", () => {
    expect(async () => {
      await deleteTodoUseCase.execute(todo.id, todoData.account_id);
    }).not.toThrow();
  });

  it("Should not be able to update a todo with wrong credentials.", () => {
    expect(async () => {
      await deleteTodoUseCase.execute(
        todo.id,
        "ceff28ca-5850-4ba9-85fe-022d26b27ff6"
      );
    }).rejects.toBeInstanceOf(AppError);
  });
});
