const express = require('express');
const router = express.Router();
const Chat = require('../models/chat');

//@route   GET chat/:chatId
//@desc    get all chat messages
//access   Private
router.get("/:chatId", async (req, res) => {
    const chatId = req.params.chatId;

    try {
        const chat = await Chat.findById(chatId);
        res.status(200).json(chat);
    } catch (err) {
        console.log(err);
        res.status(500).json("Server error");
    }
});

module.exports = router;