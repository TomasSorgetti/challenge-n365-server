const supertest = require("supertest");
const app = require("../app.js");
const { user } = require("../db.js");

const request = supertest(app);

describe("Create User Controller", () => {
  beforeAll(async () => {
    await user.destroy({ where: { email: "test@example.com" } });
  });

  test("should create a user", async () => {
    const response = await request
      .post("/user")
      .send({ email: "test@example.com", password: "password" });
    expect(response.status).toBe(200);
  });

  test("return error in case email is already taken", async () => {
    const response = await request
      .post("/user")
      .send({ email: "test@example.com", password: "password" });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("That mail is already taken");
  });

  test("return error in case email or password empty", async () => {
    const response = await request
      .post("/user")
      .send({ email: "", password: "" });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Fields are empty");
  });
});

describe("Login User Controller", () => {
  beforeEach(async () => {
    await user.destroy({ where: { email: "test@example.com" } });
  });

  test("should login if user exist and password match", async () => {
    await request
      .post("/user")
      .send({ email: "test@example.com", password: "password" });

    const response = await request
      .post("/user/login")
      .send({ email: "test@example.com", password: "password" });
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  test("return error if user doesn't exist", async () => {
    const response = await request
      .post("/user/login")
      .send({ email: "test@example.com", password: "password" });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("user does not exist");
  });

  test("return error if password doesn't match", async () => {
    await request
      .post("/user")
      .send({ email: "test@example.com", password: "password" });

    const response = await request
      .post("/user/login")
      .send({ email: "test@example.com", password: "wrong-password" });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("wrong password");
  });
});
