const Message = require("../models/Message");

exports.sendMessage = async (req, res) => {
  const message = new Message(req.body);
  await message.save();
  res.send(message);
};

exports.getMessage = async (req, res) => {
  const messages = await Message.find({
    $or: [{ sender: req.query.userId }, { receiver: req.query.userId }],
  });
  res.send(messages);
};
