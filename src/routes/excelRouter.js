const { Router } = require("express");
const { getExcelHandler } = require("../handlers/excelHandler");
const excelRouter = Router();

excelRouter.get("/", getExcelHandler);

module.exports = excelRouter;
