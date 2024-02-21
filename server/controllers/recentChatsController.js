const RecentChat = require("../models/RecentChat");
const User = require("../models/User");
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
      const senderUser = await User.findById(userId);
      if (existingUserIndex !== -1) {
        receiverChat.recentChats[existingUserIndex] = {
          userId,
          firstname: senderUser.firstname,
          lastname: senderUser.lastname,
        };
      } else {
        receiverChat.recentChats = [
          ...receiverChat.recentChats,
          {
            userId,
            firstname: senderUser.firstname,
            lastname: senderUser.lastname,
          },
        ];
      }
    } else {
      const senderUser = await User.findById(userId);
      receiverChat = new RecentChat({
        userId: chat.userId,
        recentChats: [
          {
            userId,
            firstname: senderUser.firstname,
            lastname: senderUser.lastname,
          },
        ],
      });
    }
    await receiverChat.save();
  });
  res.send(senderChat);
};

// exports.getRecentChat = async (req, res) => {
//   const { userId } = req.query;

//   const recentChat = await RecentChat.findOne({ userId });
//   if (!recentChat) {
//     return res.status(404).send("No recent chats found for this user.");
//   }

//   res.send(recentChat.recentChats);
// };
exports.getRecentChat = async (req, res) => {
  const { userId } = req.query;

  const recentChat = await RecentChat.findOne({ userId })
    .populate({
      path: 'recentChats.userId',
      model: 'User',
      select: 'profileImage'
    });

  if (!recentChat) {
    return res.status(404).send("No recent chats found for this user.");
  }

  res.send(recentChat.recentChats);
};

