const { Router } = require("express");
const { verifyAccessToken } = require("../middlewares/auth");
const {
  postPaymentHandler,
  deletePaymentHandler,
  updatePaymentHandler,
  getPaymentHandler,
  getAllPaymentsHandler,
} = require("../handlers/paymentHandler");

const paymentRouter = Router();


paymentRouter.post("/", verifyAccessToken, postPaymentHandler);
paymentRouter.delete("/:paymentId", verifyAccessToken, deletePaymentHandler);
paymentRouter.put("/:paymentId", verifyAccessToken, updatePaymentHandler);
paymentRouter.get("/:paymentId", verifyAccessToken, getPaymentHandler);
paymentRouter.get("/", verifyAccessToken, getAllPaymentsHandler);

module.exports = paymentRouter;