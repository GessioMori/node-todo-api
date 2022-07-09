import "reflect-metadata";

import { ICreateTodoDTO } from "@modules/todos/dtos/ICreateTodoDTO";
import { ITodosRepository } from "@modules/todos/repositories/ITodosRepository";
import { CreateTodoUseCase } from "@modules/todos/useCases/createTodo/CreateTodoUseCase";
import { UpdateTodoUseCase } from "@modules/todos/useCases/updateTodo/UpdateTodoUseCase";
import { AppError } from "@shared/errors/AppError";
import { TodosRepositoryInMemory } from "@test/inMemoryRepositories/TodosRepositoryInMemory";
import { mappedTodo } from "@utils/mappers/todoMapper";

describe("Update todo use case", () => {
  let todosRepository: ITodosRepository;

  let createTodoUseCase: CreateTodoUseCase;

  let todoData: ICreateTodoDTO;

  let todo: mappedTodo;

  let updateTodoUseCase: UpdateTodoUseCase;

  beforeAll(async () => {
    todosRepository = new TodosRepositoryInMemory();
    createTodoUseCase = new CreateTodoUseCase(todosRepository);
    updateTodoUseCase = new UpdateTodoUseCase(todosRepository);

    todoData = {
      account_id: "9091e661-a3e2-41de-aa7c-f3f291f12494",
      content: "Test todo",
      is_completed: false,
      due_to: new Date(),
    };
    todo = await createTodoUseCase.execute(todoData);
  });

  it("Should be able to update a todo with right credentials.", async () => {
    const todoResponse = await updateTodoUseCase.execute(
      {
        id: todo.id,
        content: "Updated todo",
        is_completed: true,
      },
      todoData.account_id
    );

    expect(todoResponse.is_completed).toBe(true);
    expect(todoResponse.content).toBe("Updated todo");
    expect(todoResponse.id).toBe(todo.id);
    expect(todoResponse.due_to).toBe(todoData.due_to);
  });

  it("Should not be able to update a todo with wrong credentials.", () => {
    expect(async () => {
      await updateTodoUseCase.execute(
        {
          id: todo.id,
          content: "Updated todo",
          due_to: new Date(),
        },
        "ceff28ca-5850-4ba9-85fe-022d26b27ff6"
      );
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should not be able to update a non existing todo.", () => {
    expect(async () => {
      await updateTodoUseCase.execute(
        {
          id: "ceff28ca-5850-4ba9-85fe-022d26b27ff6",
          content: "Updated todo",
          due_to: new Date(),
        },
        "ceff28ca-5850-4ba9-85fe-022d26b27ff6"
      );
    }).rejects.toBeInstanceOf(AppError);
  });
});
