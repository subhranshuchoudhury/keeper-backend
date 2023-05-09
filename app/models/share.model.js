const mongoose = require("mongoose");

const Share = mongoose.model(
  "Share",
  new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Number, required: true },
    creator: { type: String, required: true },
    sharedon: { type: Number, required: true },
  })
);

module.exports = Share;
