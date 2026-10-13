import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;

  //Check If User Already Exist or Not
  const userExist = await prisma.user.findUnique({ where: { email: email } });

  if (userExist) {
    return res.status(400).json({
      error: "User already exists with this email",
    });
  }

  //Hash Password
  const salf = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salf);

  //Create User
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  //Generate JWT
  const token = generateToken(user.id, res);

  //Response
  res.status(201).json({
    status: "success",
    message: "User registered successfully",
    data: {
      user: {
        id: user.id,
        name: name,
        email: email,
      },
      token,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  //Check email exist in table
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    return res.status(401).json({
      error: "User not found.",
    });
  }

  //Verify Password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      error: "Invalid Password",
    });
  }

  //Generate JWT
  const token = generateToken(user.id, res);

  //Response
  res.status(200).json({
    status: "success",
    message: "User logged in successfully",
    data: {
      user: {
        id: user.id,
        email: email,
      },
      token,
    },
  });
};

const logout = async (req, res) => {
  res.cookie("jwt", "", {
    expires: new Date(0),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

export { register, login, logout };
