import express from "express";

const app = express();

// Routs - GET, POST, PATCH, DELETE

app.get("/", (req, res, next) => {
  res.json({ Massege: "Welcome to Digibook Web App..!!!" });
});

export default app;
