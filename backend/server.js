import express from "express";
import cors from "cors";
import {connectDB} from "./config/db.js";
import postRouter from "./routes/postRoute.js";
import userRouter from "./routes/userRoute.js";
import commentRouter from "./routes/commentRoute.js";
import categoryRouter from "./routes/categoryRoute.js";
import tagRouter from "./routes/tagRoute.js";
import notificationRoute from "./routes/notificationRoute.js"
import searchRouter from "./routes/searchRoute.js"
import dotenv from "dotenv";
import { swaggerUi, swaggerSpec } from './swagger.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

connectDB();

app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);
app.use("/api", commentRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/tags", tagRouter);
app.use("/api/notification", notificationRoute)
app.use("/api/search", searchRouter)

app.get("/", (req, res) => {
    res.send("Welcome to the Blog API");
    }
);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

