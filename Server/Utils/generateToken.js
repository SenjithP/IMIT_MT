import jwt from "jsonwebtoken";

export const generateUserToken = (res, userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.USER_JWT_SECRET, {
      expiresIn: "30d",
    });
  
    res.cookie("userjwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    }); 
    
  } catch (error) {
    console.error("Error generating token:", error);
  }
};
