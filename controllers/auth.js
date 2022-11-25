// описание всей логики для user
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register user
export const register = async (req, res) => {
  try {
    // получаю данные с фронта
    const { username, password } = req.body;
    // ищу такого пользователя в базе данных
    const isUser = await User.findOne({ username });
    // если такой уже есть пишу сообщение
    if (isUser) {
      return res.status(402).json({
        message: "Данный username уже занят",
      });
    }
    // шифрую пароль genSaltSync-типо сложность хеширования пароля
    const salt = bcrypt.genSaltSync(10);
    // хеширую пароль сложность salt
    const hash = bcrypt.hashSync(password, salt);
    // новый user экземпляра модели user схемы
    const newUser = new User({
      username,
      password: hash,
    });

    const token = jwt.sign(
      {
        id: newUser._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // сохраняю нового пользователя в базу данных
    await newUser.save();

    // ответ -возвращаю нового user во фронт для отабражения пользователю
    res.json({
      newUser,
      message: "Регистрация прошла успешно",
    });
  } catch (error) {
    res.json({
      message: "Ошибка при создании пользователя",
    });
  }
};
// Login user
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({
        message: "Такого юзера не существует",
      });
    }
    // сравниваю обычный пароль с хешириванным (compare)
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.json({
        message: "Неверный пароль",
      });
    }
    // с помощью jwt определяю зашли в систему или нет
    // токен это мой цифровой клю
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    res.json({
      token,
      user,
      message: "Вы вошли в систему",
    });
  } catch (error) {
    res.json({
      message: "Ошибка при авторизации",
    });
  }
};
// Get me
// Этот роут будет отрабатывать всегда при обнавлении страницы-для того чтобы не вводить каждый раз данные
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.json({
        message: "Такого пользователя не существует",
      });
    }
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    res.json({
      user,
      token,
    });
  } catch (error) {
    res.json({
      message: "Нет доступа",
    });
  }
};
