import Post from "../models/Post.js";
import User from "../models/User.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

// Create Post
export const createPost = async (req, res) => {
  try {
    // такие поля будут в форме при создании поста
    const { text, title } = req.body;
    const user = await User.findById(req.userId);

    // формирование просто изображения
    if (req.files) {
      // формирую имя той картинки которая будет помещаться в папку uploads
      let fileName = Date.now().toString() + req.files.image.name;
      // получаю доступ к текущей папке
      const __dirname = dirname(fileURLToPath(import.meta.url));
      // перемещаю картинку в uploads под именем каторым сформировал выше
      req.files.image.mv(path.join(__dirname, "..", "uploads", fileName));

      // формирование поста  с Изображением
      const newPostWithImage = new Post({
        username: user.username,
        title,
        text,
        imgUrl: fileName,
        author: req.userId,
      });
      // если все хорошо то..
      await newPostWithImage.save();
      await User.findByIdAndUpdate(req.userId),
        {
          $push: { posts: newPostWithImage },
        };
      return res.json(newPostWithImage);
    }
    // формирование поста без Изображения
    const newPostWithoutImage = new Post({
      username: user.username,
      title,
      text,
      imgUrl: "",
      author: req.userId,
    });
    await newPostWithoutImage.save();
    await User.findByIdAndUpdate(req.userId),
      {
        $push: { posts: newPostWithoutImage },
      };
    res.json(newPostWithoutImage);
  } catch (error) {
    res.json({ message: "Что-то пошло не так" });
  }
};

// Get All Posts
export const getAll = async (req, res) => {
  try {
    // нахожу все посты и формирую их по дате создания
    const posts = await Post.find().sort("-createdAt");
    // нахожу все популярные посты делаю лимит 5 и формирую их по просмотрам
    const popularPosts = await Post.find().limit(5).sort("-views");
    if (!posts) {
      return res.json({ message: "Постов нет" });
    }
    res.json({ posts, popularPosts });
  } catch (error) {
    res.json({ message: "Что-то пошло не так" });
  }
};

// Get Posts getById
export const getById = async (req, res) => {
  try {
    // нашёл пост по id и при каждом просмотре поста увеличиваю его на 1 просмотр
    const post = await Post.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    return res.json(post);
  } catch (error) {
    res.json({ message: "Что-то пошло не так" });
  }
};

// Get MY Posts
export const getMyPosts = async (req, res) => {
  try {
    // нахожу пользователя в запросе
    const user = await User.findById(req.userId);
    // получаю инфо о каждом из постов конкретного пользователя- которые лежет в массиве в user базе данных
    const list = await Promise.all(
      user.posts.map((post) => {
        return Post.findById(post._id);
      })
    );
    res.json(list);
  } catch (error) {
    res.json({ message: "Что-то пошло не так" });
  }
};
