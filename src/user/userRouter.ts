import express from "express";
import { createUser, loginUser } from "./userController";

const userRouter = express.Router();

//Routes

userRouter.post("/resgister", createUser);

userRouter.post("/login", loginUser);

export default userRouter;
