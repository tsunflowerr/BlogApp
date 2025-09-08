import Post from '../models/postModel.js';
import Category from '../models/categoryModel.js';
import Tag from '../models/tagModel.js';

export async function createPost(req, res) {
    try {
        const { title, content, tags, category, thumbnail } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Title and content are required'
            });
        }

        const post = new Post({
            title,
            content,
            author: req.user._id,
            tags: tags || [],
            category: category || [],
            thumbnail: thumbnail || ''
        });

        let saved = await post.save();
        saved = await saved.populate('author', 'username email avatar');
        saved = await saved.populate('tags', 'name slug');
        saved = await saved.populate('category', 'name slug');

        res.status(201).json({
            success: true,
            post: saved
        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}


export async function getAllPosts(req, res) {
    try {
        const {category, tag} = req.query;
        let filter = {};    
        if(category) filter.category = category;
        if(tag) filter.tags = tag;
        const posts = await Post.find().populate('author', 'username email avatar ').populate('category', 'name slug').populate('tags', 'name slug').sort({createAt: -1});
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
        const posts = await Post.find({author: userId}).populate('author', 'username email avatar').populate('tags', 'name slug').populate('category', 'name slug').sort({createAt: -1});
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
        const post = await Post.findOne({ _id: req.params.postId }).populate('author', 'username email avatar').populate('category', 'name slug').populate('tags', 'name slug');
        if(!post) {
            return res.status(404).json({success: false, message: 'Post not found'});
        }
        const viewerIp = req.ip;
        const now = new Date();
        const lastView = post.recentViews.find(v => v.ip === viewerIp)
        if(!lastView || (now - lastView.lastView) > 1000 * 60 * 60) {
            post.view = (post.view || 0) + 1
            if(lastView) {
                lastView.lastView = now
            } 
            else {
                post.recentViews.push({ip: viewerIp, lastView: now})
            }
            await post.save();
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
        }, data, {new: true, runValidators: true}).populate('category', 'name slug').populate('tags', 'name slug').populate('author', 'username avatar');
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

export async function getPostByCategorySlug(req, res) {
    try {
        const slug = req.params.slug;
        const category = await Category.findOne({slug});
        if(!category) {
            return res.status(404).json({success: false, message: 'Category not found'});
        }
        const posts = await Post.find({category: category._id}).populate('author', 'username email avatar').populate('category', 'name slug').populate('tags', 'name slug').sort({createdAt: -1});
        if(!posts || posts.length === 0) {
            return res.status(404).json({success: false, message: 'No posts found for this category'});
        }
        res.status(200).json({success: true, posts});
    }
    catch(error) {
        console.error('Error fetching posts by category slug:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
}

export async function getPostByTagSlug(req, res) {
    try {
        const slug = req.params.slug;
        const tag = await Tag.findOne({slug});
        if(!tag) {
            return res.status(404).json({success: false, message: 'tag not found'});
        }
        const posts = await Post.find({tags: tag._id}).populate('author', 'username avatar email').populate('category', 'name slug').populate('tags', 'name slug').sort({createdAt: -1});
        if(!posts || posts.length === 0) {
            return res.status(404).json({success: false, message: 'No posts found for this tag'});
        }
        res.status(200).json({success: true, posts});
    }
    catch(error) {
        console.error('Error fetching posts by tag slug:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
}

export async function likePost(req, res) {
    try {
        const postId = req.params.postId;
        const userId = req.user?._id;
        if(!userId) {
            return res.status(401).json({success: false, message: 'Unauthorized'});
        }
        const post = await Post.findById(postId);
        if(!post) {
            return res.status(404).json({success: false, message: 'Post not found'});
        }
        if(post.likes.includes(userId)) {
            post.likes.pull(userId);
            post.likeCount = (post.likeCount || 0) - 1;
            await post.save();
            return res.status(200).json({success: true, message: 'Post unliked', _id:postId, likes: post.likes, likeCount: post.likeCount});
        } else {
            post.likes.push(userId);
            post.likeCount = (post.likeCount || 0) + 1;
            await post.save();
            return res.status(200).json({success: true, message: 'Post liked', _id:postId, likes: post.likes, likeCount: post.likeCount});
        }
    }
    catch(error) {
        console.error('Error liking/unliking post:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
}

export const getPostCountByCategory = async (req, res) => {
  try {
    const result = await Post.aggregate([
      { $unwind: "$category" }, 
      {
        $group: {
          _id: "$category",
          totalPosts: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryInfo"
        }
      },
      { $unwind: "$categoryInfo" },
      {
        $project: {
          _id: 0,
          categoryId: "$categoryInfo._id",
          name: "$categoryInfo.name",
          slug: "$categoryInfo.slug",
          totalPosts: 1
        }
      },
      { $sort: { totalPosts: -1 } },
      { $limit: 5 }
    ]);

    if (!result || result.length === 0) {
      return res.status(404).json({ success: false, message: "No categories found" });
    }

    res.status(200).json({ success: true, categories: result });
  } catch (error) {
    console.error("Error fetching category stats:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
