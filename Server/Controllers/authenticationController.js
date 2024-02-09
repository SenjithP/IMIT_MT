import User from "../Models/userSchema.js";
import bcrypt from "bcrypt";
import { generateUserToken } from "../Utils/generateToken.js";
import cloudinary from "cloudinary";

export const registration = async (req, res) => {
  try {
    const { userName, userEmail, userPassword, profileImage } = req.body;
    if (
      !userName ||
      userName.trim().length === 0 ||
      !userEmail ||
      userEmail.trim().length === 0 ||
      !userPassword ||
      userPassword.trim().length === 0
    ) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      throw error;
    }

    if (/\d/.test(userName)) {
      const error = new Error("Name should not contain numbers");
      error.statusCode = 500;
      throw error;
    }

    if (!/^[a-zA-Z0-9._]+@gmail\.com$/.test(userEmail)) {
      const error = new Error("Email should be in @gmail.com format");
      error.statusCode = 500;
      throw error;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(userPassword)) {
      const error = new Error(
        "Password should contain at least 1 capital, 1 small, 1 special character, 1 number, and min 8 characters"
      );
      error.statusCode = 400;
      throw error;
    }
    let profileImages;
    if (profileImage) {
      profileImages = await cloudinary.uploader.upload(profileImage, {
        folder: "profileImages",
      });
    } else {
      const error = new Error("Profile image cannot be empty");
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await User.findOne({ userEmail });

    if (existingUser) {
      const error = new Error("User with this email already exists.");
      error.statusCode = 400;
      throw error;
    } else {
      const hashPassword = await bcrypt.hash(userPassword, 10);
      const user = new User({
        userName,
        userEmail,
        userPassword: hashPassword,
        userProfileImage: profileImages.secure_url,
      });

      await user.save();
      generateUserToken(res, user._id);
      res.status(201).json({
        message: "User registered successfully",
        name: user.userName,
        email: user.userEmail,
        id: user._id,
        profilePhoto: user.userProfileImage
      });
    }
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { userEmail, userPassword } = req.body;
    if (
      !userEmail ||
      userEmail.trim().length === 0 ||
      !userPassword ||
      userPassword.trim().length === 0
    ) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      throw error;
    }
    const user = await User.findOne({ userEmail });
    if (!user) {
      const error = new Error("Invalid Email or Password");
      error.statusCode = 400;
      throw error;
    }
    const verifiedPassword = await bcrypt.compare(
      userPassword,
      user.userPassword
    );
    if (verifiedPassword) {
      generateUserToken(res, user._id);
      res.status(201).json({
        name: user.userName,
        email: user.userEmail,
        id: user._id,
        profilePhoto: user.userProfileImage
      });
    } else {
      const error = new Error("Invalid Email or Password");
      error.statusCode = 400;
      throw error;
    }
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const userLogout = async (req, res) => {
  try {
    res.cookie("userjwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};
