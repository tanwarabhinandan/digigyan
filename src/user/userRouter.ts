import express from "express";
import { createUser } from "./userController";

const userRouter = express.Router();

//Routes

userRouter.post("/resgister", createUser);

export default userRouter;
