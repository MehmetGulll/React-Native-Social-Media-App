const multer = require("multer");
const Post = require("../models/Post");
const fs = require("fs");
const Follow = require("../models/Follow");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/");
  },
  filename: function (req, file, cb) {
    let ext = "";
    switch (file.mimetype) {
      case "image/jpeg":
        ext = ".jpg";
        break;
      case "image/png":
        ext = ".png";
        break;
    }
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage: storage });
exports.addPost = async (req, res) => {
  try {
    const buffer = fs.readFileSync(req.file.path);
    const base64Image = buffer.toString("base64");
    const post = new Post({
      userId: req.body.userId,
      username: req.body.username,
      content: base64Image,
    });
    const savedPost = await post.save();
    res.json(savedPost);
  } catch (error) {
    console.log("Error", error);
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    await post.deleteOne();
    res.json({ message: "Post deleted successfuly" });
  } catch (error) {
    console.log("Error", error);
  }
};

exports.getPost = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  try {
    const posts = await Post.find().skip(skip).limit(limit);
    res.json(posts);
  } catch (error) {
    console.log("Error the all post", error);
    res.status(500).json({ message: "Fail" });
  }
};

exports.getFollowedUsersPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const followedUsers = await Follow.find({ follower: req.body.userId });
    const userIds = followedUsers.map((follow) => follow.followee);
    console.log(userIds);
    const posts = await Post.find({ userId: { $in: userIds } })
      .skip(skip)
      .limit(limit);
    console.log(posts);
    const totalPosts = await Post.countDocuments({ userId: { $in: userIds } });
    const hasMore = totalPosts > skip + posts.length;
    res.json({ posts, hasMore, totalPosts });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ message: error });
  }
};

exports.postLike = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;
  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  if (post.likes.includes(userId)) {
    return res.status(400).json({ error: "Post already liked" });
  }

  post.likes.push(userId);
  await post.save();
  res.json(post);
};

exports.postUnLike = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  const likeIndex = post.likes.indexOf(userId);
  if (likeIndex === -1) {
    return res.status(400).json({ error: "Post not liked yet" });
  }

  post.likes.splice(likeIndex, 1);
  await post.save();
  res.json(post);
};
