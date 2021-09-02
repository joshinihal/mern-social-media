const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { SECRET_KEY } = require("../config");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../util/validators");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
};

const index = async (req, res) => {
  try {
    const users = await User.find();
    if (users) {
      res.json({
        status: "success",
        message: "Users retrieved successfully",
        data: users,
      });
    } else {
      throw new Error("Users not found!");
    }
  } catch (error) {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message,
      },
    });
  }
};

const create = async (req, res) => {
  // validate data
  try {
    const { valid, errors } = validateRegisterInput(
      req.body.username,
      req.body.email,
      req.body.password,
      req.body.confirmPassword
    );
    if (!valid) {
      throw new Error(errors);
    }
    const username = req.body.username;
    // check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw new Error("User already exist!");
    } else {
      // hash password
      const password = await bcrypt.hash(req.body.password, 12);
      const email = req.body.email;
      const createdAt = new Date().toISOString();

      let user = new User({
        username,
        password,
        email,
        createdAt,
      });

      const result = await user.save();
      // auth token
      const token = generateToken(result);

      res.json({
        status: "success",
        message: "User Created Successfully!",
        data: {
          email: result._doc.email,
          username: result._doc.username,
          createdAt: result._doc.createdAt,
          id: res._id,
          token,
        },
      });
    }
  } catch (error) {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message,
      },
    });
  }
};

const auth = async (req, res) => {
  // validate data
  try {
    const { valid, errors } = validateLoginInput(
      req.body.username,
      req.body.password
    );
    if (!valid) {
      throw new Error(errors);
    }
    const username = req.body.username;
    // check if user exists
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      throw new Error("User not found!");
    }
    // hash password
    const password = req.body.password;
    const match = await bcrypt.compare(password, existingUser.password);
    if (!match) {
      throw new Error("Wrong credentials!");
    }

    // auth token
    const token = generateToken(existingUser);

    res.json({
      status: "success",
      message: "User Authenticated Successfully",
      data: {
        email: existingUser._doc.email,
        username: existingUser._doc.username,
        createdAt: existingUser._doc.createdAt,
        id: existingUser._id,
        token,
      },
    });
  } catch (error) {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message,
      },
    });
  }
};

module.exports = { index, create, auth };
