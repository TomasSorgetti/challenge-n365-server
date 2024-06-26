const { getExcelList } = require("../controllers/excelController");
const excelJS = require("exceljs");

const getExcelHandler = async (req, res) => {
  const { id } = req.user;
  if (!id) {
    res.status(403).json({ msg: "Unauthorized" });
  }
  const {
    name,
    order,
    orderBy,
    filter,
    minAmount,
    maxAmount,
    minDate,
    maxDate,
  } = req.query;
  try {
    const response = await getExcelList(
      id,
      name,
      order,
      orderBy,
      filter,
      minAmount,
      maxAmount,
      minDate,
      maxDate
    );
    let workbook = new excelJS.Workbook();
    const sheet = workbook.addWorksheet("payments");
    sheet.columns = [
      { header: "amount", key: "amount", width: 35 },
      { header: "paymentType", key: "paymentType", width: 35 },
      { header: "addressee", key: "addressee", width: 35 },
      { header: "paymentDate", key: "paymentDate", width: 35 },
    ];

    //********* Header Styles ************/
    sheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
      row.eachCell({ includeEmpty: false }, function (cell, colNumber) {
        if (rowNumber === 1) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFF00" },
          };
        }
      });
    });

    response.forEach((payment) => {
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
    // res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getExcelHandler };
