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
  const { userId, otherUserId } = req.query;

  const messages = await Message.find({
    $or: [
      { sender: userId, receiver: otherUserId },
      { sender: otherUserId, receiver: userId },
    ],
  });

  res.send(messages);
};
