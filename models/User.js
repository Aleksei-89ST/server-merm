import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  posts: [
    {
      //это ссылка на отдельную схему posts
      type: mongoose.Schema.Types.ObjectId,
      // для понимания на какую схему ссылка
      ref: "Post",
    },
  ],
},
// для того чтобы видеть историю создания поста 
{timestamps:true},
);

export default mongoose.model("User",UserSchema);
