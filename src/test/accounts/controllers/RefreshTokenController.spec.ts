import { ICreateAccountDTO } from "@modules/accounts/dtos/ICreateAccountDTO";
import { app } from "@shared/infra/http/app";
import { AppDataSource } from "@shared/infra/typeorm";
import request from "supertest";

describe("Refresh token controller", () => {
  let data: ICreateAccountDTO;
  let data2: ICreateAccountDTO;
  let loginResponse, loginResponse2;
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

    data2 = {
      email: "test2@test.com",
      name: "Tester",
      password: "testpassword",
    };
    await request(app).post("/account/").send(data2);

    loginResponse2 = await request(app).post("/account/login").send({
      email: data2.email,
      password: data2.password,
    });

    await AppDataSource.query(
      `UPDATE tokens SET expires_at='2000-07-26 13:31:29.968' WHERE id='${loginResponse2.body.refreshToken}'`
    );
  });

  afterAll(async () => {
    await AppDataSource.dropDatabase();
    await AppDataSource.destroy();
  });

  it("Should be able to refresh token with a valid id.", async () => {
    const newRefreshToken = await request(app).post("/account/refresh").send({
      refreshToken: loginResponse.body.refreshToken,
    });
    expect(newRefreshToken.body).toHaveProperty("accessToken");
    expect(newRefreshToken.body).toHaveProperty("refreshToken");
  });

  it("Should not be able to refresh token without a valid token", async () => {
    const newRefreshToken = await request(app)
      .post("/account/refresh")
      .send({
        refreshToken: loginResponse.body.refreshToken + "wrong",
      });
    expect(newRefreshToken.body.message).toBe(
      "Refresh token not found, please authenticate again."
    );
  });

  it("Should not be able to refresh token without a token", async () => {
    const newRefreshToken = await request(app)
      .post("/account/refresh")
      .send({});
    expect(newRefreshToken.body.message).toBe(
      "Refresh token not found, please authenticate again."
    );
  });
  it("Should not be able to refresh token with an expired token", async () => {
    const response = await request(app).post("/account/refresh").send({
      refreshToken: loginResponse2.body.refreshToken,
    });
    expect(response.body.message).toBe(
      "Refresh token expired, please authenticate again."
    );
  });
});
