const { payment } = require("../db");

const { Op } = require("sequelize");

const getExcelList = async (
  id,
  name,
  order,
  orderBy,
  filter,
  minAmount,
  maxAmount,
  minDate,
  maxDate
) => {
  if (!orderBy) orderBy = "paymentDate";
  if (!order) order = "asc";

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
  return await payment.findAll({
    where: whereClause,
    order: [[orderBy, order]],
  });
};

module.exports = { getExcelList };
