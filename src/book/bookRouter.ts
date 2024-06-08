import express from "express";
import {
  createBook,
  deleteSingleBook,
  listBooks,
  GetSingleBook,
  updateBook,
} from "./book Controller";
import multer from "multer";
import path from "node:path";
import authenticate from "../middlewares/authenticate";

const bookRouter = express.Router();

// Setting up multer for multi part data - file upload - book cover and book image

const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 1e7 }, // 1e7 - 10 MB (Cloudinary file upload restriction)
});

//Routes

bookRouter.post(
  "/",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);

bookRouter.patch(
  "/:bookId",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateBook
);

bookRouter.get("/", listBooks);

bookRouter.get("/:bookId", GetSingleBook);

bookRouter.delete("/:bookId", authenticate, deleteSingleBook);

export default bookRouter;
