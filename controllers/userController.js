const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
// const Post = require("../models/postModel");

//update a user
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.userId, {
      $set: req.body,
    });
    const newUser = await User.findById(user._id);
    return res.status(200).json({
      token: jwt.sign(newUser._id.toString(), process.env.ACCESS_TOKEN_SECRET),
      userID: newUser._id.toString(),
      userUpi: newUser.userUpi,
      email: newUser.email,
      gender: newUser.gender,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      phoneNumber: newUser.phoneNumber,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

//follow a user
const followUser = async (req, res) => {
  if (req.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body._id);
      if (!user.followers.includes(req.body._id)) {
        await user.updateOne({ $push: { followers: req.body._id } });
        await currentUser.updateOne({ $push: { following: req.params.id } });
        res.status(200).json("User has been followed");
      } else {
        res.status(403).json("Already following user");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("Cannot follow self");
  }
};

//unfollow a user
const unfollowUser = async (req, res) => {
  if (req.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body._id);
      if (user.followers.includes(req.body._id)) {
        await user.updateOne({ $pull: { followers: req.body._id } });
        await currentUser.updateOne({ $pull: { following: req.params.id } });
        res.status(200).json("User has been unfollowed");
      } else {
        res.status(403).json("Dont follow user");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("cannot unfollow self");
  }
};

//get all users
const getAllUsers = async (req, res) => {
  try {
    let users = await User.find();
    users = users.map((user) => {
      const { password, ...otherDetails } = user._doc;
      return otherDetails;
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json("error");
  }
};

//get followers list
const getFollowing = async (req, res) => {
  try {
    const following = await User.find({
      followers: {
        $elemMatch: { $in: [req.params.id], $exists: true },
      },
    });
    res.status(200).json(following);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};

module.exports = {
  updateUser,
  followUser,
  unfollowUser,
  getAllUsers,
  getFollowing,
};
