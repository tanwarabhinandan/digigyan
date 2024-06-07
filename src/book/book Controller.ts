import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from "node:fs";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;

  // req.files - Uploaded Files Details
  console.log("Uploaded Files Info: ", req.files);

  // to get file information from req obj
  const files = req.files as { [fileName: string]: Express.Multer.File[] };

  try {
    // For Image Upload
    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    const imageFileName = files.coverImage[0].filename;
    const imageFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      imageFileName
    );
    console.log(imageFileName);
    // cloudinary File upload
    const imageFileUploadResult = await cloudinary.uploader.upload(
      imageFilePath,
      {
        filename_override: imageFileName,
        folder: "book-covers",
        format: coverImageMimeType,
      }
    );
    console.log("Image Upload Result: ", imageFileUploadResult);

    //For Book Upload
    const bookMimeType = files.file[0].mimetype.split("/").at(-1);
    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFileName
    );

    // Cloudinary file upload
    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book-pdfs",
        format: bookMimeType,
      }
    );
    console.log("Book Upload Result: ", bookFileUploadResult);

    //Creating new Book in Database

    const newBook = await bookModel.create({
      title,
      genre,
      author: "666236b8064c04d267ed5deb",
      coverImage: imageFileUploadResult.secure_url,
      file: bookFileUploadResult.secure_url,
    });

    // Delete Temp file -
    try {
      await fs.promises.unlink(imageFilePath);
      await fs.promises.unlink(bookFilePath);
    } catch (err) {
      console.log(err);
      return createHttpError(500, "Error deleting temp files");
    }

    // Response -
    res.json({
      message: "File uploaded successfully on cloudinary",
    });
  } catch (err) {
    console.log(err);
    return createHttpError(500, "Error while uploading the file");
  }
};

export { createBook };
