import { ICreateAccountDTO } from "@modules/accounts/dtos/ICreateAccountDTO";
import { app } from "@shared/infra/http/app";
import { AppDataSource } from "@shared/infra/typeorm";
import request from "supertest";

describe("Refresh token controller", () => {
  let data: ICreateAccountDTO;
  let data2: ICreateAccountDTO;
  beforeAll(async () => {
    await AppDataSource.initialize();
    await AppDataSource.runMigrations();

    data = {
      email: "test@test.com",
      name: "Tester",
      password: "testpassword",
    };
    await request(app).post("/account/").send(data);

    await request(app).post("/account/login").send({
      email: data.email,
      password: data.password,
    });

    data2 = {
      email: "test2@test.com",
      name: "Tester",
      password: "testpassword",
    };
    await request(app).post("/account/").send(data2);

    await request(app).post("/account/login").send({
      email: data2.email,
      password: data2.password,
    });

    await AppDataSource.query(
      `UPDATE tokens SET id='f19e889c-2702-40d5-b4f5-4f58697cc7f3' WHERE account_id=(SELECT id FROM accounts WHERE email='${data.email}')`
    );

    await AppDataSource.query(
      `UPDATE tokens SET id='abbcb2e6-5e36-45a7-b001-22346719fe2a' WHERE account_id=(SELECT id FROM accounts WHERE email='${data2.email}')`
    );

    await AppDataSource.query(
      `UPDATE tokens SET expires_at='2000-07-26 13:31:29.968' WHERE account_id=(SELECT id FROM accounts WHERE email='${data2.email}')`
    );
  });

  afterAll(async () => {
    await AppDataSource.dropDatabase();
    await AppDataSource.destroy();
  });

  it("Should be able to refresh token with a valid id.", async () => {
    const newRefreshToken = await request(app)
      .post("/account/refresh")
      .set("Cookie", [
        `jwt-refresh-token=f19e889c-2702-40d5-b4f5-4f58697cc7f3`,
      ]);

    expect(newRefreshToken.body.message).toBe("Tokens were refreshed");
  });

  it("Should not be able to refresh token without a valid token", async () => {
    const newRefreshToken = await request(app)
      .post("/account/refresh")
      .set("Cookie", [
        `jwt-refresh-token=g20e889c-2702-40d5-b4f5-4f58697cc7f3`,
      ]);
    expect(newRefreshToken.body.message).toBe(
      "Refresh token not found, please authenticate again."
    );
  });

  it("Should not be able to refresh token without a token", async () => {
    const newRefreshToken = await request(app).post("/account/refresh");

    expect(newRefreshToken.body.message).toBe(
      "Refresh token not found, please authenticate again."
    );
  });
  it("Should not be able to refresh token with an expired token", async () => {
    const response = await request(app)
      .post("/account/refresh")
      .set("Cookie", [
        `jwt-refresh-token=abbcb2e6-5e36-45a7-b001-22346719fe2a`,
      ]);
    expect(response.body.message).toBe(
      "Refresh token expired, please authenticate again."
    );
  });
});
