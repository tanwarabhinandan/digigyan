import express from "express";
import { createBook } from "./book Controller";
import multer from "multer";
import path from "node:path";

const bookRouter = express.Router();

// Setting up multer for multi part data - file upload - book cover and book image

const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 1e7 }, // 1e7 - 10 MB (Cloudinary file upload restriction)
});

//Routes

bookRouter.post(
  "/",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);

export default bookRouter;
