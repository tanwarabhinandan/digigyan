import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
// import createHttpError from "http-errors";

const app = express();

// Routs - GET, POST, PATCH, DELETE

app.get("/", (req, res, next) => {
  // To cheak error stack and global error middleware
  //   const error = createHttpError(400, "Something went worng");
  //   throw error;
  res.json({ Massege: "Welcome to Digibook Web App..!!!" });
});

//Global Error Handeler

app.use(globalErrorHandler);

export default app;
