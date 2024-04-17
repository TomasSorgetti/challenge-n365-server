const { payment, user } = require("../db");
const { Op } = require("sequelize");

const { ClientErrors } = require("../utils/errors");

//*********************** Post Payment ************************/
const postPaymentController = async (
  id,
  amount,
  paymentType,
  addressee,
  paymentDate
) => {
  if (!id) throw new ClientErrors("unauthorized", 403);
  if (!amount || !paymentType || !addressee || !paymentDate)
    throw new ClientErrors("fields empty", 400);

  const searchUser = await user.findOne({ where: { id } });
  if (!searchUser)
    throw new ClientErrors("A user with that id doesn't exist", 403);
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
  if (!id) throw new ClientErrors("unauthorized", 403);

  const searchPayment = await payment.findOne({
    where: { id: paymentId, userId: id },
  });
  if (!searchPayment)
    throw new ClientErrors("do not find a payment with that id", 404);
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
  if (!id) throw new ClientErrors("unauthorized", 403);
  if (!paymentId || !amount || !paymentType || !addressee || !paymentDate)
    throw new ClientErrors("fields missing", 400);

  const searchPayment = await payment.findOne({
    where: { id: paymentId, userId: id },
  });
  if (!searchPayment)
    throw new ClientErrors("do not find a payment with that id", 404);

  searchPayment.amount = amount || searchPayment.amount;
  searchPayment.paymentType = paymentType || searchPayment.paymentType;
  searchPayment.addressee = addressee || searchPayment.addressee;
  searchPayment.paymentDate = paymentDate || searchPayment.paymentDate;

  await searchPayment.save();
  return searchPayment;
};

//*********************** Get Payment ************************/
const getPaymentController = async (id, paymentId) => {
  if (!id) throw new ClientErrors("unauthorized", 403);
  if (!paymentId) throw new ClientErrors("payment id missing", 400);

  const searchPayment = await payment.findOne({
    where: { id: paymentId, userId: id },
  });
  if (!searchPayment)
    throw new ClientErrors("did not find a payment with that id", 404);
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
  if (!id) throw new ClientErrors("unauthorized", 403);
  if (!orderBy) orderBy = "paymentDate";
  if (!order) order = "asc";

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

  if (minDate && maxDate) {
    whereClause.paymentDate = { [Op.between]: [minDate, maxDate] };
  } else if (minDate && !maxDate) {
    whereClause.paymentDate = { [Op.gte]: minDate };
  } else if (maxDate && !minDate) {
    whereClause.paymentDate = { [Op.lte]: maxDate };
  }
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
