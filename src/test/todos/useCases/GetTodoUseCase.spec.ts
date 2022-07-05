import "reflect-metadata";

import { ICreateTodoDTO } from "@modules/todos/dtos/ICreateTodoDTO";
import { ITodo } from "@modules/todos/entities/ITodo";
import { ITodosRepository } from "@modules/todos/repositories/ITodosRepository";
import { CreateTodoUseCase } from "@modules/todos/useCases/createTodo/CreateTodoUseCase";
import { GetTodoUseCase } from "@modules/todos/useCases/getTodo/GetTodoUseCase";
import { AppError } from "@shared/errors/AppError";
import { TodosRepositoryInMemory } from "@test/inMemoryRepositories/TodosRepositoryInMemory";

describe("Get todo use case", () => {
  let todosRepository: ITodosRepository;

  let createTodoUseCase: CreateTodoUseCase;

  let todoData: ICreateTodoDTO;

  let todo: ITodo;

  let getTodoUseCase: GetTodoUseCase;

  beforeAll(async () => {
    todosRepository = new TodosRepositoryInMemory();
    createTodoUseCase = new CreateTodoUseCase(todosRepository);
    getTodoUseCase = new GetTodoUseCase(todosRepository);

    todoData = {
      account_id: "9091e661-a3e2-41de-aa7c-f3f291f12494",
      content: "Test todo 1",
      is_completed: false,
      due_to: new Date(),
    };
    todo = await createTodoUseCase.execute(todoData);
  });

  it("Should be able to get a todo with right credentials.", async () => {
    const todoResponse = await getTodoUseCase.execute(
      todo.id,
      todoData.account_id
    );

    expect(todoResponse).toMatchObject(todoData);
  });

  it("Should not be able to get a todo with wrong credentials", () => {
    expect(async () => {
      await getTodoUseCase.execute(
        todo.id,
        "ceff28ca-5850-4ba9-85fe-022d26b27ff6"
      );
    }).rejects.toBeInstanceOf(AppError);
  });
});
