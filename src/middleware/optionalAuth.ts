import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let authHeader = req.headers.authorization;

  if (!authHeader) {
    const tokenName =
      process.env.NODE_ENV === "prod"
        ? "__Secure-authjs.session-token"
        : "authjs.session-token";
    authHeader = "bearer " + req.cookies[tokenName];
  }

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      req.user = decoded;
    } catch (err) {
      // Token invalid, treat as unauthenticated
      req.user = null;
    }
  } else {
    req.user = null;
  }

  next();
};
