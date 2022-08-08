import "reflect-metadata";

import { ICreateTodoDTO } from "@modules/todos/dtos/ICreateTodoDTO";
import { ITodosRepository } from "@modules/todos/repositories/ITodosRepository";
import { CreateTodoUseCase } from "@modules/todos/useCases/createTodo/CreateTodoUseCase";
import { GetTodosByDateUseCase } from "@modules/todos/useCases/getTodosByDate/GetTodosByDateUseCase";
import { TodosRepositoryInMemory } from "@test/inMemoryRepositories/TodosRepositoryInMemory";

describe("Get todos by date use case", () => {
  let todosRepository: ITodosRepository;
  let createTodoUseCase: CreateTodoUseCase;
  let getTodosByDateUseCase: GetTodosByDateUseCase;
  let todo1Data: ICreateTodoDTO,
    todo2Data: ICreateTodoDTO,
    todo3Data: ICreateTodoDTO;

  beforeAll(async () => {
    todosRepository = new TodosRepositoryInMemory();
    createTodoUseCase = new CreateTodoUseCase(todosRepository);
    getTodosByDateUseCase = new GetTodosByDateUseCase(todosRepository);

    todo1Data = {
      account_id: "9091e661-a3e2-41de-aa7c-f3f291f12494",
      content: "Test todo 1",
      is_completed: false,
      due_to: new Date("2022-08-08T18:35:11.253Z"),
    };
    await createTodoUseCase.execute(todo1Data);

    todo2Data = {
      account_id: "e6c16ea0-4341-4afb-a0f8-9447abae4e9f",
      content: "Test todo 2",
      is_completed: false,
      due_to: new Date("2022-08-08T18:35:11.253Z"),
    };
    await createTodoUseCase.execute(todo2Data);

    todo3Data = {
      account_id: "e6c16ea0-4341-4afb-a0f8-9447abae4e9f",
      content: "Test todo 3",
      is_completed: false,
      due_to: new Date("2022-07-08T18:35:11.253Z"),
    };
    await createTodoUseCase.execute(todo3Data);
  });

  it("Should be able to get only the todos the user is the owner", async () => {
    const todosList = await getTodosByDateUseCase.execute({
      account_id: todo2Data.account_id,
      begin: "2022-01-08T18:35:11.253Z",
      end: "2022-12-08T18:35:11.253Z",
    });
    expect(todosList).toHaveLength(2);
  });

  it("Should receive todos without sending a begin date", async () => {
    const todosList = await getTodosByDateUseCase.execute({
      account_id: todo2Data.account_id,
      end: "2022-12-08T18:35:11.253Z",
    });
    expect(todosList).toHaveLength(2);
  });

  it("Should receive todos without sending an end date", async () => {
    const todosList = await getTodosByDateUseCase.execute({
      account_id: todo2Data.account_id,
      begin: "2022-01-08T18:35:11.253Z",
    });
    expect(todosList).toHaveLength(2);
  });

  it("Should receive todos between a proper interval", async () => {
    const todosList = await getTodosByDateUseCase.execute({
      account_id: todo2Data.account_id,
      begin: "2022-09-08T18:35:11.253Z",
      end: "2022-12-08T18:35:11.253Z",
    });
    expect(todosList).toHaveLength(0);
  });
});
