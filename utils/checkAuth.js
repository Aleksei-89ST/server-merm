import jwt from "jsonwebtoken";

// это Middleware который проверяет токен 
export const checkAuth = (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

  if (token) {
    try {
      // тут расшифровываю token который шифровал в JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // вшиваю token userID,тоесть при отправке запроса буду уже залогинен
      req.userId = decoded.id;
      next();
    } catch (error) {
      return res.json({
        message: "Нет доступа",
      });
    }
  } else {
    return res.json({
      message: "Нет доступа",
    });
  }
};
