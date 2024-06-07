import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";
import { config } from "../config/config";

export interface Authrequest extends Request {
  userId: string;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");
  if (!token) {
    return next(createHttpError(401, "Authorization token is required"));
  }

  try {
    const parsedToken = token.split(" ")[1];
    const decoded = verify(parsedToken, config.jwtSecret as string);

    //   console.log("Decoded: ", decoded);
    const _req = req as Authrequest;
    _req.userId = decoded.sub as string;
    next();
  } catch (err) {
    return next(createHttpError(401, "Invailed or Token Expired"));
  }
};

export default authenticate;
