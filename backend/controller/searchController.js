import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import Category from "../models/categoryModel.js";
import Tag from "../models/tagModel.js";


export async function searchPosts(req, res) {
    const query = req.query.query || req.query.q || ""; 
    if (!query || query.trim() === "") {
    return res.status(200).json({ success: true, posts: [], users: [], categories: [], tags: [] });
    }
    try {
        const regex = new RegExp(query, 'i'); // 'i' for case-insensitive
        const posts = await Post.find({$or: [{title: regex}, {content: regex}]}).populate('author', 'username avatar').populate('category', 'name slug des').populate('tags', 'name slug').sort({createAt: -1});
        const users = await User.find({username: regex}).select('username avatar email followers followings');
        const categories = await Category.find({name: regex}).select('name slug description');
        const tags = await Tag.find({name: regex}).select('name slug');
        res.status(200).json({success: true, posts, users, categories, tags});
    } catch(err) {
        console.error('Error during search:', err);
        res.status(500).json({success: false, message: "Server error"});
    }

}
