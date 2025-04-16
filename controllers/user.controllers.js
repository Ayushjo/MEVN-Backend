import { User } from "../models/User.models.js";
import Joi from "joi";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../utils/jwttoken.js";
import dotenv from "dotenv";
dotenv.config();

const registerJoiSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.empty": "Username is required",
    "string.min": "Username must be at least 3 characters",
    "string.max": "Username must be less than 30 characters",
    "string.alphanum": "Username must contain only letters and numbers",
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } }) // allow all domains
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Enter a valid email address",
    }),

  password: Joi.string()
    .min(6)
    .max(128)
    .required()
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@#$%!^&*()_+]+$")
    )
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters",
      "string.max": "Password must be less than 128 characters",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
});
const loginJoiSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.empty": "Username is required",
    "string.min": "Username must be at least 3 characters",
    "string.max": "Username must be less than 30 characters",
    "string.alphanum": "Username must contain only letters and numbers",
  }),

  /*email: Joi.string()
    .email({ tlds: { allow: false } }) // allow all domains
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Enter a valid email address",
    }),*/

  password: Joi.string()
    .min(6)
    .max(128)
    .required()
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@#$%!^&*()_+]+$")
    )
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters",
      "string.max": "Password must be less than 128 characters",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
});

const userRegister = async (req, res) => {
  const { error } = registerJoiSchema.validate(req.body);
  if (error) {
    const errors = error.details.map((err) => ({
      field: err.path[0],
      message: err.message,
    }));
    res.status(400).json({ errors });
  } else {
    const { username, email, password } = req.body;
    const user = await User.findOne({ username });
    if (user) {
      res.status(400).send("User with this username already exists.!");
    } else {
      const user = await User.create({
        email,
        username,
        password,
      });
      const token =await generateAccessToken(user._id)
      const existedUser = await User.findById(user._id);
      if (!existedUser) {
        res.status(404).send("User not created");
      } else {
        res.status(200).json({
          data: existedUser,
          message: "User created successfully",
          token
        });
      }
    }
  }
};

const loginUser = async (req, res) => {
  const { error } = loginJoiSchema.validate(req.body);
  if (error) {
    const errors = error.details.map((err) => ({
      field: err.path[0],
      message: err.message,
    }));
    res.status(400).json({ errors });
  } else {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).send("Account with this username does not exist.!");
    } else {
      const isCorrect = await bcrypt.compare(password, user.password);
      if (isCorrect) {
        const token = await generateAccessToken(user._id);
        res
          .status(200)
          .json({ data: user, token, message: "Successfull login:>" });
      } else {
        res.status(400).send("Incorrect Password!");
      }
    }
  }
};

const profileUser = async (req, res) => {
  const userid = req.userid;
  if (!userid) {
    res.status(400).send("Somethings worng!!..");
  } else {
    const user = await User.findById(userid).select("-password -email");
    res.send(user);
  }
};
export { userRegister, loginUser, profileUser };
