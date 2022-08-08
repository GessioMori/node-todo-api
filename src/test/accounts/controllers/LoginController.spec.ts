import { ICreateAccountDTO } from "@modules/accounts/dtos/ICreateAccountDTO";
import { app } from "@shared/infra/http/app";
import { AppDataSource } from "@shared/infra/typeorm";
import request from "supertest";

describe("Login controller", () => {
  let data: ICreateAccountDTO;
  beforeAll(async () => {
    await AppDataSource.initialize();
    await AppDataSource.runMigrations();

    data = {
      email: "test@test.com",
      name: "Tester",
      password: "testpassword",
    };
    await request(app).post("/account/").send(data);
  });

  afterAll(async () => {
    await AppDataSource.dropDatabase();
    await AppDataSource.destroy();
  });

  it("Should be able to login with right credentials.", async () => {
    const loginResponse = await request(app).post("/account/login").send({
      email: data.email,
      password: data.password,
    });
    expect(loginResponse.body).toHaveProperty("accessToken");
    expect(loginResponse.body).toHaveProperty("refreshToken");
  });
  it("Should not be able to login with wrong password.", async () => {
    const loginResponse = await request(app)
      .post("/account/login")
      .send({
        email: data.email,
        password: data.password + "wrong",
      });
    expect(loginResponse.body.message).toBe("Invalid email or password.");
  });

  it("Should not be able to login with wrong email.", async () => {
    const loginResponse = await request(app)
      .post("/account/login")
      .send({
        email: data.email + "wrong",
        password: data.password,
      });
    expect(loginResponse.body.message).toBe("Invalid email or password.");
  });
});
