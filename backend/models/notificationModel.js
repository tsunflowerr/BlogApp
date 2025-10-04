import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    postId : { type: mongoose.Schema.Types.ObjectId, ref: "post", default: null },
    author :{type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    user :{type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    type   : { type: String, enum: ["like", "comment", "milestone", "follow"], required: true },
    content : {type: String, required: true},
    createAt: {type: Date, default: Date.now},
    isRead: {type: Boolean, default: false}
})

const notificationModal = mongoose.models.comment || mongoose.model("notification", notificationSchema);

export default notificationModal;