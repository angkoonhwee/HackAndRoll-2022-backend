
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
      sender: {
        type: String,
        required: true
      },
      receiver: {
        type: String,
        required: true
      },
      text: {
        type: String,
        required: true
      },
    },
    { timestamps: true }
);

const Message = new mongoose.model("Message", messageSchema);

module.exports = Message;