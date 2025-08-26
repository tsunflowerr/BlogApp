import Comment from '../models/Comment.js';

export async function addComment(req, res) {
    try {
        const {postId, content} = req.body;
        if(!postId || !content) {
            return res.status(400).json({success: false, message: 'Post ID and content are required'});
        }
        const comment = new Comment({
            postId,
            content,
            author: req.user._id,
        })
        const saved = await comment.save();
        await saved.populate('author', 'userName email');
        res.status(201).json({success:true, comment:saved})
    }
    catch(error) {
        console.error('Error adding comment:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
}

export async function getCommentsByPost(req, res) {
    try {
        const postId = req.params.postId;
        const comments = await Comment.find({postId}).populate('author', 'userName email').sort({createAt: -1});
        if(!comments) {
            return res.status(404).json({success: false, message: 'No comments found for this post'});
        }
        res.status(200).json({success: true, comments});
    }
    catch(error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
}

export async function updateComment(res, req) {
    try {
        const commentId = req.params.commentId;
        const {content} = req.body; 
        if(!content) {
            return res.status(400).json({success: false, meessage: "Content is required"})
        }
        const comment = await Comment.findOneAndUpdate(
            {_id: commentId, author: req.user._id},content, {new: true, runValidators: true}
        ).populate('author', 'userName email');
        res.status(200).json({success:true, comment});
    }
    catch(error) {
        console.error('Error updating comment:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
}

export async function deleteComment(req, res) {
    try {
        const commentId = req.params.commentId;
        const authorId = Comment.findById(commentId);
        if(authorId.author.toString() !== req.user._id.toString() &&  !req.user.isAdmin) {
            return res.status(403).json({success: false, message: 'You are not authorized to delete this comment'});
        }
        const deleted = await Comment.findByIdAndDelete(commentId);
        if(!deleted) {
            return res.status(404).json({success: false, message: 'Comment not found'});
        }
    }
    catch(error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
}