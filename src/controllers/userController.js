const { user } = require("../db");
const jwt = require("jsonwebtoken");
const { ADMIN_PASSWORD, ADMIN_EMAIL, SECRET } = process.env;

//************************ Create User ************************//
const postUserController = async (email, password) => {
  if (!email || !password) throw new Error("Fields are empty");
  // verify if user exist
  const userfind = await user.findOne({ where: { email } });
  if (userfind) throw new Error("That mail is allready taken");
  // verify if someone want to use admin credentials but are not valid
  if (ADMIN_EMAIL === email && ADMIN_PASSWORD !== password) {
    throw new Error("you cannot use that password for that email");
  }
  // if admin credentials are valid create admin user and return token to client
  else if (ADMIN_EMAIL === email && ADMIN_PASSWORD === password) {
    const response = await user.create({ email, password, role: "admin" });
    const token = jwt.sign({ id: response.id, role: response.role }, SECRET, {
      expiresIn: "1y",
    });
    return token;
  }
  // if not admin, create common user and return token to client
  else {
    const response = await user.create({ email, password });
    const token = jwt.sign({ id: response.id, role: response.role }, SECRET, {
      expiresIn: "1y",
    });
    return token;
  }
};

//************************ Login ************************//

//************************ Get User ************************//

module.exports = {
  postUserController,
};
