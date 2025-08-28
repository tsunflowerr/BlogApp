import express from 'express';
import { createTag, getTagById, deleteTag, getAllTags, updateTag } from '../controller/tagController.js';
import authMiddleware from '../middleware/authMiddleware.js';
const tagRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Tags
 *     description: Quản lý tags
 */

/**
 * @swagger
 * /tags:
 *   get:
 *     summary: Lấy tất cả tags
 *     tags: [Tags]
 *     responses:
 *       200:
 *         description: Danh sách tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tag'
 */
tagRouter.get("/", getAllTags);

/**
 * @swagger
 * /tags/{tagId}:
 *   get:
 *     summary: Lấy tag theo ID
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tag object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 *       404:
 *         description: Tag không tồn tại
 */
tagRouter.get("/:tagId", getTagById);

/**
 * @swagger
 * /tags:
 *   post:
 *     summary: Tạo tag mới
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, slug]
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tag được tạo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 *       401:
 *         $ref: '#/components/schemas/Error'
 */
tagRouter.post("/", authMiddleware, createTag);

/**
 * @swagger
 * /tags/{tagId}:
 *   put:
 *     summary: Cập nhật tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               slug: { type: string }
 *     responses:
 *       200:
 *         description: Tag đã cập nhật
 *       401:
 *         $ref: '#/components/schemas/Error'
 */
tagRouter.put("/:tagId", authMiddleware, updateTag);

/**
 * @swagger
 * /tags/{tagId}:
 *   delete:
 *     summary: Xoá tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tag đã xóa
 *       401:
 *         $ref: '#/components/schemas/Error'
 */
tagRouter.delete("/:tagId", authMiddleware, deleteTag);

export default tagRouter;
