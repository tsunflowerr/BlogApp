import express from "express";
import { registerUser, loginUser, getCurrentUser, updateUser, deleteUser, getAllUsers, changePassword } from "../controller/userController";
import authMiddleware from "../middleware/authMiddleware";
import adminMiddleware from "../middleware/adminMiddleware";

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);


userRouter.get('/me', authMiddleware, getCurrentUser);
userRouter.put('/me', authMiddleware, updateUser);
userRouter.delete('/me', authMiddleware, deleteUser);
userRouter.delete('/:id?', authMiddleware,adminMiddleware, deleteUser);
userRouter.put('/password', authMiddleware, changePassword);
userRouter.get('/all', authMiddleware, adminMiddleware, getAllUsers);