import mongoose, { mongo } from "mongoose";

const postSchema = new mongoose.Schema({
    title : { type: String, required: true },
    content : {type: String, required: true },
    author :{type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    tags: { type: mongoose.Schema.Types.ObjectId, ref:"tag" },
    category: { type: mongoose.Schema.Types.ObjectId, ref:"category" },
    thumbnail: { type: String  },
    like : { type: Number, default: 0 },
    view : { type: Number, default: 0 },
    createAt: { type: Date, default: Date.now},
    updateAt: { type: Date, default: Date.now}
})

const postModel = mongoose.models.post || mongoose.model("post", postSchema);

export default postModel;