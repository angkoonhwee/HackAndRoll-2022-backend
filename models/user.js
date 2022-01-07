const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true
        },
        password: {
            type: String,
            required: true,
            min: 6
        },
        profilePicture: {
            type: String,
            default: ""
        },
        bio: String,
        education: { 
            school: String,
            major: String,
            yearOfStudy: Number,
            currentModules: [String],
        },
        social: {
            instagram: String,
            github: String,
            linkedIn: String,
        },
        currentBuddy: {
            type: String,
            default: ""
        },
        myRequest: {
            type: mongoose.Types.ObjectId,
            default: null
        },
        pendingRequests: {
            type: Array,
            default: []
        },
    },
    { timestamps: true }
);

userSchema.plugin(findOrCreate);
const User = new mongoose.model("User", userSchema);

module.exports = User;
