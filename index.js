// входной файл всего сервера
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
import authRoute from "./routes/auth.js";
import postRoute from "./routes/posts.js";
import commentRoute from "./routes/comments.js"


const app = express();

// для хранения данных пароля mongodb
dotenv.config();
// Constants env
const PORT = process.env.PORT || 3001;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

// Middleware- функ.или расширяет или дополняет базовые настройки express
app.use(cors());
// функ для принятия данных с фронта в формате json
app.use(express.json());
// для загрузки файлов на сервер
app.use(fileUpload());
// для того чтобы express понимал где лежат статические файлы
app.use(express.static("uploads"));

// Routes
// при запросе на такой адресс будут отрабатывать все роуты которые я описываю в auth.js
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);

async function start() {
  try {
    await mongoose.connect(
      `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.0l6xelo.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
    );
    app.listen(PORT, () => console.log(`server stated on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
}
start();
