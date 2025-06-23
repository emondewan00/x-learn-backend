import { Request, Response, NextFunction } from "express";

export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (user.role !== "admin") {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
