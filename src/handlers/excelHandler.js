const { exportToExcelController } = require("../controllers/excelController");

const getExcelHandler = async (req, res) => {
  try {
    const response = await exportToExcelController(req, res);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getExcelHandler };
