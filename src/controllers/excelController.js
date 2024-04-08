const { payment } = require("../db");
const excelJS = require("exceljs");

const exportToExcelController = async (req, res) => {
  const { id } = req.user;
  if (!id) {
    throw new Error("Unauthorized");
  }
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
    "attachment; filename=payment_list_blaze.xlsx"
  );
  await workbook.xlsx.write(res);
  res.end();
};

module.exports = { exportToExcelController };
