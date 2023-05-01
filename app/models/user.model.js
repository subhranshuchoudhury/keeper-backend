const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    recentotp: String,
    keeps: [
      {
        title: String,
        content: String,
        timestamp: Number,
        chats: [
          {
            timestamp: Number,
            sender_username: String,
          },
        ],
        engagement: [
          {
            email: String,
            reaction: Number,
          },
        ],
      },
    ],
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
  })
);

module.exports = User;
