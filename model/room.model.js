const mongoose = require("mongoose");
const roomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    roomType: {
      type: String,
    },
    price: {
      type: Number,
    },
    maxGuests: { type: Number },
    amenities: [
      {
        type: String,
      },
    ],
    roomImage: { type: String },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
module.exports = mongoose.model("Room", roomSchema);
