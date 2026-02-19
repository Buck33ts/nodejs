import User from "../models/userModel";
import { hashPassword } from "../utils/hash";
import { Request, Response } from "express";

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  // Check if user exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    password: hashedPassword
  });

  return user;
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const user = await registerUser(name, email, password);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};