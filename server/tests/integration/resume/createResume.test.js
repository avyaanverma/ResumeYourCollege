import request from "supertest";
import app from "../../../src/app.js";

import { createAuthenticatedUser } from "../../helpers/auth.helper.js";

describe("Create Resume API", () => {

  test("should create a resume", async () => {

    const auth = await createAuthenticatedUser();

    const response = await request(app)
      .post("/api/v1/private/resumes")
      .set("Cookie", auth.cookies)
      .send({
        title: "Backend Resume"
      });

    expect(response.statusCode).toBe(201);

    expect(response.body.success).toBe(true);

    expect(response.body.data.title)
      .toBe("Backend Resume");

  });
  
  test("should reject unauthenticated request", async () => {

  const response = await request(app)
    .post("/api/v1/private/resumes")
    .send({
      title: "Resume"
    });

  expect(response.statusCode).toBe(401);

});

test("should create untitled resume", async () => {

  const auth = await createAuthenticatedUser();

  const response = await request(app)
    .post("/api/v1/private/resumes")
    .set("Cookie", auth.cookies)
    .send({});

  expect(response.body.data.title)
    .toBe("Untitled Resume");

});



});