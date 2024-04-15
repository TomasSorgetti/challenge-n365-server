const { payment, user } = require("../db");
const { Op } = require("sequelize");

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
const getAllPaymentsController = async (
  id,
  name,
  order,
  orderBy,
  filter,
  minAmount,
  maxAmount,
  minDate,
  maxDate,
  page,
  limit
) => {
  if (!id) throw new Error("unauthorized");
  const size = limit || 7;
  const offset = (page - 1) * size;

  let whereClause = {
    userId: id,
    addressee: {
      [Op.like]: name + "%",
    },
  };
  if (!minAmount) minAmount = 0;
  if (maxAmount) whereClause.amount = { [Op.between]: [minAmount, maxAmount] };

  whereClause.paymentDate =
    minDate && maxDate
      ? { [Op.between]: [minDate, maxDate] }
      : minDate
      ? { [Op.gte]: minDate }
      : maxDate
      ? { [Op.lte]: maxDate }
      : undefined;

  if (filter && ["check", "debit", "transfer", "credit"].includes(filter)) {
    whereClause.paymentType = filter;
  }

  const payments = await payment.findAll({
    where: whereClause,
    limit: size,
    offset: offset,
    order: [[orderBy, order]],
  });
  const totalCount = await payment.count({
    where: whereClause,
  });

  const totalPages = Math.ceil(totalCount / size);

  return { pages: totalPages, payments: payments };
};

module.exports = {
  postPaymentController,
  deletePaymentController,
  updatePaymentController,
  getPaymentController,
  getAllPaymentsController,
};
