const { user } = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { ClientErrors } = require("../utils/errors");
const { ADMIN_PASSWORD, ADMIN_EMAIL, SECRET } = process.env;

//************************ Create User ************************//
const postUserController = async (email, password) => {
  if (!email || !password) throw new ClientErrors("Empty fields", 400);

  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    throw new ClientErrors("Invalid email", 400);
  if (password.length < 5)
    throw new ClientErrors("must have more that 5 letters", 400);

  const userfind = await user.findOne({ where: { email } });
  if (userfind) throw new ClientErrors("That mail is already taken", 400);

  if (ADMIN_EMAIL === email && ADMIN_PASSWORD !== password) {
    throw new Error("you cannot use that password for that email");
  } else if (ADMIN_EMAIL === email && ADMIN_PASSWORD === password) {
    const response = await user.create({ email, password, role: "admin" });
    const token = jwt.sign({ id: response.id, role: response.role }, SECRET, {
      expiresIn: "1y",
    });
    return { token: token };
  } else {
    const response = await user.create({ email, password });
    const token = jwt.sign({ id: response.id, role: response.role }, SECRET, {
      expiresIn: "1y",
    });
    return { token: token };
  }
};

//************************ Login ************************//
const loginController = async (email, password) => {
  if (!email || !password) throw new ClientErrors("Fields are empty", 400);
  // verify if user exists
  const userVerification = await user.findOne({ where: { email } });
  if (!userVerification) throw new ClientErrors("user doesn't exist", 404);
  // verify if password is correct
  const match = await bcrypt.compare(password, userVerification.password);
  if (match) {
    const token = jwt.sign(
      { id: userVerification.id, role: userVerification.role },
      SECRET,
      {
        expiresIn: "1y",
      }
    );
    return { token: token };
  }
  throw new ClientErrors("wrong password", 400);
};

module.exports = {
  postUserController,
  loginController,
};
