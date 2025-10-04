import User from '../models/userModel.js';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import e from 'express';
import Post from '../models/postModel.js'
import Comment from "../models/commentModel.js"
import Notification from '../models/notificationModel.js';

const JWT_SECRET = process.env.JWT_SECRET   || 'your_jwt_secret_key';
const JWT_EXPIRES_IN = "24h"; // Token expiration time

const createToken = (userId) => {
    return jwt.sign({id: userId}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});
}

export async function registerUser(req, res) {
    const {username, email, password} = req.body;
    if(!username || !email || !password) {
        return res.status(400).json({success: false, message: 'All fields are required'});
    }
    if(!validator.isEmail(email)) {
        return res.status(400).json({success: false, message: "Invalid email format"});
    }
    if(password.length < 6) {
        return res.status(400).json({success: false, message: "Password must be at least 6 characters long"});
    }       
    try {
        if(await User.findOne({email})) {
            return res.status(400).json({success: false, message: "Email already in use"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({username, email, password: hashedPassword, avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username || "User")}&background=random`});
        const token = createToken(newUser._id);
        res.status(201).json({
            success: true,
            token,
            newUser: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                avatar: newUser.avatar
            },
        })

    }
    catch(error) {
        console.error('Error registering user:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
}

export async function loginUser(req, res) {
    const {email, password} = req.body; 
    if(!email || !password) {
        return res.status(400).json({success: false, message: 'Please fill all fields'});
    }
    try {
        const user = await User.findOne({email})
        if(!user) {
            return res.status(400).json({success:false, message:'User not exist'});
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(400).json({success:false, message:"Invalid credentials"});
        }
        const token = createToken(user._id);
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    }
    catch(error) {
        console.error('Error logging in user:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
}

export async function getCurrentUser(req, res) {
    try {
        const user = await User.findById(req.user.id).select('username email avatar followers followings').populate("followers", "username email avatar").populate("followings", "username email avatar");
        if(!user) {
            return res.status(404).json({success:false, message:'User not found'})
        }
        res.status(200).json({success:true, user});
    }
    catch(error) {
        console.log('Error fetching user:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
}

export async function updateUser(req, res) {

    const {username, email, avatar} = req.body;
    if(!username && !email) {
        return res.status(400).json({success: false, message: 'Please fill all fields'});
    }
    if(email && !validator.isEmail(email)) {
        return res.status(400).json({success: false, message: "Invalid email format"});
    }
    try {
        const exist = await User.findOne({email, _id:{$ne: req.user.id}});
        if(exist) {
            return res.status(400).json({success: false, message: "Email already in use"});
        }
        const user = await User.findByIdAndUpdate(req.user.id, {username, email, avatar}, {new: true}).select('username email avatar');
        res.status(200).json({success: true, user});
    }
    catch(error) {
        console.log('Error updating user:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
    
}

import mongoose from "mongoose";

export async function deleteUser(req, res) {
    try {
        const userIdtoDelete = req.params.id || req.user.id;

        if (req.params.id && req.params.id !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
        }

        const userObjectId = new mongoose.Types.ObjectId(userIdtoDelete);

        const deleteUser = await User.findByIdAndDelete(userObjectId);

        if (!deleteUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Xóa tất cả bài viết của user
        await Post.deleteMany({ author: userObjectId });
        // Xóa tất cả comment của user
        await Comment.deleteMany({ author: userObjectId });
        // Xóa user khỏi danh sách likes của tất cả bài viết
        await Post.updateMany(
            { likes: userObjectId },
            { $pull: { likes: userObjectId } }
        );

        res.status(200).json({ success: true, message: 'User deleted successfully' });
    }
    catch (error) {
        console.log('Error deleting user:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

export async function getAllUsers(req, res) {
    try {
        const users = await User.find().select('username email isAdmin createdAt');
        res.status(200).json({success:true, users});
    }
    catch(error) {
        console.log('Error fetching users:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
}

export async function changePassword(req, res) {
    const {oldPassword, newPassword} = req.body;
    if(!oldPassword || !newPassword) {
        return res.status(400).json({success: false, message: 'Please fill all fields'});
    }
    if(newPassword.length < 6) {
        return res.status(400).json({success: false, message: "new password must be at least 6 characters long"});
    }
    try {
        const user = await User.findById(req.user.id).select('password');
        if(!user) {
            return res.status(404).json({success:false, message:'User not found'})
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if(!isMatch) {
            return res.status(400).json({success:false, message:"Invalid old password"});
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({success:true, message:"Password changed successfully"});
    }
    catch(error) {
        console.log('Error changing password:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
}

export async function handleFollow(req, res) {
  try {
    const currentUserId = req.user._id?.toString() || req.user?.id?.toString();
    const targetUserId = req.params.id;


    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ success: false, message: "No user found" });
    }

    const isFollowing = targetUser.followers.some(f => f.toString() === currentUserId);
    if (!isFollowing) {
      targetUser.followers.push(currentUser._id);
      currentUser.followings.push(targetUser._id);
      const notification = new Notification({
        postId : null,
        author :targetUserId,
        user :currentUserId,
        type   : "follow",
        content : "started following you",
      })
      await notification.save();
      await targetUser.save();
      await currentUser.save();
      return res.status(200).json({ success: true, type:"Follow", message: "Followed user successfully" });
    } else {
      targetUser.followers = targetUser.followers.filter(f => f.toString() !== currentUserId);
      currentUser.followings = currentUser.followings.filter(f => f.toString() !== targetUserId);
      await targetUser.save();
      await currentUser.save();
      return res.status(200).json({ success: true, type:"Unfollow", message: "Unfollowed user successfully" });
    }
  } catch (err) {
    console.error("Error handle follow this user:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function getUserById(req, res) {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('username email avatar followers followings').populate("followers", "username email avatar").populate("followings", "username email avatar");
        if(!user) {
            return res.status(404).json({success:false, message:'User not found'})
        }
        res.status(200).json({success:true, user});
    }
    catch(error) {
        console.log('Error fetching user by id:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
}

export async function getUserBookMarks(req, res) {
    try {
        const userId = req.user._id || req.user.id;
        const user = await User.findById(userId)
        .select('bookmarks')
        .populate({
            path: 'bookmarks',
            select: "title content author tags category thumbnail likeCount likes comments",
            populate: [
                { path: 'author', select: 'username avatar' },
                { path: 'tags', select: 'name slug' },
                { path: 'category', select: 'name slug' }
            ]
        });
        if(!user) {
            return res.status(404).json({success:false, message:"User not found"})
        }
        res.status(200).json({success:true, bookmarks: user.bookmarks});
    }
    catch(error) {
        console.log('Error fetching user bookmarks:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
}

export async function addRemoveBookMark(req, res) {
    try {
        const userId = req.user.id || req.user._id;
        const postId = req.body.postId;
        if(!postId) {
            return res.status(400).json({success:false, message:"PostId is required"})
        }
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({success:false, message:"User not found"})
        }
        const isBookmarked = user.bookmarks.some(b => b.toString() === postId);
        if(isBookmarked) {
            user.bookmarks = user.bookmarks.filter(b => b.toString() !== postId);
            await user.save();
            return res.status(200).json({success:true, type:"Remove", message:"Removed bookmark successfully"})
        }
        else {
            user.bookmarks.push(postId);
            await user.save();
            return res.status(200).json({success:true, type:"Add", message:"Added bookmark successfully"})
        }
    }
    catch(error) {
        console.log('Error adding bookmark:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
}