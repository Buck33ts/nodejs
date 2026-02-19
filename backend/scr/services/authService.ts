import User from "../models/userModel";
import { hashPassword } from "../utils/hash";

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