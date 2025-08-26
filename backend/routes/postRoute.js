import express from "express";
import { getPostById, createPost, getPostsByUser, deletePost, getAllPosts, updatePost } from "../controller/postController";
import authMiddleware from "../middleware/authMiddleware";  
import adminMiddleware from "../middleware/adminMiddleware";

const postRouter = express.Router();

postRouter.route('/').get(getAllPosts).post(authMiddleware, createPost);
postRouter.route('/user/:userId').get(getPostsByUser);
postRouter.route('/:postId').get(getPostById).put(authMiddleware, updatePost).delete(authMiddleware, adminMiddleware, deletePost);