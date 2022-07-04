import "reflect-metadata";

import { ICreateTodoDTO } from "@modules/todos/dtos/ICreateTodoDTO";
import { ITodosRepository } from "@modules/todos/repositories/ITodosRepository";
import { CreateTodoUseCase } from "@modules/todos/useCases/createTodo/CreateTodoUseCase";
import { TodosRepositoryInMemory } from "@test/inMemoryRepositories/TodosRepositoryInMemory";

describe("Create todo use case", () => {
  let todosRepository: ITodosRepository;

  let createTodoUseCase: CreateTodoUseCase;

  beforeAll(() => {
    todosRepository = new TodosRepositoryInMemory();
    createTodoUseCase = new CreateTodoUseCase(todosRepository);
  });

  it("Should be able to create a new todo", async () => {
    const newTodoData: ICreateTodoDTO = {
      account_id: "9091e661-a3e2-41de-aa7c-f3f291f12494",
      content: "Test todo",
      is_completed: false,
      due_to: new Date(),
    };
    const newTodo = await createTodoUseCase.execute(newTodoData);

    expect(newTodo).toHaveProperty("id");
  });

  it("Should be able to create a new todo without is_completed or due_to properties", async () => {
    const newTodoData: ICreateTodoDTO = {
      account_id: "9091e661-a3e2-41de-aa7c-f3f291f12494",
      content: "Test todo",
    };

    const newTodo = await createTodoUseCase.execute(newTodoData);

    expect(newTodo).toHaveProperty("id");
    expect(newTodo.is_completed).toBe(false);
  });
});
