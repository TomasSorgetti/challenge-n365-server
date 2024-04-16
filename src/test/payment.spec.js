const supertest = require("supertest");
const app = require("../app.js");
const { payment, user } = require("../db.js");

const request = supertest(app);

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
});

//*************  POST Payment  **************/
describe("Post Payment", () => {
  afterAll(async () => {
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

//*************  PUT Payment  **************/
describe("Update Payment", () => {
  let paymentId;

  beforeAll(async () => {
    const response = await request
      .post("/payments")
      .set("authorization", token)
      .send({
        amount: 300,
        paymentType: "credit",
        addressee: "Testing",
        paymentDate: "2024-01-01",
      });
    paymentId = response.body.id;
  });

  afterAll(async () => {
    await payment.destroy({ where: { addressee: "Testing" } });
  });

  test("Should Update a Payment", async () => {
    const response = await request
      .put(`/payments/${paymentId}`)
      .set("authorization", token)
      .send({
        amount: 800,
        paymentType: "credit",
        addressee: "Testing",
        paymentDate: "2024-01-01",
      });
    expect(response.status).toBe(204);
  });

  test("Should return error if empty fields", async () => {
    const response = await request
      .put(`/payments/${paymentId}`)
      .set("authorization", token)
      .send({
        amount: null,
        paymentType: "",
        addressee: "",
        paymentDate: "",
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("fields missing");
  });

  test("Should return error if no payment id", async () => {
    const response = await request
      .put(`/payments`)
      .set("authorization", token)
      .send({
        amount: 800,
        paymentType: "credit",
        addressee: "Testing",
        paymentDate: "2024-01-01",
      });
    expect(response.status).toBe(404);
  });
  test("Should return error if invalid payment id", async () => {
    const response = await request
      .put(`/payments/9999999`)
      .set("authorization", token)
      .send({
        amount: 800,
        paymentType: "credit",
        addressee: "Testing",
        paymentDate: "2024-01-01",
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("do not find a payment with that id");
  });

  test("Should return error if invalid token", async () => {
    const response = await request
      .post("/payments")
      .set("authorization", "something wrong")
      .send({
        amount: 800,
        paymentType: "credit",
        addressee: "Testing",
        paymentDate: "2024-01-01",
      });
    expect(response.status).toBe(403);
  });
});

//*************  DELETE Payment  **************/
describe("Delete Payment", () => {
  let paymentId;

  beforeAll(async () => {
    const response = await request
      .post("/payments")
      .set("authorization", token)
      .send({
        amount: 300,
        paymentType: "credit",
        addressee: "Testing",
        paymentDate: "2024-01-01",
      });
    paymentId = response.body.id;
  });

  test("Should return error if no payment id", async () => {
    const response = await request
      .delete(`/payments/`)
      .set("authorization", token);

    expect(response.status).toBe(404);
  });

  test("Should return error if invalid token", async () => {
    const response = await request
      .delete(`/payments/${paymentId}`)
      .set("authorization", "something wrong");
    expect(response.status).toBe(403);
  });

  test("Should Delete a Payment", async () => {
    const response = await request
      .delete(`/payments/${paymentId}`)
      .set("authorization", token);
    expect(response.status).toBe(204);
  });
});

//*************  GET Payment By Id  **************/
describe("Get Payment By Id", () => {
  let paymentId;

  beforeAll(async () => {
    const response = await request
      .post("/payments")
      .set("authorization", token)
      .send({
        amount: 300,
        paymentType: "credit",
        addressee: "Testing",
        paymentDate: "2024-01-01",
      });
    paymentId = response.body.id;
  });

  afterAll(async () => {
    await payment.destroy({ where: { addressee: "Testing" } });
  });

  test("Should return error if no payment id", async () => {
    const wrongId = "";
    const response = await request
      .get(`/payments/${wrongId}`)
      .set("authorization", token);
    expect(response.status).toBe(400);
  });

  test("Should return error if invalid token", async () => {
    const response = await request
      .get(`/payments/${paymentId}`)
      .set("authorization", "something wrong");
    expect(response.status).toBe(403);
  });

  test("Should Get the Payment", async () => {
    const response = await request
      .get(`/payments/${paymentId}`)
      .set("authorization", token);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });
});

//*************  GET All Payments  **************/
describe("Get All Payments", () => {
  beforeAll(async () => {
    await request.post("/payments").set("authorization", token).send({
      amount: 300,
      paymentType: "credit",
      addressee: "Testing",
      paymentDate: "2024-01-01",
    });
  });

  afterAll(async () => {
    await payment.destroy({ where: { addressee: "Testing" } });
  });

  test("Should return error if no payment id", async () => {
    const response = await request.get(`/payments`).set("authorization", token);
    expect(response.status).toBe(400);
  });

  test("Should return error if invalid token", async () => {
    const response = await request
      .get(`/payments/`)
      .set("authorization", "something wrong");
    expect(response.status).toBe(403);
  });

  test("Should Get all the Payments", async () => {
    const response = await request
      .get(`/payments`)
      .set("authorization", token)
      .query({
        name: "",
        order: "asc",
        orderBy: "paymentDate",
        filter: "",
        page: 1,
        minAmount: 0,
        maxAmount: null,
        minDate: "",
        maxDate: "",
      });
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });
});
