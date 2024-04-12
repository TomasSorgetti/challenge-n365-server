const { user } = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { ADMIN_PASSWORD, ADMIN_EMAIL, SECRET } = process.env;


//************************ Create User ************************//
const postUserController = async (email, password) => {
  if (!email || !password) throw new Error("Fields are empty");
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    throw new Error("Invalid email");
  if (password.length < 5) throw new Error("must have more that 5 letters");


  const userfind = await user.findOne({ where: { email } });
  if (userfind) throw new Error("That mail is already taken");

  if (ADMIN_EMAIL === email && ADMIN_PASSWORD !== password) {
    throw new Error("you cannot use that password for that email");
  }

  else if (ADMIN_EMAIL === email && ADMIN_PASSWORD === password) {
    const response = await user.create({ email, password, role: "admin" });
    const token = jwt.sign({ id: response.id, role: response.role }, SECRET, {
      expiresIn: "1y",
    });
    return { token: token }
  }
  else {
    const response = await user.create({ email, password });
    const token = jwt.sign({ id: response.id, role: response.role }, SECRET, {
      expiresIn: "1y",
    });
    return { token: token };
  }
};

//************************ Login ************************//
const loginController = async (email, password) => {
  if (!email || !password) throw new Error("Fields are empty");

  // verify if user exists
  const userVerification = await user.findOne({ where: { email } });

  if (!userVerification) throw new Error("user does not exist");

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
  throw new Error("wrong password");
};

module.exports = {
  postUserController,
  loginController,
};
