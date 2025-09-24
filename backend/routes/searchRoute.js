import express from "express";
import { searchPosts } from "../controller/searchController.js";
const searchRouter = express.Router();

searchRouter.get('/',searchPosts);

export default searchRouter;

