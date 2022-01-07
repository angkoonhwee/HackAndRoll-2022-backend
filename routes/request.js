const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const Buddy = require("../models/buddy");
const Request = require("../models/request");
const User = require("../models/user");
const Chat = require("../models/chat");

const STATUS_TYPES = {
    pending: "Pending",
    accepted: "Accepted",
    rejected: "Rejected"
}

router.post('/', async (req, res) => {
    const { sender, receiver } = req.body;

    try {
        const user = await User.findById(sender);
        const recipient = await User.findById(receiver);
        if (recipient.currentBuddy) {
            return res.status(400).json("User already has a buddy!")
        }
        const request = new Request({
            sender: user,
            receiver: recipient
        });

        let savedReq = await request.save();

        await user.updateOne({
            $set: { myRequest: savedReq }
        });

        await recipient.updateOne({
            $push: { pendingRequests: savedReq }
        });

        savedReq = await Request.findById(savedReq._id)
                .populate("sender", "username")
                .populate("receiver", "username")
        res.status(200).json(savedReq);
    } catch (err) {
        console.log(err);
        return res.status(500).json("Server error");
    }
});

router.post("/:requestId/accept", async (req, res) => {
    const { requestId } = req.params;

    try {
        let request = await Request.findById(requestId);
        await request.updateOne({
            $set: { status: STATUS_TYPES.accepted }
        });

        const userOne = await User.findById(request.sender);
        const userTwo = await User.findById(request.receiver);

        const newChat = new Chat({
            buddyId: [userOne._id, userTwo._id]
        });
        const savedChat = await newChat.save();

        const budOne = new Buddy({
            user: userOne,
            buddy: userTwo,
            chatId: savedChat._id
        });

        const buddyOne = await budOne.save();
        await userOne.updateOne({
            $set: { currentBuddy: buddyOne._id }
        });

        const budTwo = new Buddy({
            user: userTwo,
            buddy: userOne,
            chatId: savedChat._id
        });
        const buddyTwo = await budTwo.save();
        await userTwo.updateOne({
            $set: { currentBuddy: buddyTwo._id }
        });

        async function rejectAll(array) {
            for (let i = 0; i < array.length; i++) {
                const reject = array[i];
                if (reject._id.toString() != requestId) {
                    const temp = await Request.findById(reject);
                    await temp.updateOne({
                        $set: { status: STATUS_TYPES.rejected }
                    });
                }
            }
        }

        await rejectAll(userOne.pendingRequests);
        await rejectAll(userTwo.pendingRequests);
        await userOne.updateOne({
            $set: { pendingRequests: [] }
        });
        await userTwo.updateOne({
            $set: { pendingRequests: [] }
        });
        request = await Request.findById(requestId)
                               .populate("sender", "username")
                               .populate("receiver", "username");
        
        res.status(200).json(request);
    } catch (err) {
        console.log(err);
        return res.status(500).json("Server error");
    }
})

//@route   PUT /request/:requestId/reject
//@desc    reject request and filter out user in requestedBy array
//access   Private
router.put("/:requestId/reject", async (req, res) => {
    const { requestId } = req.params;

    try {
        let request = await Request.findById(requestId);
        await request.updateOne({
            $set: { status: STATUS_TYPES.rejected }
        });
        const to = await User.findById(request.receiver);
        const updated = to.pendingRequests.filter(r => r._id.toString() !== requestId);
        await to.updateOne({
            $set: { pendingRequests: updated }
        });

        request = await Request.findById(requestId)
                               .populate("sender", "username")
                               .populate("receiver", "username");
        
        res.status(200).json(request);
    } catch (err) {
        console.log(err);
        return res.status(500).json("Server error");
    }
});

module.exports = router;
