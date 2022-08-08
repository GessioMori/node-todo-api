import { ICreateAccountDTO } from "@modules/accounts/dtos/ICreateAccountDTO";
import { app } from "@shared/infra/http/app";
import { AppDataSource } from "@shared/infra/typeorm";

import request from "supertest";

describe("Get todos by date controller", () => {
  let data1: ICreateAccountDTO, data2: ICreateAccountDTO;
  let loginResponse1, loginResponse2;

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

    const todo1CreationResponse = await request(app)
      .post("/todos/")
      .set("Authorization", "Bearer " + loginResponse1.body.accessToken)
      .send({
        content: "Test todo 1",
      });

    await request(app)
      .post("/todos/")
      .set("Authorization", "Bearer " + loginResponse2.body.accessToken)
      .send({
        content: "Test todo 2",
      });

    await request(app)
      .post("/todos/")
      .set("Authorization", "Bearer " + loginResponse1.body.accessToken)
      .send({
        content: "Test todo 3",
      });

    await AppDataSource.query(
      `UPDATE todos SET created_at='2022-07-26 13:31:29.968' WHERE id='${todo1CreationResponse.body.id}'`
    );
  });

  afterAll(async () => {
    await AppDataSource.dropDatabase();
    await AppDataSource.destroy();
  });

  it("Should be able to retrieve only the todos the user is the owner.", async () => {
    const todosResponse = await request(app)
      .get("/todos/interval/")
      .set("Authorization", "Bearer " + loginResponse1.body.accessToken)
      .send({
        begin: "2020-01-08T18:35:11.253Z",
        end: "2022-12-08T18:35:11.253Z",
      });

    expect(todosResponse.body).toHaveLength(2);
  });

  it("Should receive todos without sending a begin date", async () => {
    const todosResponse = await request(app)
      .get("/todos/interval/")
      .set("Authorization", "Bearer " + loginResponse1.body.accessToken)
      .send({
        end: "2022-12-08T18:35:11.253Z",
      });

    expect(todosResponse.body).toHaveLength(2);
  });

  it("Should receive todos without sending an end date", async () => {
    const todosResponse = await request(app)
      .get("/todos/interval/")
      .set("Authorization", "Bearer " + loginResponse1.body.accessToken)
      .send({
        begin: "2020-01-08T18:35:11.253Z",
      });

    expect(todosResponse.body).toHaveLength(2);
  });

  it("Should receive todos between a proper interval", async () => {
    const todosResponse = await request(app)
      .get("/todos/interval/")
      .set("Authorization", "Bearer " + loginResponse1.body.accessToken)
      .send({
        begin: "2022-08-01T18:35:11.253Z",
        end: "2022-12-08T18:35:11.253Z",
      });

    expect(todosResponse.body).toHaveLength(1);
  });
});
