const { payment, user } = require("../db");

//*********************** Post Payment ************************/
const postPaymentController = async (
  id,
  amount,
  paymentType,
  addressee,
  paymentDate
) => {
  if (!id) throw new Error("unauthorized");
  if (!amount || !paymentType || !addressee || !paymentDate)
    throw new Error("fields empty");

  const searchUser = await user.findOne({ where: { id } });
  if (!searchUser) throw new Error("A user with that id do not exist");
  else {
    return await payment.create({
      amount,
      paymentType,
      addressee,
      paymentDate,
      userId: searchUser.dataValues.id,
    });
  }
};

//*********************** Delete Payment ************************/
const deletePaymentController = async (id, paymentId) => {
  if (!id) throw new Error("unauthorized");
  if (!paymentId) throw new Error("payment id missing");

  const searchPayment = await payment.findOne({
    where: { id: paymentId, userId: id },
  });
  if (!searchPayment) throw new Error("do not find a payment with that id");
  return await searchPayment.destroy();
};

//*********************** Update Payment ************************/
const updatePaymentController = async (
  id,
  paymentId,
  amount,
  paymentType,
  addressee,
  paymentDate
) => {
  if (!id) throw new Error("unauthorized");
  if (!paymentId || !amount || !paymentType || !addressee || !paymentDate)
    throw new Error("fields missing");

  const searchPayment = await payment.findOne({
    where: { id: paymentId, userId: id },
  });
  if (!searchPayment) throw new Error("do not find a payment with that id");

  searchPayment.amount = amount || searchPayment.amount;
  searchPayment.paymentType = paymentType || searchPayment.paymentType;
  searchPayment.addressee = addressee || searchPayment.addressee;
  searchPayment.paymentDate = paymentDate || searchPayment.paymentDate;

  await searchPayment.save();
  return searchPayment;
};

//*********************** Get Payment ************************/
const getPaymentController = async (id, paymentId) => {
  if (!id) throw new Error("unauthorized");
  if (!paymentId) throw new Error("payment id missing");

  const searchPayment = await payment.findOne({
    where: { id: paymentId, userId: id },
  });
  if (!searchPayment) throw new Error("did not find a payment with that id");
  return searchPayment;
};

//*********************** Get All Payments ************************/
const getAllPaymentsController = async (id, name, order, filter, page) => {
  if (!id) throw new Error("unauthorized");
  if (!name || !order || !filter || !page) throw new Error("fields missing");

  console.log("complete this route, dont be lazzy");
};

module.exports = {
  postPaymentController,
  deletePaymentController,
  updatePaymentController,
  getPaymentController,
  getAllPaymentsController,
};
