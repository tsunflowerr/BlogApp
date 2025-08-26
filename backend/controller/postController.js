import Post from '../models/Post.js';

export async function createPost(req, res) {
    try {
        const {title, content, tags, thumbnail} = req.body;
        if(!title || !content ) {
            return res.status(400).json({success: false, message: 'Title and content are required'});
        }
        const post = new Post({
            title,
            content,
            author: req.user._id,
            tags: tags || [],
            thumbnail: thumbnail || '',
        })
        const saved = await post.save();
        res.status(201).json({success:true, post:saved})
    }
    catch(error) {
        console.error('Error creating post:', error);
        res.status(500).json({success: false, message: 'Server error'});    
    }
}

export async function getAllPosts(req, res) {
    try {
        const posts = await Post.find().populate('author', 'userName email').sort({createAt: -1});
        if(!posts) {
            return res.status(404).json({success: false, message: 'No posts found'});
        }
        res.status(200).json({success: true, posts});
    }
    catch(error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
}

export async function getPostsByUser(req, res) {
    try {
        const userId = req.params.userId;
        const posts = await Post.find({author: userId}).populate('author', 'userName email').sort({createAt: -1});
        if(!posts) {
            return res.status(404).json({success: false, message: 'No posts found for this user'});
        }
        res.status(200).json({success: true, posts});
    }
    catch(error) {
        console.error('Error fetching user posts:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
}

export async function getPostById(req, res) {
    try {
        const post = await Post.findOne({_id: req.params.postId, author: req.user._id}).populate('author', 'userName email');
        if(!post) {
            return res.status(404).json({success: false, message: 'Post not found'});
        }
        res.status(200).json({success: true, post});
    }
    catch(error) {
        console.error('Error fetching post:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
}

export async function updatePost(req, res) {
    try {
        const data = {...req.body, updateAt: Date.now()};
        const updatedPost = await Post.findOneAndUpdate({
            _id: req.params.postId,
            author: req.user._id
        }, data, {new: true, runValidators: true});
        if(!updatedPost)
            return res.status(404).json({success: false, message: 'Post not found or unauthorized'});
        res.status(200).json({success: true, post: updatedPost});
    }
    catch(error) {
        console.error('Error updating post:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
}

export async function deletePost(req, res) {
    try {
        const deletePostId = req.params.postId
        const post = await Post.findById(deletePostId);
        if(!post) {
            return res.status(404).json({success: false, message: 'Post not found'});
        }
        if(post.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({success: false, message: 'Unauthorized'});
        }
        await Post.findByIdAndDelete(deletePostId);
        res.status(200).json({success: true, message: 'Post deleted successfully'});
    }
    catch(error) {
        console.error('Error deleting post:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
}
