const mongoose = require("mongoose");

const PosterCounterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  seq: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("PosterCounter", PosterCounterSchema);
