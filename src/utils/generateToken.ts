import jwt from "jsonwebtoken";

const generateToken = (id: string, role: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not defined");
  return jwt.sign({ id, role }, secret, { expiresIn: "1d" });
};

export default generateToken;
