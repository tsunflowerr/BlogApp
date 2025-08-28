import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} from "../controller/categoryController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const categoryRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Categories
 *     description: Quản lý danh mục
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Lấy tất cả categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Danh sách categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *   post:
 *     summary: Tạo category mới
 *     tags: [Categories]
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
 *               name: { type: string }
 *               slug: { type: string }
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: Category được tạo
 */
categoryRouter.get("/", getAllCategories);
categoryRouter.get("/:categoryId", getCategoryById);
categoryRouter.post("/", authMiddleware, createCategory);

/**
 * @swagger
 * /categories/{categoryId}:
 *   get:
 *     summary: Lấy category theo ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category object
 *   put:
 *     summary: Cập nhật category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
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
 *               description: { type: string }
 *     responses:
 *       200:
 *         description: Category đã cập nhật
 *   delete:
 *     summary: Xóa category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category đã xóa
 */
categoryRouter.put("/:categoryId", authMiddleware, updateCategory);
categoryRouter.delete("/:categoryId", authMiddleware, deleteCategory);

export default categoryRouter;
