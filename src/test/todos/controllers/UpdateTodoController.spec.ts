import { ICreateAccountDTO } from "@modules/accounts/dtos/ICreateAccountDTO";
import { app } from "@shared/infra/http/app";
import { AppDataSource } from "@shared/infra/typeorm";

import request from "supertest";

describe("Update todo controller", () => {
  let data1: ICreateAccountDTO, data2: ICreateAccountDTO;
  let loginResponse1, loginResponse2, todoCreationResponse;

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

    todoCreationResponse = await request(app)
      .post("/todos/")
      .set("Authorization", "Bearer " + loginResponse1.body.accessToken)
      .send({
        content: "Test todo 1",
        is_completed: true,
      });
  });

  afterAll(async () => {
    await AppDataSource.dropDatabase();
    await AppDataSource.destroy();
  });

  it("Should be able to change a todo content.", async () => {
    await request(app)
      .post("/todos/" + todoCreationResponse.body.id)
      .set("Authorization", "Bearer " + loginResponse1.body.accessToken)
      .send({
        content: "Updated todo 1",
      });

    const todoResponse = await request(app)
      .get("/todos/" + todoCreationResponse.body.id)
      .set("Authorization", "Bearer " + loginResponse1.body.accessToken);

    expect(todoResponse.body.content).toBe("Updated todo 1");
    expect(todoResponse.body.id).toBe(todoCreationResponse.body.id);
  });

  it("Should be able to change a todo completion.", async () => {
    await request(app)
      .post("/todos/" + todoCreationResponse.body.id)
      .set("Authorization", "Bearer " + loginResponse1.body.accessToken)
      .send({
        is_completed: false,
      });

    const todoResponse = await request(app)
      .get("/todos/" + todoCreationResponse.body.id)
      .set("Authorization", "Bearer " + loginResponse1.body.accessToken);

    expect(todoResponse.body.is_completed).toBe(false);
    expect(todoResponse.body.id).toBe(todoCreationResponse.body.id);
  });

  it("Should be able to change a todo due to.", async () => {
    await request(app)
      .post("/todos/" + todoCreationResponse.body.id)
      .set("Authorization", "Bearer " + loginResponse1.body.accessToken)
      .send({
        due_to: new Date("2022-07-06T12:48:47.567Z"),
      });

    const todoResponse = await request(app)
      .get("/todos/" + todoCreationResponse.body.id)
      .set("Authorization", "Bearer " + loginResponse1.body.accessToken);

    expect(todoResponse.body.due_to).toBe("2022-07-06T12:48:47.567Z");
    expect(todoResponse.body.id).toBe(todoCreationResponse.body.id);
  });

  it("Should not be able to update a todo if the user is not the owner.", async () => {
    const todoResponse = await request(app)
      .post("/todos/" + todoCreationResponse.body.id)
      .set("Authorization", "Bearer " + loginResponse2.body.accessToken)
      .send({
        content: "Wrong!",
      });

    expect(todoResponse.body.message).toEqual("Not allowed.");
  });
});
