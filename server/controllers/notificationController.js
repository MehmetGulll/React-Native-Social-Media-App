const Notification = require("../models/Notifications");
const express = require("express");

exports.getNotifications = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({
      followee: req.query.userId,
    })
      .populate("follower")
      .skip(skip)
      .limit(limit);

    res.json(notifications);
  } catch (error) {
    console.log("Error", error);
    res.json({ message: error });
  }
};
