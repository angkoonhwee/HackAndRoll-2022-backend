const express = require("express");
const router = express.Router();
const User = require("../models/user");

const COMPLETION_STATUS = {
    completed: "Completed",
    incomplete: "Incomplete"
}

//@route   GET todos/:userId
//@desc    get all user's todos
//access   Private
router.get("/:userId", async (req, res) => {
    const userId = req.params.userId;

    try {
        let user = await User.findById(userId);
        res.status(200).json(user.todos);
    } catch (err) {
        console.log(err);
        res.status(500).json("Server error");
    }
});

// @route   POST todos/:userId/add
// @desc    add a task to todo list
// access   Private
router.post("/:userId/add", async (req, res) => {
    const userId = req.params.userId;
    
    try {
        let user = await User.findById(userId);
        const newTodo = req.body;

        await user.updateOne({ $push: { todos: newTodo }});

        user = await User.findById(userId);
        res.status(200).json(user.todos);
    } catch (err) {
        console.log(err);
        res.status(500).json("Server error");
    }
});

//@route   DELETE todos/:todoId/delete
//@desc    delete a particular todo
//access   Private
router.delete('/:todoId/delete', async (req, res) => {
    const todoId = req.params.todoId;
    const userId = req.body.userId;

    try {
        var user = await User.findById(userId);
        await user.updateOne({ $pull: {todos: { _id: todoId }}});
        user = await User.findById(userId);

        res.status(200).json(user.todos);
    } catch (err) {
        console.log(err);
        return res.status(500).json('Server Error')
    }
});

//@route   PUT todos/:todoId/toggle
//@desc    toggle a particular todo to complete or incomplete
//access   Private
router.put("/:todoId/toggle", async (req, res) => {
    const todoId = req.params.todoId;
    const userId = req.body.userId;

    try {
        let user = await User.findById(userId);
        console.log(user);
        let toggledList = user.todos.map(t => {
            if (t._id == todoId) {
                if (t.status == COMPLETION_STATUS.incomplete) {
                    t.status = COMPLETION_STATUS.completed;
                } else {
                    t.status = COMPLETION_STATUS.incomplete;
                }
            }
        });

        await User.updateOne(
            { _id: userId },
            { $set: { todos: user.todos } }
        );

        res.status(200).json(user.todos);
    } catch (err) {
        console.log(err);
        return res.status(500).json('Server Error')
    }
})

module.exports = router;