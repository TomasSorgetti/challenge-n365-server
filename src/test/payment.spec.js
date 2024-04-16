const supertest = require("supertest");
const app = require("../app.js");
const { payment, user } = require("../db.js");

const request = supertest(app);

describe("Post Payment", () => {
  let token;

  beforeAll(async () => {
    const userexample = { email: "test@example.com", password: "password" };
    const findUser = await user.findOne({
      where: { email: userexample.email },
    });
    if (!findUser) {
      const response = await request.post("/user").send(userexample);
      token = response.body.token;
    } else {
      const response = await request.post("/user/login").send(userexample);
      token = response.body.token;
    }
  });
  afterAll(async () => {
    await user.destroy({ where: { email: "test@example.com" } });
    await payment.destroy({ where: { addressee: "Testing" } });
  });

  test("Should Create a Payment", async () => {
    const response = await request
      .post("/payments")
      .set("authorization", token)
      .send({
        amount: 300,
        paymentType: "credit",
        addressee: "Testing",
        paymentDate: "2024-01-01",
      });
    expect(response.status).toBe(200);
  });
  test("Should return error if empty fields", async () => {
    const response = await request
      .post("/payments")
      .set("authorization", token)
      .send({
        amount: null,
        paymentType: "",
        addressee: "",
        paymentDate: "",
      });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("fields empty");
  });
  test("Should return error if invalid token", async () => {
    const response = await request
      .post("/payments")
      .set("authorization", "something wrong")
      .send({
        amount: 300,
        paymentType: "credit",
        addressee: "Testing",
        paymentDate: "2024-01-01",
      });
    expect(response.status).toBe(403);
  });
});
