const { Router } = require("express");
const {
  postPaymentHandler,
  deletePaymentHandler,
  updatePaymentHandler,
  getPaymentHandler,
  getAllPaymentsHandler,
} = require("../handlers/paymentHandler");

const paymentRouter = Router();

paymentRouter.post("/", postPaymentHandler);
paymentRouter.delete("/:paymentId", deletePaymentHandler);
paymentRouter.put("/:paymentId", updatePaymentHandler);
paymentRouter.get("/:paymentId", getPaymentHandler);
paymentRouter.get("/", getAllPaymentsHandler);

module.exports = paymentRouter;
