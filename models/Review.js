const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    place: { type: String, required: true },
    review: { type: String, required: true },
    rating: { type: Number, required: true },
    // updatedAt: { type: Date, default: Date.now() },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);
