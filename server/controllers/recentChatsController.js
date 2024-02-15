const RecentChat = require("../models/RecentChat");

exports.storeRecentChat = async (req, res) => {
  const { userId, recentChats } = req.body;

  let recentChat = await RecentChat.findOne({ userId });
  if (recentChat) {
    recentChat.recentChats = recentChats;
  } else {
    recentChat = new RecentChat({ userId, recentChats });
  }

  await recentChat.save();
  res.send(recentChat);
};

exports.getRecentChat = async (req, res) => {
  const { userId } = req.query;

  const recentChat = await RecentChat.findOne({ userId });
  if (!recentChat) {
    return res.status(404).send("No recent chats found for this user.");
  }

  res.send(recentChat.recentChats);
};
