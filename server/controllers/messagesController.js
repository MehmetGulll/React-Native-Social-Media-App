const Message = require("../models/Message");

exports.sendMessage = async (req, res) => {
  const { sender, receiver, text } = req.body;

  const message = new Message({
    sender,
    receiver,
    text,
  });

  await message.save();

  res.send(message);
};
exports.getMessage = async (req, res) => {
  const { userId, otherUserId, page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalMessages = await Message.countDocuments({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    });

    const hasMore = totalMessages > skip + messages.length;

    res.json({ messages, hasMore });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({message:error})
  }
};
