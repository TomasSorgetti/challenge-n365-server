const { Router } = require("express");
const {
  postUserHandler,
  loginHandler,
} = require("../handlers/userHandler");

const userRouter = Router();

userRouter.post("/", postUserHandler);
userRouter.post("/login", loginHandler);

module.exports = userRouter;
