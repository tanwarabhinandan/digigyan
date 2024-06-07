import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  // Validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }

  // Database call
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      const error = createHttpError(
        400,
        "User Already Exist with this Email ID"
      );
      return next(error);
    }
  } catch (err) {
    return createHttpError(500, "Error while finding user on Database");
  }

  let newUser: User;
  try {
    // Password - Hashed
    const hashedPassword = await bcrypt.hash(password, 10);

    newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (err) {
    return createHttpError(500, "Error While Hashing Password");
  }

  let token: string;
  try {
    // token generation - JWT

    token = sign({ sub: newUser._id }, config.jwtSecret as string, {
      expiresIn: "7d",
      algorithm: "HS256",
    });
  } catch (err) {
    return createHttpError(500, "Error While Hashing Password");
  }

  //Logic - Process

  //Response
  res.status(201).json({
    message: "User Created..!!!",
    id: newUser._id,
    accessToken: token,
  });
};

export { createUser };
