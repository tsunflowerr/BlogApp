import express from "express";
import { getPostById, createPost, getPostsByUser, deletePost, getAllPosts, updatePost, getPostByCategorySlug, getPostByTagSlug, likePost } from "../controller/postController.js";
import authMiddleware from "../middleware/authMiddleware.js";  
import adminMiddleware from "../middleware/adminMiddleware.js";

const postRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Posts
 *     description: Quản lý bài viết
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Lấy tất cả bài viết
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Danh sách bài viết
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *   post:
 *     summary: Tạo bài viết mới
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               category: { type: string }
 *               thumbnail: { type: string }
 *     responses:
 *       201:
 *         description: Bài viết được tạo
 */
postRouter.route('/').get(getAllPosts).post(authMiddleware, createPost);

/**
 * @swagger
 * /posts/user/{userId}:
 *   get:
 *     summary: Lấy bài viết theo user
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách bài viết của user
 */
postRouter.route('/user/:userId').get(getPostsByUser);

/**
 * @swagger
 * /posts/{postId}:
 *   get:
 *     summary: Lấy bài viết theo ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin bài viết
 *   put:
 *     summary: Cập nhật bài viết
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *               tags:
 *                 type: array
 *                 items: { type: string }
 *               category: { type: string }
 *               thumbnail: { type: string }
 *     responses:
 *       200:
 *         description: Bài viết được cập nhật
 *   delete:
 *     summary: Xoá bài viết (admin)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bài viết đã xóa
 */
postRouter.route('/:postId').get(getPostById).put(authMiddleware, updatePost).delete(authMiddleware, deletePost);

/**
 * @swagger
 * /posts/category/{slug}:
 *   get:
 *     summary: Lấy danh sách bài viết theo category
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         description: Slug của category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách bài viết thuộc category
 *       404:
 *         description: Không tìm thấy category
 */
postRouter.get('/category/:slug', getPostByCategorySlug);
/**
 * @swagger
 * /posts/tag/{slug}:
 *   get:
 *     summary: Lấy danh sách bài viết theo tag
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         description: Slug của tag
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách bài viết thuộc tag
 *       404:
 *         description: Không tìm thấy tag
 */
postRouter.get('/tag/:slug', getPostByTagSlug);
postRouter.post('/:postId/like', authMiddleware, likePost)
export default postRouter;
