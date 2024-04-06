const { Router } = require("express");
const userRouter = require("./userRouter");
const paymentRouter = require("./paymentRouter");

const routes = Router();

routes.use("/user", userRouter);
routes.use("/payments", paymentRouter);

module.exports = routes;
