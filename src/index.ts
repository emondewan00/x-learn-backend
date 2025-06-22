import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/connectDB";
dotenv.config();

const app = express();

connectDB();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

export default app;
