const RecentChat = require("../models/RecentChat");
exports.storeRecentChat = async (req, res) => {
  const { userId, recentChats } = req.body;
  let senderChat = await RecentChat.findOne({ userId });
  if (senderChat) {
    senderChat.recentChats = recentChats;
  } else {
    senderChat = new RecentChat({ userId, recentChats });
  }
  await senderChat.save();

  recentChats.forEach(async (chat) => {
    let receiverChat = await RecentChat.findOne({ userId: chat.userId });
    if (receiverChat) {
      const existingUserIndex = receiverChat.recentChats.findIndex(
        (user) => user.userId === userId
      );
      if (existingUserIndex !== -1) {
        receiverChat.recentChats[existingUserIndex] = {
          userId,
          firstname: chat.firstname,
          lastname: chat.lastname,
        };
      } else {
        receiverChat.recentChats = [
          ...receiverChat.recentChats,
          { userId, firstname: chat.firstname, lastname: chat.lastname },
        ];
      }
    } else {
      receiverChat = new RecentChat({
        userId: chat.userId,
        recentChats: [
          { userId, firstname: chat.firstname, lastname: chat.lastname },
        ],
      });
    }
    await receiverChat.save();
  });

  res.send(senderChat);
};

exports.getRecentChat = async (req, res) => {
  const { userId } = req.query;

  const recentChat = await RecentChat.findOne({ userId });
  if (!recentChat) {
    return res.status(404).send("No recent chats found for this user.");
  }

  res.send(recentChat.recentChats);
};
