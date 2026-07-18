import request from "supertest";
import app from "../../../src/app.js";

import { createAuthenticatedUser } from "../../helpers/auth.helper.js";

describe("Get All Resumes", () => {

  test("should return all resumes", async () => {

    const auth = await createAuthenticatedUser();

    await request(app)
      .post("/api/v1/private/resumes")
      .set("Cookie", auth.cookies)
      .send({
        title: "Resume One"
      });

    const response = await request(app)
      .get("/api/v1/private/resumes")
      .set("Cookie", auth.cookies);

    expect(response.statusCode).toBe(200);

    expect(response.body.data.length)
      .toBeGreaterThan(0);

  });
  
  test("should not access another user's resume", async () => {

  const userA = await createAuthenticatedUser();
  const userB = await createAuthenticatedUser();

  const created = await request(app)
    .post("/api/v1/private/resumes")
    .set("Cookie", userA.cookies)
    .send({
      title: "Secret Resume"
    });

  const response = await request(app)
    .get(`/api/v1/private/resumes/${created.body.data._id}`)
    .set("Cookie", userB.cookies);

  expect(response.statusCode).toBe(404);

});

test("should update personal section", async () => {

  const auth = await createAuthenticatedUser();

  const created = await request(app)
    .post("/api/v1/private/resumes")
    .set("Cookie", auth.cookies)
    .send({});

  const response = await request(app)
    .patch(`/api/v1/private/resumes/${created.body.data._id}`)
    .set("Cookie", auth.cookies)
    .send({
      section: "personal",
      data: {
        fullName: "Avyaan Verma",
        email: "avyaan@mail.com"
      }
    });

  expect(response.statusCode).toBe(200);

  expect(response.body.data.personal.fullName)
    .toBe("Avyaan Verma");

});

test("should delete resume", async () => {

  const auth = await createAuthenticatedUser();

  const created = await request(app)
    .post("/api/v1/private/resumes")
    .set("Cookie", auth.cookies)
    .send({});

  const response = await request(app)
    .delete(`/api/v1/private/resumes/${created.body.data._id}`)
    .set("Cookie", auth.cookies);

  expect(response.statusCode).toBe(200);

});

});