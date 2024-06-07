import express from "express";
import { createBook } from "./book Controller";

const bookRouter = express.Router();

//Routes

bookRouter.post("/", createBook);

export default bookRouter;
