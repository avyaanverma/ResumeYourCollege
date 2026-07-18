import request from "supertest";
import app from "../../src/app.js";

export async function createAuthenticatedUser() {
  const user = {
    firstName: "Avyaan",
    lastName: "Verma",
    email: `test${Date.now()}@mail.com`,
    password: "Password@123",
  };

  await request(app)
    .post("/api/v1/public/auth/register")
    .send(user);

  const loginResponse = await request(app)
    .post("/api/v1/public/auth/login")
    .send({
      email: user.email,
      password: user.password,
    });

  return {
    user,
    cookies: loginResponse.headers["set-cookie"],
    accessToken: loginResponse.body.data.accessToken,
  };
}