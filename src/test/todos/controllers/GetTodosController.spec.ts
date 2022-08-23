import { ICreateAccountDTO } from "@modules/accounts/dtos/ICreateAccountDTO";
import { ITodo } from "@modules/todos/entities/ITodo";
import { app } from "@shared/infra/http/app";
import { AppDataSource } from "@shared/infra/typeorm";

import request from "supertest";

describe("Get todos controller", () => {
  let data1: ICreateAccountDTO, data2: ICreateAccountDTO;
  let loginResponse1, loginResponse2, todoCreationResponse;
  let cookie1: string, cookie2: string;

  beforeAll(async () => {
    await AppDataSource.initialize();
    await AppDataSource.runMigrations();

    data1 = {
      email: "test1@test.com",
      name: "Tester1",
      password: "testpassword",
    };

    data2 = {
      email: "test2@test.com",
      name: "Tester2",
      password: "testpassword",
    };

    await request(app).post("/account/").send(data1);
    await request(app).post("/account/").send(data2);

    loginResponse1 = await request(app).post("/account/login").send({
      email: data1.email,
      password: data1.password,
    });

    loginResponse2 = await request(app).post("/account/login").send({
      email: data2.email,
      password: data2.password,
    });

    cookie1 = loginResponse1.headers["set-cookie"][0]
      .split(";")[0]
      .split("=")[1];
    cookie2 = loginResponse2.headers["set-cookie"][0]
      .split(";")[0]
      .split("=")[1];

    todoCreationResponse = await request(app)
      .post("/todos/")
      .set("Cookie", [`jwt-access-token=${cookie1}`])
      .send({
        content: "Test todo 1",
      });

    await request(app)
      .post("/todos/")
      .set("Cookie", [`jwt-access-token=${cookie2}`])
      .send({
        content: "Test todo 2",
      });
  });

  afterAll(async () => {
    await AppDataSource.dropDatabase();
    await AppDataSource.destroy();
  });

  it("Should be able to retrieve the todos the user is the owner.", async () => {
    const todosResponse = await request(app)
      .get("/todos/")
      .set("Cookie", [`jwt-access-token=${cookie1}`]);

    expect(todosResponse.body).toHaveLength(1);
    expect(todosResponse.body[0]).toEqual<ITodo>(todoCreationResponse.body);
  });
});
