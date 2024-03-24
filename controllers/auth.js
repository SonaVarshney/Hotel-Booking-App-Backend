import User from "../models/user.js";
import bcrypt from "bcrypt";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
    });

    await newUser.save();
    res.status(200).send("user has been created!");
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User Not found!"));

    //verifying pswd

    const isPswdCrct = await bcrypt.compare(req.body.password, user.password);
    if (!isPswdCrct) return next(createError(404, "Wrong pswd or username"));

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    );
    //randomly generated secret key for hashing

    // An HTTP Only cookie can't be accessed through client-side scripts (like JavaScript), which helps mitigate certain types of cross-site scripting (XSS) attacks because it prevents malicious scripts from accessing the cookie's contents.
    const { password, isAdmin, ...otherDetails } = user._doc;
    //agar password aur admin ke alawa aur sab bhejna hai toh
    res
      .cookie("access_token", token, {
        httpOnly: true, // more secure doesnt allow any
      })
      .status(200)
      .json(otherDetails);
  } catch (err) {
    next(err);
  }
};

// export const register = async (req, res, next) => {};

// export const register = async (req, res, next) => {};

// export const register = async (req, res, next) => {};

// export const register = async (req, res, next) => {};

// export const register = async (req, res, next) => {};
