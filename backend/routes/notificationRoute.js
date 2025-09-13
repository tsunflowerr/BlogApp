import express from 'express';
import { getNotification, markAsRead} from '../controller/notificationController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const notificationRoute = express.Router()

notificationRoute.get('/', authMiddleware, getNotification)
notificationRoute.put('/:id/read',authMiddleware, markAsRead)

export default notificationRoute