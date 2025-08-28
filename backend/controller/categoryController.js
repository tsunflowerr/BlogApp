import categoryModel from "../models/categoryModel.js";
import postModel from "../models/postModel.js";

export async function createCategory(req, res) {
    try {
        const {name, slug, description} = req.body;
        if(!name || !slug) {
            return res.status(400).json({success: false, message: "Name and slug are required"});
        }
        const existingCategory = await categoryModel.findOne({$or: [{name}, {slug}]});
        if(existingCategory) {
            return res.status(400).json({success: false, message: "Category with this name or slug already exists"});
        }
        const category = new categoryModel({
            name, 
            slug,
            description: description || '',
        })
        const saved = await category.save();
        res.status(201).json({success:true, category: saved});
    }
    catch(error) {
        console.error('Error creating category:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
}

export async function getAllCategories(req, res) {
    try {
        const categories = await categoryModel.find().sort({createAt: -1});
        if(categories.length === 0) {
            return res.status(200).json({success: true, categories:[],  message: 'No categories found'});
        }
        res.status(200).json({success: true, categories});
    }
    catch(error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
}

export async function getCategoryById(req, res) {
    try {
        const category = await categoryModel.findById(req.params.categoryId);
        if(!category) {
            return res.status(404).json({success: false, message: 'Category not found'});
        }
        res.status(200).json({success: true, category});
    }catch(error) {
        console.error('Error fetching category:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
}

export async function updateCategory(req, res) {
    try {
        const categoryId = req.params.categoryId;
        const {name, slug, description} = req.body;
        const updateCategory = await categoryModel.findByIdAndUpdate(
            categoryId, {name, slug, description}, {new: true, runValidators: true})
    
        if(!updateCategory) {
            return res.status(404).json({success: false, message: 'Category not found'});
        }
        res.status(200).json({success:true, category: updateCategory});
    }
    catch(error) {
        if(error.code === 11000) {
            return res.status(400).json({success: false, message: 'Category with this name or slug already exists'});
        }
        console.error('Error updating category:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
} 

export async function deleteCategory(req, res) {
    try {
        const categoryId = req.params.categoryId;
        const deletedCategory = await categoryModel.findByIdAndDelete(categoryId);
        if(!deletedCategory) {  
            return res.status(404).json({success: false, message: 'Category not found'});
        }
        await postModel.updateMany(
            { category: categoryId },
            { $pull: { category: categoryId }}
        );
        res.status(200).json({success: true, message: 'Category deleted successfully'});
    }
    catch(error) {
        console.error('Error deleting category:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
}