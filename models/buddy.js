const mongoose = require("mongoose");

const buddySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    buddy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Buddy',
        required: true
    },
    daysLeft: {
        type: Number,
        default: 30,
        required: true
    },
    chatId: {
        type: String,
        required: true
    }
}, { timestamps: true }
);

const Buddy = new mongoose.model("Buddy", buddySchema);

module.exports = Buddy;
