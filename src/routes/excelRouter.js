const { Router } = require("express");
const { verifyAccessToken } = require("../middlewares/auth");
const { getExcelHandler } = require("../handlers/excelHandler");
const excelRouter = Router();

excelRouter.get("/", verifyAccessToken, getExcelHandler);

module.exports = excelRouter;
