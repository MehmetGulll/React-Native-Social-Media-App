const Notification = require("../models/Notifications");
const express = require("express");
exports.getNotifications = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  try {
    const notifications = await Notification.find({
      followee: req.query.userId,
    })
      .populate("follower")
      .skip(skip)
      .limit(limit);

    const totalNotifications = await Notification.countDocuments({ followee: req.query.userId });
    const hasMore = totalNotifications > skip + notifications.length;

    res.json({ notifications, hasMore, totalNotifications });
  } catch (error) {
    console.log("Error", error);
    res.json({ message: error });
  }
};

