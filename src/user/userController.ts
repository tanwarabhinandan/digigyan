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
    return next(createHttpError(400, "All fields are required"));
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
    return next(createHttpError(500, "Error while finding user on Database"));
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
    return next(createHttpError(500, "Error While Hashing Password"));
  }

  let token: string;
  try {
    // token generation - JWT

    token = sign({ sub: newUser._id }, config.jwtSecret as string, {
      expiresIn: "7d",
      algorithm: "HS256",
    });
  } catch (err) {
    return next(createHttpError(500, "Error While generating JWT token"));
  }

  //Logic - Process

  //Response - User Creation
  res.status(201).json({
    message: "User Created..!!!",
    id: newUser._id,
    accessToken: token,
  });
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return next(createHttpError(400, "All field are required"));
  }

  let user;
  try {
    // Database call - Finding user
    user = await userModel.findOne({ email });
    if (!user) {
      return next(createHttpError(404, "User Not Found"));
    }
  } catch (err) {
    return next(createHttpError(500, "Error fatching user from database"));
  }

  // user authentication - compairing password from DB

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(createHttpError(400, "Username or Password incorrect"));
  }

  // Create access token
  let token: string;
  try {
    // token generation - JWT

    token = sign({ sub: user._id }, config.jwtSecret as string, {
      expiresIn: "7d",
      algorithm: "HS256",
    });
  } catch (err) {
    return next(createHttpError(500, "Error While generating JWT token"));
  }

  res.status(200).json({
    message: "User Loged In",
    id: user._id,
    accessToken: token,
  });
};

export { createUser, loginUser };
