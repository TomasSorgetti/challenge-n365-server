const { Router } = require("express");
const userRouter = require("./userRouter");
const paymentRouter = require("./paymentRouter");
const excelRouter = require("./excelRouter");

const routes = Router();

routes.use("/user", userRouter);
routes.use("/payments", paymentRouter);
routes.use("/excel", excelRouter);

module.exports = routes;
