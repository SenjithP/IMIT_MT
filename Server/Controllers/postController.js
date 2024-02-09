import Post from "../Models/postSchema.js";
import Comment from "../Models/commentSchema.js";
import User from "../Models/userSchema.js";
import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";

export const createPosts = async (req, res) => {
  try {
    const { feed, userId, feedImage } = req.body;
    if (!feed || feed.trim().length === 0) {
      const error = new Error("Share your thoughts, please.");
      error.statusCode = 400;
      throw error;
    }
    if (!feedImage) {
      const error = new Error("Share an Image, please.");
      error.statusCode = 400;
      throw error;
    }
    let feedImages;
    if (feedImage) {
      feedImages = await cloudinary.uploader.upload(feedImage, {
        folder: "feedImages",
      });
    }

    const post = await Post.create({
      userId,
      feed,
      feedImage: feedImages.secure_url,
    });

    res.status(200).json({ message: "Posted successfully", post });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const allPosts = async (req, res) => {
  try {
    const allPosts = await Post.find({}).populate("userId");
    if (!allPosts || allPosts.length === 0) {
      const error = new Error("No posts found");
      error.statusCode = 404;
      throw error;
    }

    const reversedPosts = allPosts.reverse();

    res.status(200).json({ allPosts: reversedPosts });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const commentPost = async (req, res) => {
  try {
    const { postComment, userCommentId, postId } = req.body;
    if (!postComment || postComment.trim().length === 0) {
      const error = new Error("Comment required");
      error.statusCode = 404;
      throw error;
    }
    const newComment = new Comment({
      postComment,
      userId: userCommentId,
      postId,
    });
    await newComment.save();

    const post = await Post.findById(postId);
    post.comments.push(newComment._id);
    const updatedPost = await Post.findByIdAndUpdate(postId, post, {
      new: true,
    });
    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const getSinglePost = async (req, res) => {
  try {
    if (!req.query.id) {
      return res.status(400).json({ error: "Post ID is required" });
    }

    const post = await Post.findById(req.query.id).populate("userId");

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSingleImages = async (req, res) => {
  try {
    if (!req.query.id || !req.query.id.trim()) {
      return res.status(400).json({ error: "Post ID is required" });
    }
    const post = await Post.findById(req.query.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const userId = post.userId;
    const postByUser = await Post.find({ userId: userId });
    res.status(200).json(postByUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPostComments = async (req, res) => {
  try {
    const postId = req.query.id;

    const postComments = await Comment.find({ postId: postId }).populate([
      {
        path: "userId",
      },
      {
        path: "replies",
        populate: {
          path: "userId",
        },
      },
    ]);

    res.status(200).json(postComments);
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const token = req.cookies.userjwt;
    if (!token) {
      const error = new Error("Unauthorized - Missing JWT");
      error.statusCode = 401;
      throw error;
    }

    const decodedToken = jwt.verify(token, process.env.USER_JWT_SECRET);

    const postId = req.body.postId;
    const userId = decodedToken.userId;

    if (!postId) {
      const error = new Error("postId is required");
      error.statusCode = 400;
      throw error;
    }

    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Post not found");
      error.statusCode = 404;
      throw error;
    }

    const likedIndex = post.likes.findIndex((like) => like.includes(userId));

    if (likedIndex === -1) {
      post.likes.push(userId);
      await post.save();
      res.status(200).json({
        message: "Post Liked Successfully",
      });
    } else {
      post.likes.splice(likedIndex, 1);
      await post.save();
      res.status(200).json({
        message: "Post Unliked Successfully",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const replyPostComment = async (req, res) => {
  const { userCommentId, commentId, replyComment } = req.body;

  if (!replyComment || replyComment.trim().length === 0) {
    res.status(404).json({ message: "Comment is required." });
  }
  try {
    const commentInfo = await Comment.findById(commentId);
    commentInfo.replies.push({
      userId: userCommentId,
      comment: replyComment,
    });
    commentInfo.save();
    res.status(200).json(commentInfo);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.body;
    if (!postId) {
      return res.status(400).json({ message: "Invalid postId" });
    }
    const post = await Post.findByIdAndDelete(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const commentRelated = await Comment.find({ postId });
    if (commentRelated.length === 0) {
      return res.status(200).json({ message: "Post deleted successfully" });
    }
    await Comment.deleteMany({ postId });
    return res
      .status(200)
      .json({ message: "Post and related comments deleted successfully" });
  } catch (error) {
    console.error("Errors:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
