
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  buddyId: {
    //buddyId of both user
    type: Array,
    required: true
  },
  messages: {
    type: Array,
    default: [],
    required: true
  }
});

const Chat = new mongoose.model("Chat", chatSchema);

module.exports = Chat;
