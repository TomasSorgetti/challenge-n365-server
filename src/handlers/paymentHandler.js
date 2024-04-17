const {
  postPaymentController,
  deletePaymentController,
  updatePaymentController,
  getPaymentController,
  getAllPaymentsController,
} = require("../controllers/paymentController");
const catchedAsync = require("../utils/catchedAsync");
const { response } = require("../utils/index");

//************************ Post Payment **************************/
const postPaymentHandler = async (req, res) => {
  const { id } = req.user;
  const { amount, paymentType, addressee, paymentDate } = req.body;

  const payload = await postPaymentController(
    id,
    amount,
    paymentType,
    addressee,
    paymentDate
  );
  response(res, 200, payload);
};

//************************ Delete Payment **************************/
const deletePaymentHandler = async (req, res) => {
  const { id } = req.user;
  const { paymentId } = req.params;

  const payload = await deletePaymentController(id, paymentId);
  response(res, 204, payload);
};

//************************ Update Payment **************************/
const updatePaymentHandler = async (req, res) => {
  const { id } = req.user;
  const { paymentId } = req.params;
  const { amount, paymentType, addressee, paymentDate } = req.body;

  const payload = await updatePaymentController(
    id,
    paymentId,
    amount,
    paymentType,
    addressee,
    paymentDate
  );
  response(res, 204, payload);
};

//************************ Get Payment **************************/
const getPaymentHandler = async (req, res) => {
  const { id } = req.user;
  const { paymentId } = req.params;

  const response = await getPaymentController(id, paymentId);
  res.status(200).json(response);
};

//************************ Get All Payments **************************/
const getAllPaymentsHandler = async (req, res) => {
  const { id } = req.user;
  const {
    name,
    order,
    orderBy,
    filter,
    page,
    minAmount,
    maxAmount,
    minDate,
    maxDate,
    limit,
  } = req.query;
  const payload = await getAllPaymentsController(
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
  );

  response(res, 200, payload);
};

module.exports = {
  postPaymentHandler: catchedAsync(postPaymentHandler),
  deletePaymentHandler: catchedAsync(deletePaymentHandler),
  updatePaymentHandler: catchedAsync(updatePaymentHandler),
  getPaymentHandler: catchedAsync(getPaymentHandler),
  getAllPaymentsHandler: catchedAsync(getAllPaymentsHandler),
};
