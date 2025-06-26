import { User } from "../models/user.model";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken";

type REgisterInput = {
  name: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

export const registerUser = async (
  req: Request<{}, {}, REgisterInput>,
  res: Response
): Promise<void> => {
  console.log(req.body);
  try {
    const { name, email, password } = req.body;
    console.log(req.body);
    if (!name || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = generateToken(user._id.toString(), user.role); // this token is not used in frontend

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: user._id, name, email, role: user.role },
    });
  } catch (error) {
    console.error(error, req.body);
    res.status(500).json({ message: "Error registering user" });
  }
};

export const loginUser = async (
  req: Request<{}, {}, LoginInput>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Email and password required" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = generateToken(user._id.toString(), user.role); // this token is not used in frontend

    res.status(200).json({
      message: "User logged in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in user" });
  }
};
