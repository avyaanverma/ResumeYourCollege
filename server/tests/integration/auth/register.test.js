import crypto from "crypto";
import { describe, expect, test } from "vitest";

describe("Register API", () => {
  test("should register a new user", async () => {
    const email = `${crypto.randomUUID()}@gmail.com`;

    const res = await request(app)
      .post("/api/v1/public/auth/register")
      .send({
        firstName: "Avyaan",
        lastName: "Verma",
        email,
        password: "Password@123",
      });

    console.log(res.statusCode);
    console.log(res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty(
      "message",
      "User registered successfully"
    );

    expect(res.body.data).toHaveProperty("user");
    expect(res.body.data).toHaveProperty("accessToken");

    expect(res.body.data.user.email).toBe(email);
    expect(typeof res.body.data.accessToken).toBe("string");
  });
});