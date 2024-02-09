import jwt from "jsonwebtoken";

const userVerifyToken = (req, res, next) => {
  const token = req.cookies.userjwt;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.USER_JWT_SECRET);
    const userId = decodedToken.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

export default userVerifyToken;
