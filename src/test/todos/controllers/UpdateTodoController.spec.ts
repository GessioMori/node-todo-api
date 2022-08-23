import { ICreateAccountDTO } from "@modules/accounts/dtos/ICreateAccountDTO";
import { app } from "@shared/infra/http/app";
import { AppDataSource } from "@shared/infra/typeorm";

import request from "supertest";

describe("Update todo controller", () => {
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
        is_completed: true,
      });
  });

  afterAll(async () => {
    await AppDataSource.dropDatabase();
    await AppDataSource.destroy();
  });

  it("Should be able to change a todo content.", async () => {
    await request(app)
      .patch("/todos/" + todoCreationResponse.body.id)
      .set("Cookie", [`jwt-access-token=${cookie1}`])
      .send({
        content: "Updated todo 1",
      });

    const todoResponse = await request(app)
      .get("/todos/" + todoCreationResponse.body.id)
      .set("Cookie", [`jwt-access-token=${cookie1}`]);

    expect(todoResponse.body.content).toBe("Updated todo 1");
    expect(todoResponse.body.id).toBe(todoCreationResponse.body.id);
  });

  it("Should be able to change a todo completion.", async () => {
    await request(app)
      .patch("/todos/" + todoCreationResponse.body.id)
      .set("Cookie", [`jwt-access-token=${cookie1}`])
      .send({
        is_completed: false,
      });

    const todoResponse = await request(app)
      .get("/todos/" + todoCreationResponse.body.id)
      .set("Cookie", [`jwt-access-token=${cookie1}`]);

    expect(todoResponse.body.is_completed).toBe(false);
    expect(todoResponse.body.id).toBe(todoCreationResponse.body.id);
  });

  it("Should be able to change a todo due to.", async () => {
    await request(app)
      .patch("/todos/" + todoCreationResponse.body.id)
      .set("Cookie", [`jwt-access-token=${cookie1}`])
      .send({
        due_to: new Date("2022-07-06T12:48:47.567Z"),
      });

    const todoResponse = await request(app)
      .get("/todos/" + todoCreationResponse.body.id)
      .set("Cookie", [`jwt-access-token=${cookie1}`]);

    expect(todoResponse.body.due_to).toBe("2022-07-06T12:48:47.567Z");
    expect(todoResponse.body.id).toBe(todoCreationResponse.body.id);
  });

  it("Should not be able to update a todo if the user is not the owner.", async () => {
    const todoResponse = await request(app)
      .patch("/todos/" + todoCreationResponse.body.id)
      .set("Cookie", [`jwt-access-token=${cookie2}`])
      .send({
        content: "Wrong!",
      });

    expect(todoResponse.body.message).toEqual("Not allowed.");
  });
});
