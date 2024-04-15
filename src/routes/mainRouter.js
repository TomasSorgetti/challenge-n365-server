const { Router } = require("express");
const userRouter = require("./userRouter");
const paymentRouter = require("./paymentRouter");
const excelRouter = require("./excelRouter");
const { verifyAccessToken } = require("../middlewares/auth");

const routes = Router();

routes.use("/user", userRouter);
routes.use("/payments", verifyAccessToken, paymentRouter);
routes.use("/excel", verifyAccessToken, excelRouter);

module.exports = routes;
