import { app } from "@shared/infra/http/app";
import { AppDataSource } from "@shared/infra/typeorm";
import request from "supertest";

describe("Create account controller", () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    await AppDataSource.runMigrations();
  });

  afterAll(async () => {
    await AppDataSource.dropDatabase();
    await AppDataSource.destroy();
  });

  it("Should be able to create a new account", async () => {
    const createAccountResponse = await request(app).post("/account/").send({
      email: "test@test.com",
      name: "Tester",
      password: "testpassword",
    });
    console.log(createAccountResponse.body);
    expect(createAccountResponse.status).toBe(201);
    expect(createAccountResponse.body).toHaveProperty("email");
    expect(createAccountResponse.body).toHaveProperty("name");
  });
});
