const {
  postUserController,
  loginController,
  getUserController,
} = require("../controllers/userController");

//************************ Create User ************************//
const postUserHandler = async (req, res) => {
  const { email, password } = req.body;

  try {
    const response = await postUserController(email, password);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//************************ Login ************************//
const loginHandler = async (req, res) => {
  const { email, password } = req.body;

  try {
    const response = await loginController(email, password);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//************************ Get User ************************//
const getUserHandler = async (req, res) => {
  const { id } = req.user;
  try {
    const response = await getUserController(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  postUserHandler,
  loginHandler,
  getUserHandler,
};
