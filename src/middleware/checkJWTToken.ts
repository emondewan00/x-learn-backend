import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const checkJWTToken = (req: Request, res: Response, next: NextFunction) => {
  let authToken = req.headers.authorization;

  if (!authToken) {
    const tokenName =
      process.env.NODE_ENV === "prod"
        ? "__Secure-authjs.session-token"
        : "authjs.session-token";
    authToken = "bearer " + req.cookies[tokenName];
  }

  console.log(JSON.stringify(req.cookies), authToken, "hello");
  if (!authToken) {
    res.status(401).send("Unauthorized");
    return;
  }

  const token = authToken.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded as JwtPayload;
    next();
  } catch (err) {
    console.error("JWT Verification Error:" + token, err, token, "hello");
    res.status(401).json({ message: "Unauthorized" });
  }
};

export default checkJWTToken;
