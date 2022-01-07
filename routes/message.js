const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const Chat = require('../models/chat');

//@route   POST /message/:chatId
//@desc    send a message
//access   Private
router.post("/:chatId", async (req, res) => {
    const desc = req.body.text;
    const sender = req.body.sender;
    const receiver = req.body.receiver;
    const chatId = req.params.chatId;

    try {
        const chat = await Chat.findById(chatId);
        const newMessage = new Message({
            sender: sender,
            receiver: receiver,
            text: desc 
        });
        const savedMessage = await newMessage.save();
        await chat.updateOne({ $push: { messages: savedMessage }});
        res.status(200).json(savedMessage);
    } catch (err) {
        console.log(err);
        res.status(500).json("Server error");
    }
});

module.exports = router;
