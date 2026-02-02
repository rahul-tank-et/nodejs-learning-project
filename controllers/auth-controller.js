const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register controller
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // check if user is already exists
    const checkExistingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (checkExistingUser) {
      return res.status(400).json({
        status: false,
        message:
          "User already exists either with username or email, please try different username or email",
      });
    }

    // hash user password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // create new user and save it to db
    const newUser = new User({
      username,
      email,
      password: hashPassword,
      role: role || "user",
    });

    await newUser.save();

    if (newUser) {
      res.status(200).json({
        success: true,
        message: "User registered successfully!",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Unable to register user! please try again",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again",
    });
  }
};

// Login controller
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // first find if current user is exists in db or not
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exists",
      });
    }
    // if password is correct or not
    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // create user token
    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15m" }
    );

    res.status(200).json({
      success: true,
      message: "Logged in successful",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again",
    });
  }
};

// Change password controller
const changePassword = async (req, res) => {
  try {
    const userId = req.userInfo.userId;

    // Extract old and new password
    const { oldPassword, newPassword } = req.body;

    // Find current logged in user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found!",
      });
    }

    // Check if old password is correct
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is not correct! Please try again.",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const newHashPassword = await bcrypt.hash(newPassword, salt);

    // Update user password

    user.password = newHashPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again",
    });
  }
};

module.exports = { registerUser, loginUser, changePassword };
