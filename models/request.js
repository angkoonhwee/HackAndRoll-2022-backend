const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    status: {
        type: String,
        default: "Pending",
        required: true
    },
    sender: {
        type: mongoose.Types.ObjectId,
        default: null,
        required: true, 
        ref: "User"
    },
    receiver: {
        type: mongoose.Types.ObjectId,
        default: null,
        required: true,
        ref: "User"
    }
});

const Request = new mongoose.model("Request", requestSchema);

module.exports = Request;
