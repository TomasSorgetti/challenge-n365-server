const {
  postPaymentController,
  deletePaymentController,
  updatePaymentController,
  getPaymentController,
  getAllPaymentsController,
} = require("../controllers/paymentController");

//************************ Post Payment **************************/
const postPaymentHandler = async (req, res) => {
  const { id } = req.user;
  const { amount, paymentType, addressee, paymentDate } = req.body;

  try {
    const response = await postPaymentController(
      id,
      amount,
      paymentType,
      addressee,
      paymentDate
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//************************ Delete Payment **************************/
const deletePaymentHandler = async (req, res) => {
  const { id } = req.user;
  const { paymentId } = req.params;
  try {
    await deletePaymentController(id, paymentId);
    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//************************ Update Payment **************************/
const updatePaymentHandler = async (req, res) => {
  const { id } = req.user;
  const { paymentId } = req.params;
  const { amount, paymentType, addressee, paymentDate } = req.body;
  try {
    await updatePaymentController(
      id,
      paymentId,
      amount,
      paymentType,
      addressee,
      paymentDate
    );
    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//************************ Get Payment **************************/
const getPaymentHandler = async (req, res) => {
  const { id } = req.user;
  const { paymentId } = req.params;

  try {
    const response = await getPaymentController(id, paymentId);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//************************ Get All Payments **************************/
const getAllPaymentsHandler = async (req, res) => {
  const { id } = req.user;
  const { name, order, orderBy, filter, page } = req.query;
  try {
    const response = await getAllPaymentsController(
      id,
      name,
      order,
      orderBy,
      filter,
      page
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  postPaymentHandler,
  deletePaymentHandler,
  updatePaymentHandler,
  getPaymentHandler,
  getAllPaymentsHandler,
};
