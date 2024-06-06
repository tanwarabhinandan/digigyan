import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";
// import createHttpError from "http-errors";

const app = express();

// Routes - GET, POST, PATCH, DELETE

app.get("/", (req, res, next) => {
  // To cheak error stack and global error middleware
  //   const error = createHttpError(400, "Something went worng");
  //   throw error;
  res.json({ Massege: "Welcome to Digibook Web App..!!!" });
});

// Route

app.use("/api/users", userRouter);

//Global Error Handeler

app.use(globalErrorHandler);

export default app;
