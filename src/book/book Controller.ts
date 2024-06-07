import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  // req.files - Uploaded Files Details
  console.log("Uploaded Files Info: ", req.files);

  // to get file information from req obj
  const files = req.files as { [fileName: string]: Express.Multer.File[] };

  // For Image Upload
  try {
    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    const imageFileName = files.coverImage[0].filename;
    const filePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      imageFileName
    );
    console.log(imageFileName);
    // cloudinary File upload
    const imageFileUploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: imageFileName,
      folder: "book-covers",
      format: coverImageMimeType,
    });
    console.log("Image Upload Result: ", imageFileUploadResult);
  } catch (err) {
    console.log(err);
    return createHttpError(500, "Error while uploading the file")
  }

  //For Book Upload
  try {
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
  } catch (err) {
    console.log(err);
    return createHttpError(500, "Error while uploading the file")
  }

  res.json({
    message: "File uploaded successfully on cloudinary",
  });
};

export { createBook };
