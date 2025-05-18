import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";
import Course from "../models/courses.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";
import { Op } from "sequelize";

import jwt from "jsonwebtoken";

function generateAccesKey(id, email) {
  return jwt.sign({ id, email }, process.env.TOKEN_SECRET);
}

const registerUser = asyncHandler(async (req, res) => {
  const { name, username, email, role, course_id, password } = req.body;
  // console.log("email", email);

  if (
    [name, email, role, course_id, password].some(
      (field) => !field || String(field).trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const conditions = [{ email }];
  if (username?.trim()) {
    conditions.push({ username });
  }

  // here we have to check user on basis of username or email
  const existedUser = await User.findOne({
    where: {
      [Op.or]: conditions,
    },
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exist");
  }

  const existedCourse = await Course.findOne({
    where: {
      id: course_id,
    },
  });

  if (!existedCourse) {
    throw new ApiError(409, "Course with course_id is not exist");
  }

  const hashedPassword = await bcrypt.hash(password, 10); // 10 = saltRounds

  const newUser = await User.create({
    name,
    email,
    course_id,
    role,
    username: (username || "").toLowerCase(),
    password_hash: hashedPassword,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, {}, "User registerd Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "username or email is required");
  }

  const conditions = [{ email }];
  if (username?.trim()) {
    conditions.push({ username });
  }

  // here we have to check user on basis of username or email
  const existedUser = await User.findOne({
    where: {
      [Op.or]: conditions,
    },
  });

  if (!existedUser) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = existedUser.password_hash;

  bcrypt.compare(password, isPasswordValid, async (err, result) => {
    if (err) {
      throw new Error("Password incorrect");
    }
    if (result == true) {
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            user: existedUser.name,
            token: generateAccesKey(existedUser.id, existedUser.email),
          },
          "User logged In successfully"
        )
      );
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Password incorrect" });
    }
  });
});

export { registerUser, loginUser };
