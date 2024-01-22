import asyncHandler from "express-async-handler";
import User from "../modals/userModal.js";
import jwt from "jsonwebtoken";

//Registration
export const register = asyncHandler(async (req, res) => {
  console.log("register");
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "pls fill all fields" });
  }

  const userAvailable = await User.findOne({ email });
  console.log("aa", userAvailable);
  if (userAvailable) {
    return res.status(400).json({ message: "already registered" });
  }

  const user = await User.create({
    username,
    email,
    password,
  });
  console.log(`User created ${user}`);
  res.status(200).json({ message: "jhl register" });
});

//login
export const login = asyncHandler(async (req, res) => {
  console.log("login");
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "pls fill all fields" });
  }

  const userAvailable = await User.findOne({ email });
  if (!userAvailable) {
    return res.status(400).json({ message: "please do get registered" });
  }

  if (userAvailable && userAvailable.password == password) {
    const accessToken = jwt.sign(
      {
        user: {
          username: userAvailable.username,
          email: userAvailable.email,
          id: userAvailable.id,
        },
      },
      // console.log("cc", process.env.TOKEN_SECRET),
      process.env.TOKEN_SECRET,
      { expiresIn: "30m" }
    );
    res.status(200).json({ message: "jhl login", accessToken });
  } else {
    return res.status(400).json({
      message: "Incorrect password ! If u r not the user then ask the user",
    });
  }
});

//user
export const user = asyncHandler(async (req, res) => {
  console.log("user");

  const { id } = req.params;

  console.log(id);

  if (!id) {
    return res.status(400).json({ message: "id required" });
  }

  const userAvailable = await User.findById(id);
  if (!userAvailable) {
    return res.status(400).json({ message: "User is not available in DB" });
  }

  res.status(200).json({ message: "Hello User", userAvailable });
});
