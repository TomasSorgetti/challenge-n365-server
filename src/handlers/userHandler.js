const { postUserController } = require("../controllers/userController");


//************************ Create User ************************//
const postUserHandler = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) throw new Error("You need to compleate fields");
    const response = await postUserController(email, password);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//************************ Login ************************//

//************************ Get User ************************//






module.exports = {
  postUserHandler,
};
