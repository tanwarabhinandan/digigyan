import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from "node:fs";
import { Authrequest } from "../middlewares/authenticate";

// Create Book
const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre, description } = req.body;

  // req.files - Uploaded Files Details
  //   console.log("Uploaded Files Info: ", req.files);

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
    // console.log(imageFileName);
    // cloudinary Image File upload
    const imageFileUploadResult = await cloudinary.uploader.upload(
      imageFilePath,
      {
        filename_override: imageFileName,
        folder: "book-covers",
        format: coverImageMimeType,
      }
    );
    // console.log("Image Upload Result: ", imageFileUploadResult);

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
    // console.log("Book Upload Result: ", bookFileUploadResult);
    // //@ts-ignore
    // console.log("userId", req.userId);

    const _req = req as Authrequest;
    //Creating new Book in Database
    const newBook = await bookModel.create({
      title,
      genre,
      description,
      author: _req.userId,
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
    res.status(201).json({
      message: "File uploaded successfully on cloudinary",
      "Book Name": newBook.title,
      ID: newBook._id,
    });
  } catch (err) {
    console.log(err);
    return createHttpError(500, "Error while uploading the file");
  }
};

// Book Update
const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  const bookId = req.params.bookId;

  const book = await bookModel.findOne({ _id: bookId });

  if (!book) {
    return next(createHttpError(404, "Book Not Found"));
  }

  // Check Access
  const _req = req as Authrequest;
  if (book.author.toString() !== _req.userId) {
    return next(createHttpError(404, "Not authorized for Update"));
  }

  // to check - image and pdf (new / updated)

  // to get file information from req obj
  const files = req.files as { [fileName: string]: Express.Multer.File[] };

  // to check Image file is already exist
  let completeCoverImage = "";
  if (files.coverImage) {
    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    const imageFileName = files.coverImage[0].filename;
    const imageFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      imageFileName
    );

    completeCoverImage = imageFileName;

    // cloudinary Image File upload
    const imageFileUploadResult = await cloudinary.uploader.upload(
      imageFilePath,
      {
        filename_override: imageFileName,
        folder: "book-covers",
        format: coverImageMimeType,
      }
    );

    completeCoverImage = imageFileUploadResult.secure_url;
    await fs.promises.unlink(imageFilePath);
  }

  // to check PDF file is already exist
  let completeFile = "";
  if (files.file) {
    const bookMimeType = files.file[0].mimetype.split("/").at(-1);
    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFileName
    );

    const bookFile = bookFileName;
    completeFile = bookFile;

    // Cloudinary PDF file upload
    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book-pdfs",
        format: bookMimeType,
      }
    );

    completeFile = bookFileUploadResult.secure_url;
    await fs.promises.unlink(bookFilePath);
  }

  // to update book record in Database
  const updatedBook = await bookModel.findOneAndUpdate(
    {
      _id: bookId,
    },
    {
      title: title,
      genre: genre,
      coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
      file: completeFile ? completeFile : book.file,
    },
    {
      new: true,
    }
  );

  res.json({
    message: "Book Updated",
    updatedBook,
  });
};

// List books
const listBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //todo: add pagination
    const books = await bookModel.find().populate("author", "name");

    res.json({ books });
  } catch (err) {
    return next(createHttpError(500, "Error fetching books"));
  }
};

// list single book
const GetSingleBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bookId = req.params.bookId;
  try {
    const book = await bookModel
      .findById({
        _id: bookId,
      })
      .populate("author", "name");
    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    return res.json({ book });
  } catch (err) {
    return next(createHttpError(500, "Error while fetching book"));
  }
};

// Delete single book
const deleteSingleBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bookId = req.params.bookId;
  try {
    const book = await bookModel.findById({
      _id: bookId,
    });
    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    // Check Access
    const _req = req as Authrequest;
    if (book.author.toString() !== _req.userId) {
      return next(createHttpError(404, "Not authorized for Update"));
    }

    const bookCoverImageSplit = book.coverImage.split("/");
    const imagePublicId =
      bookCoverImageSplit.at(-2) +
      "/" +
      bookCoverImageSplit.at(-1)?.split(".").at(-2);

    // console.log(bookCoverImageSplit);
    // console.log(imagePublicId);

    const bookFilesplit: string[] = book.file.split("/");
    const filePublicId = ((bookFilesplit.at(-2) as string) +
      "/" +
      bookFilesplit.at(-1)) as string;

    // console.log(filePublicId);

    //deleting files from cloudinary (image and pdf)
    try {
      await cloudinary.uploader.destroy(imagePublicId);
      await cloudinary.uploader.destroy(filePublicId, {
        resource_type: "raw",
      });
    } catch (err) {
      return next(
        createHttpError(500, "Error while deleting image/pdf on storage")
      );
    }

    // delete record fromDatabase
    try {
      await bookModel.deleteOne({
        _id: bookId,
      });
    } catch (err) {
      return next(
        createHttpError(500, "Error while deleting book on Database")
      );
    }

    return res.sendStatus(204);
  } catch (err) {
    return next(createHttpError(500, "Error while fetching book"));
  }
};

export { createBook, updateBook, listBooks, GetSingleBook, deleteSingleBook };
