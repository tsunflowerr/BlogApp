import mongoose from "mongoose";

const commentSchema = new mongoose.Sschema({
    postId : { type: mongoose.Schema.Types.ObjectId, ref: "post", required: true },
    author :{type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    content : {type: String, required: true},
    createAt: {type: Date, default: Date.now},
    updateAt: {type: Date, default: Date.now}
})

const commentModel = mongoose.models.comment || mongoose.model("comment", commentSchema);

export default commentModel;