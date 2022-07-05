import "reflect-metadata";

import { ICreateTodoDTO } from "@modules/todos/dtos/ICreateTodoDTO";
import { ITodosRepository } from "@modules/todos/repositories/ITodosRepository";
import { CreateTodoUseCase } from "@modules/todos/useCases/createTodo/CreateTodoUseCase";
import { GetTodosUseCase } from "@modules/todos/useCases/getTodos/GetTodosUseCase";
import { TodosRepositoryInMemory } from "@test/inMemoryRepositories/TodosRepositoryInMemory";

describe("Get todos use case", () => {
  let todosRepository: ITodosRepository;

  let createTodoUseCase: CreateTodoUseCase;

  let todo1Data: ICreateTodoDTO, todo2Data: ICreateTodoDTO;

  let getTodosUseCase: GetTodosUseCase;

  beforeAll(async () => {
    todosRepository = new TodosRepositoryInMemory();
    createTodoUseCase = new CreateTodoUseCase(todosRepository);
    getTodosUseCase = new GetTodosUseCase(todosRepository);

    todo1Data = {
      account_id: "9091e661-a3e2-41de-aa7c-f3f291f12494",
      content: "Test todo 1",
      is_completed: false,
      due_to: new Date(),
    };
    await createTodoUseCase.execute(todo1Data);

    todo2Data = {
      account_id: "e6c16ea0-4341-4afb-a0f8-9447abae4e9f",
      content: "Test todo 2",
      is_completed: false,
      due_to: new Date(),
    };
    await createTodoUseCase.execute(todo2Data);
  });

  it("Should be able to get todos.", async () => {
    const todosList = await getTodosUseCase.execute(todo1Data.account_id);

    expect(todosList).toHaveLength(1);
  });
});
