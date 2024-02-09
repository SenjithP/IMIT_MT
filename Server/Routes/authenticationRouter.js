import express from "express";
import {
  login,
  registration,
  userLogout,
} from "../Controllers/authenticationController.js";
import userVerifyToken from "../Middlewares/userAuthenticationMiddleware.js";

const authenticationRouter = express.Router();
authenticationRouter.post("/userRegistration", registration);
authenticationRouter.post("/userLogin", login);
authenticationRouter.post("/userLogout", userVerifyToken, userLogout);

export default authenticationRouter;
