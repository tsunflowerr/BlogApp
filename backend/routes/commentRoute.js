import express from 'express';
import {getCommentsByPost, deleteComment, updateComment, addComment} from '../controller/commentController.js'
import authMiddleware from '../middleware/authMiddleware.js';

const commentRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Comments
 *     description: Quản lý bình luận
 */

/**
 * @swagger
 * /posts/{postId}/comments:
 *   get:
 *     summary: Lấy tất cả bình luận của 1 bài viết
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách bình luận
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *   post:
 *     summary: Thêm bình luận cho bài viết
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Bình luận đã được thêm
 */
commentRouter.get('/posts/:postId/comments', getCommentsByPost);
commentRouter.post('/posts/:postId/comments',authMiddleware, addComment);

/**
 * @swagger
 * /comments/{commentId}:
 *   put:
 *     summary: Cập nhật bình luận
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content: { type: string }
 *     responses:
 *       200:
 *         description: Bình luận đã cập nhật
 *   delete:
 *     summary: Xoá bình luận
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bình luận đã xóa
 */
commentRouter.put('/comments/:commentId', authMiddleware, updateComment);
commentRouter.delete('/comments/:commentId', authMiddleware, deleteComment);

export default commentRouter;
