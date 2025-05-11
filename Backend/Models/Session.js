const mongoose = require("mongoose");
const User = require("./User");
const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      requied: true,
    },
    token: {
      type: String,
      requied: true,
    },
    expiresAt: {
      type: Date,
      requied: true,
    },
  },
  {
    strict: true,
    timestamps: true,
  }
);

module.exports = mongoose.model("Session", sessionSchema);
