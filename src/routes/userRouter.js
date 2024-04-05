const { Router } = require("express");
const {
  postUserHandler,
  loginHandler,
  getUserHandler,
} = require("../handlers/userHandler");
const { verifyAccessToken } = require("../middlewares/auth");
const userRouter = Router();

userRouter.post("/", postUserHandler);
userRouter.post("/login", loginHandler);
userRouter.get("/", verifyAccessToken, getUserHandler);

module.exports = userRouter;
