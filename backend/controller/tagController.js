import tagModel from "../models/tagModel";

export async function createTag(req, res) {
    try {
        const {name, slug} = req.body;
        if(!name || !slug) {
            res.status(400).json({success: false, message: "Name and slug are required"});
        }
        const existingTag = await tagModel.findOne({$or: [{name}, {slug}]});
        if(existingTag) {
            return res.status(400).json({success: false, message: "Tag with this name or slug already exists"});
        }
        const tag = new tagModel({
            name, 
            slug,
        })
        const saved = await tag.save();
        res.status(201).json({success:true, tag: saved});
    }
    catch(error) {
        console.error('Error creating tag:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
}

export async function getAllTags(req, res) {
    try {
        const tags = await tagModel.find().sort({createAt: -1});
        if(tags.length === 0) {
            return res.status(200).json({success: true, tags:[],  message: 'No tags found'});
        }
        res.status(200).json({success: true, tags});
    }
    catch(error) {
        console.error('Error fetching tags:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
}

export async function getTagById(req, res) {
    try {
        const tag = await tagModel.findById(req.params.tagId);
        if(!tag) {
            return res.status(404).json({success: false, message: 'Tag not found'});
        }
        res.status(200).json({success: true, tag});
    }
    catch(error) {
        console.error('Error fetching tag:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
}

export async function updateTag(req, res) {
    try {
        const tagId = req.params.tagId; 
        const {name, slug} = req.body; 
        const updateTag = await tagModel.findByIdAndUpdate(
            tagId, {name, slug}, {new: true, runValidators: true}
        )
    }
    catch(error) {
        console.error('Error updating tag:', error)
        res.status(500).json({success: false, message: 'Server error'});
    }
}

export async function deleteTag(req, res) {
    try {
        const tagId = req.params.tagId;
        const tag = await tagModel.findByIdAndDelete(tagId);
        if(!tag) {
            return res.status(404).json({success: false, message: 'Tag not found'});
        }
        res.status(200).json({success: true, message: 'Tag deleted successfully'});
    }
    catch(error) {
        console.error('Error deleting tag:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
}