import express from "express";
import {
  createPosts,
  allPosts,
  commentPost,
  getPostComments,
  likePost,
  getSinglePost,
  getSingleImages,
  deletePost,
  replyPostComment,
} from "../Controllers/postController.js";
import userVerifyToken from "../Middlewares/userAuthenticationMiddleware.js";

const homeRouter = express.Router();

homeRouter.get("/allPosts", userVerifyToken, allPosts);
homeRouter.get("/getPostComments", userVerifyToken, getPostComments);
homeRouter.get("/getSinglePost", userVerifyToken, getSinglePost);
homeRouter.get("/getSingleImages", userVerifyToken, getSingleImages);

homeRouter.post("/createPosts", userVerifyToken, createPosts);
homeRouter.post("/createComment", userVerifyToken, commentPost);
homeRouter.post("/likePost", userVerifyToken, likePost);
homeRouter.post("/replyComment", userVerifyToken, replyPostComment);

homeRouter.delete("/deletePost", userVerifyToken, deletePost);

export default homeRouter;
