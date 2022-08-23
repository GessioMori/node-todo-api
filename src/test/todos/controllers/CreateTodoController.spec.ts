import { ICreateAccountDTO } from "@modules/accounts/dtos/ICreateAccountDTO";
import { app } from "@shared/infra/http/app";
import { AppDataSource } from "@shared/infra/typeorm";

import request from "supertest";

describe("Create todo controller", () => {
  let data: ICreateAccountDTO;
  let loginResponse;
  let cookie: string;

  beforeAll(async () => {
    await AppDataSource.initialize();
    await AppDataSource.runMigrations();

    data = {
      email: "test@test.com",
      name: "Tester",
      password: "testpassword",
    };

    await request(app).post("/account/").send(data);

    loginResponse = await request(app).post("/account/login").send({
      email: data.email,
      password: data.password,
    });

    cookie = loginResponse.headers["set-cookie"][0].split(";")[0].split("=")[1];
  });

  afterAll(async () => {
    await AppDataSource.dropDatabase();
    await AppDataSource.destroy();
  });

  it("Should be able to create a new todo", async () => {
    const todoResponse = await request(app)
      .post("/todos/")
      .set("Cookie", [`jwt-access-token=${cookie}`])
      .send({
        content: "Test todo",
        is_completed: false,
        due_to: "2022-07-10T14:27:12.859Z",
      });

    expect(todoResponse.body).toHaveProperty("id");
  });

  it("Should be able to create a todo only with content", async () => {
    const todoResponse = await request(app)
      .post("/todos/")
      .set("Cookie", [`jwt-access-token=${cookie}`])
      .send({
        content: "Test todo 2",
      });
    expect(todoResponse.body).toHaveProperty("id");
  });

  it("Should not be able to create a todo with wrong credentials", async () => {
    const todoResponse = await request(app)
      .post("/todos/")
      .set("Cookie", [`jwt-access-token=${cookie}1`])
      .send({
        content: "Test todo 3",
      });
    expect(todoResponse.body.message).toBe("Invalid token.");
  });
});
