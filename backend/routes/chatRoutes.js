import express from "express";
import Chat from "../models/Chat.js";
import authMiddleware from "../middleware/authMiddleware.js";



const router = express.Router();


// ============================
// GET ALL CHATS OF LOGGED-IN USER
// ============================
router.get("/", authMiddleware, async (req, res) => {
  try {

    const chats = await Chat.find({
      participants: req.user.id,
    })
      .populate("participants", "name email")
      .sort({ updatedAt: -1 });

    res.json(chats);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});


// ============================
// START CHAT
// ============================
router.post("/start/:sellerId", authMiddleware, async (req, res) => {

  try {

    const buyerId = req.user.id;
    const sellerId = req.params.sellerId;

    let chat = await Chat.findOne({
      participants: {
        $all: [buyerId, sellerId],
      },
    });

    if (!chat) {

      chat = await Chat.create({
        participants: [buyerId, sellerId],
        messages: [],
      });

    }

    res.json(chat);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });

  }

});


// ============================
// GET SINGLE CHAT
// ============================
router.get("/:chatId", authMiddleware, async (req, res) => {
  try {
    console.log("GET CHAT:", req.params.chatId);

    const chat = await Chat.findById(req.params.chatId)
      .populate("participants", "name email")
      .populate("messages.sender", "name");

    console.log("FOUND CHAT:", chat);

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    res.json(chat);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
});


// ============================
// SEND MESSAGE
// ============================
router.post("/:chatId", authMiddleware, async (req, res) => {

  try {

    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {

      return res.status(404).json({
        message: "Chat not found",
      });

    }

    chat.messages.push({
      sender: req.user.id,
      text: req.body.text,
    });

    await chat.save();

    res.json(chat);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });

  }

});

export default router;