const { payment, user } = require("../db");
const excelJS = require("exceljs");
const fs = require("fs");

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

  const payments = await payment.findAll({ where: { userId: id } });
  console.log(payments);
  return payments;
};

//*************************** Excel Export ***************************/

const exportToExcelController = async (req, res) => {
  const { id } = req.user;
  if (!id) {
    throw new Error("Unauthorized");
  }
  console.log("hola", id);

  let workbook = new excelJS.Workbook();
  const sheet = workbook.addWorksheet("payments");
  sheet.columns = [
    { header: "amount", key: "amount", width: 35 },
    { header: "paymentType", key: "paymentType", width: 35 },
    { header: "addressee", key: "addressee", width: 35 },
    { header: "paymentDate", key: "paymentDate", width: 35 },
  ];

  const payments = await payment.findAll({ where: { userId: id } });

  payments.forEach((payment) => {
    sheet.addRow({
      amount: payment.amount,
      paymentType: payment.paymentType,
      addressee: payment.addressee,
      paymentDate: payment.paymentDate,
    });
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=payment_list.xlsx"
  );
  await workbook.xlsx.write(res);
  res.end();
};

module.exports = {
  postPaymentController,
  deletePaymentController,
  updatePaymentController,
  getPaymentController,
  getAllPaymentsController,
  exportToExcelController,
};
