import { Router } from "express";
import {
  createPost,
  getAll,
  getById,
  getMyPosts,
  removePost,
  updatePost,
  getPostComments,
} from "../controllers/posts.js";
import { checkAuth } from "../utils/checkAuth.js";

const router = new Router();

// Create Post
// http://localhost:3002/api/posts
router.post("/", checkAuth, createPost);

// Cet All Posts
// http://localhost:3002/api/posts
router.get("/", getAll);

// Cet Post By Id
// http://localhost:3002/api/posts/:id
router.get("/:id", getById);

// Update Post
// http://localhost:3002/api/posts/:id
router.put("/:id", checkAuth, updatePost);

// Cet My Posts
// http://localhost:3002/api/posts/user/me
router.get("/user/me", checkAuth, getMyPosts);

// Remove Post
// http://localhost:3002/api/posts/:id
router.delete("/:id", checkAuth, removePost);

// Get Post Comments
// http://localhost:3002/api/comments/:id
router.get("/comments/:id", getPostComments);

export default router;
