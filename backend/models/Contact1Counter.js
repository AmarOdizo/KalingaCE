const mongoose = require("mongoose");

const Contact1CounterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },

  seq: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Contact1Counter", Contact1CounterSchema);
