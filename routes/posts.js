import { Router } from "express";
import {
  createPost,
  getAll,
  getById,
  getMyPosts,
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

// Cet My Posts
// http://localhost:3002/api/posts/user/me
router.get("/user/me", checkAuth, getMyPosts);

export default router;
