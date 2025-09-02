import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username : { type: String, required: true },
    email : { type: String, required: true, unique: true },
    password : { type: String, required: true},
    isAdmin : { type: Boolean, default: false },
    avatar : { type: String, default: `https://ui-avatars.com/api/?name=${encodeURIComponent("User")}&background=random` }
})

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;