import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signToken } from "../utils/jwt.js";

const sendAuthResponse = (res, user, statusCode) => {
  const token = signToken(user);
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }
  });
};

export const register = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  sendAuthResponse(res, user, 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  sendAuthResponse(res, user, 200);
});

export const me = asyncHandler(async (req, res) => {
  res.status(200).json({
    status: "success",
    data: { user: req.user }
  });
});
