import mongoose from "mongoose";


export const connectDB = async () => {
    await mongoose.connect(`${process.env.Mongodb}`).then(() => {
        console.log("Connected to MongoDB");
    })
}