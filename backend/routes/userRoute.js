import express from "express";
import { registerUser, loginUser, getCurrentUser, updateUser, deleteUser, getAllUsers, changePassword } from "../controller/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const userRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Quản lý người dùng
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Đăng ký người dùng mới
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       201:
 *         description: Tạo user thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
userRouter.post('/register', registerUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Đăng nhập
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Đăng nhập thành công (trả token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 */
userRouter.post('/login', loginUser);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Lấy thông tin user hiện tại
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
userRouter.get('/me', authMiddleware, getCurrentUser);

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Cập nhật user hiện tại
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName: { type: string }
 *               email: { type: string }
 *     responses:
 *       200:
 *         description: User đã được cập nhật
 */
userRouter.put('/me', authMiddleware, updateUser);

/**
 * @swagger
 * /users/me:
 *   delete:
 *     summary: Xóa tài khoản hiện tại
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tài khoản đã xóa
 */
userRouter.delete('/me', authMiddleware, deleteUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Xóa user theo id (admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User đã bị xóa
 */
userRouter.delete('/:id', authMiddleware,adminMiddleware, deleteUser);

/**
 * @swagger
 * /users/password:
 *   put:
 *     summary: Thay đổi mật khẩu
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [oldPassword, newPassword]
 *             properties:
 *               oldPassword: { type: string }
 *               newPassword: { type: string }
 *     responses:
 *       200:
 *         description: Mật khẩu đã thay đổi
 */
userRouter.put('/password', authMiddleware, changePassword);

/**
 * @swagger
 * /users/all:
 *   get:
 *     summary: Lấy danh sách tất cả users (admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
userRouter.get('/all', authMiddleware, adminMiddleware, getAllUsers);

export default userRouter;
