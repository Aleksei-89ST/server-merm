import { Router } from "express";
import { createPosts } from "../controllers/posts.js";
import { checkAuth } from "../utils/checkAuth.js";

const router = new Router();

// Create Post
// http://localhost:3002/api/posts
router.post("/", checkAuth,createPosts);

export default router;
