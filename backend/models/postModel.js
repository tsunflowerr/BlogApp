import mongoose, { mongo } from "mongoose";

const postSchema = new mongoose.Schema({
    title : { type: String, required: true },
    content : {type: String, required: true },
    author :{type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref:"tag" }],
    category: [{ type: mongoose.Schema.Types.ObjectId, ref:"category" }],
    thumbnail: { type: String  },
    likes : [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    likeCount : { type: Number, default: 0 },
    view : { type: Number, default: 0 },
    createAt: { type: Date, default: Date.now},
    updateAt: { type: Date, default: Date.now},
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }]
})

const postModel = mongoose.models.post || mongoose.model("post", postSchema);

export default postModel;