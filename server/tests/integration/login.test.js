import crypto from "crypto";
import { describe, expect, test } from "vitest";

describe("Login API", () => {
  test("should login successfully", async () => {
    const email = `${crypto.randomUUID()}@gmail.com`;

    // Register user first
    const registerRes = await request(app)
      .post("/api/v1/public/auth/register")
      .send({
        firstName: "Avyaan",
        lastName: "Verma",
        email,
        password: "Password@123",
      });

    expect(registerRes.statusCode).toBe(201);

    // Login
    const loginRes = await request(app)
      .post("/api/v1/public/auth/login")
      .send({
        email,
        password: "Password@123",
      });

    console.log("Login:", loginRes.statusCode);
    console.log(loginRes.body);

    expect(loginRes.statusCode).toBe(200);

    expect(loginRes.body).toHaveProperty("success", true);
    expect(loginRes.body).toHaveProperty(
      "message",
      "Login successful"
    );

    expect(loginRes.body.data).toHaveProperty("user");
    expect(loginRes.body.data).toHaveProperty("accessToken");

    expect(loginRes.body.data.user.email).toBe(email);
    expect(typeof loginRes.body.data.accessToken).toBe("string");
  });
});