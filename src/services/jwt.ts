import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { NextFunction, Request, Response } from "express";

const jwtKey: string = process.env.jwt_SecretKey as string;

if (!jwtKey) {
  throw new Error("JWT_SECRET is not defined in the environment variables");
}

export const tokenGeneration = (
  payload: object,
  secretkey: string | undefined = jwtKey,
  expires: object = { expiresIn: "1h" }
) => {
    
    if (payload && secretkey) {
      const token = jwt.sign(payload, secretkey, expires);
      return token
  }
};

export const verifyJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Access Denied" });
  }

  jwt.verify(token, jwtKey, (err, user) => {
    if (err) {
      return res.status(403).json({ succes: false, message: "invalid token" });
    }
    next();
  });
};
