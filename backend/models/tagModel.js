import mongoose, { mongo } from "mongoose";

const tagSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    createAt: { type: Date, default: Date.now},
})

const tagModel = mongoose.models.tag || mongoose.model("tag", tagSchema);   
export default tagModel;