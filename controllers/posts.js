import Post from "../models/Post.js";
import User from "../models/User.js";
import path, {dirname} from "path";
import { fileURLToPath } from "url";

// Create Post
export const createPosts = async (req, res) => {
  try {
    // такие поля будут в форме при создании поста
    const { text, title } = req.body;
    const user = await User.findById(req.userId);

// формирование просто изображения
    if(req.files) {
// формирую имя той картинки которая будет помещаться в папку uploads
let fileName = Date.now().toString() + req.files.image.name
// получаю доступ к текущей папке
const __dirname = dirname(fileURLToPath(import.meta.url))
// перемещаю картинку в uploads под именем каторым сформировал выше
req.files.image.mv(path.join(__dirname,"..","uploads",fileName))

// формирование поста  с Изображением
const newPostWithImage = new Post ({
username:user.username,
title,
text,
imgUrl:fileName,
author:req.userId
})
// если все хорошо то..
await newPostWithImage.save()
await User.findByIdAndUpdate(req.userId), {
    $push: {posts: newPostWithImage},
}
return res.json(newPostWithImage)
    }
// формирование поста без Изображения
const newPostWithoutImage = new Post({
    username:user.username,
    title,
    text,
    imgUrl:"",
    author:req.userId,
})
await newPostWithoutImage.save()
await User.findByIdAndUpdate(req.userId), {
    $push: {posts: newPostWithoutImage},
}
res.json(newPostWithoutImage)
  } catch (error) {
    res.json ({message:"Что-то пошло не так" })
  }
};
