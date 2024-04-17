// controller
const {
  postUserController,
  loginController,
} = require("../controllers/userController");

const catchedAsync = require("../utils/catchedAsync");
const { response } = require("../utils/index");

//************************ Create User ************************//
const postUserHandler = async (req, res) => {
  const { email, password } = req.body;

  const payload = await postUserController(email, password);
  response(res, 200, payload);
};

//************************ Login ************************//
const loginHandler = async (req, res) => {
  const { email, password } = req.body;
  const payload = await loginController(email, password);
  response(res, 200, payload);
};

module.exports = {
  postUserHandler: catchedAsync(postUserHandler),
  loginHandler: catchedAsync(loginHandler),
};
