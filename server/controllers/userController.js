const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const multer = require("multer");

exports.signup = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: hashedPassword,
      gender: req.body.gender,
    });
    const savedUser = await user.save();
    res.json({ message: true, user: savedUser });
  } catch (error) {
    console.log("Error", error);
    res.json({ message: false, error: error });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.json({ error: "Kullanıcı Bulunamadı" });
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.json({ error: "Kullanıcı Bulunamadı" });
    }
    const username = user.firstname + " " + user.lastname;
    const currentId = user._id;
    const token = jwt.sign({ _id: user._id }, "yourKey");
    res.header("auth-token", token).json({
      message: "Giriş Başarılı",
      username: username,
      currentId: currentId,
      token: token,
    });
  } catch (error) {
    console.log("Error", error);
  }
};

exports.checkEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.query.email });
    if (user) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.log("Error", error);
  }
};

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
exports.uploadProfileImage = async (req, res) => {
  try {
    const buffer = fs.readFileSync(req.file.path);
    const base64Image = buffer.toString("base64");
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ error: "User is not found" });
    }
    user.profileImage = base64Image;
    await user.save();
    res.json(user);
  } catch (error) {
    console.log("Error", error);
  }
};

exports.getProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.query.userId);
    if (!user) {
      return res.status(404).json({ error: "User is not found" });
    }
    res.json({ profileImage: user.profileImage });
  } catch (error) {
    console.log("Error", error);
  }
};

exports.uploadCoverImage = async (req, res) => {
  try {
    const buffer = fs.readFileSync(req.file.path);
    const base64Image = buffer.toString("base64");
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ error: "User is not found" });
    }
    user.coverImage = base64Image;
    await user.save();
    res.json(user);
  } catch (error) {
    console.log("Error", error);
  }
};
exports.getCoverImage = async (req, res) => {
  try {
    const user = await User.findById(req.query.userId);
    if (!user) {
      return res.status(404).json({ error: "User is not found" });
    }
    res.json({ coverImage: user.coverImage });
  } catch (error) {
    console.log("Error", error);
  }
};

exports.logout = async (req, res) => {
  try {
    res.header("auth-token", "").json({ message: "Log out successfly" });
  } catch (error) {
    console.log("Error", error);
  }
};
exports.userBlocked = async (req, res) => {
  try {
    const { currentUserId, userId } = req.body;
    const user = await User.findById(currentUserId);
    user.blockedUsers.push(userId);
    await user.save();
    res.send({ success: true });
  } catch (error) {
    console.log("Error", error);
  }
};
exports.userUnBlocked = async(req,res)=>{
  try {
    const {currentUserId, userId} = req.body;
    const user = await User.findById(currentUserId);
    user.blockedUsers.pull(userId);
    await user.save();
    res.send({success:true});
  } catch (error) {
    console.log("Error",error);
  }
}
exports.getBlockedUsers = async(req,res)=>{
  try {
    const user = await User.findById(req.params.userId).populate('blockedUsers');
    res.json(user.blockedUsers);
  } catch (error) {
    console.log("Error",error);
  }
}
exports.changePassword = async(req,res)=>{
  try {
    const {currentUserId, oldPassword, newPassword} = req.body;
    const user = await User.findById(currentUserId);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if(!isMatch){
      return res.status(400).json({message:'Incorrect current password.'});
    }
    const hashedPassword = await bcrypt.hash(newPassword,10);
    user.password = hashedPassword
    await user.save();
    res.json({message:true});
  } catch (error) {
    console.log("Error",error);
    res.status(500).json({message:false,error:error});
  }
}