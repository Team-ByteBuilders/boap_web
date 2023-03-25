const User = require("../models/userModel");
const Shop = require("../models/shopModel");
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
// to get user details
const getUser = async (req, res) => {
  try {
    console.log(req.userId);
    const user = await User.findById(req.userId);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "internal server error :)" });
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

//get balance and payment history
const getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const revArray=user.paymentHistory.reverse();
    if(revArray.length>5){
    return res.status(200).json({
      balance: user.balance,
      paymentHistory: revArray.slice(0,5),
    });
  }
  else{
    return res.status(200).json({
      balance: user.balance,
      paymentHistory: user.paymentHistory,
    });
  }
  } catch (error) {
    res.status(500).json({
      message: "internal server error occured :)",
      error: error.message,
    });
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

const getNearByShop = async (req, res) => {
  let { lat, lon } = req.body;
  // lat=lat.slice(0, 5);
  // lon=lon.slice(0, 5);
  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  try {
    const shops = await Shop.find();
    console.log(shops);
    const nearbyShops = shops.filter((shop) => {
      const distance = getDistanceFromLatLonInKm(lat, lon, shop.lat, shop.lon);
      if (distance < 1) {
        return shop;
      }
    });

    res.status(200).json(nearbyShops);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};

const createData = async(req, res)=>{
  const shop = Shop.findByIdAndUpdate(
    { shopName: "shop1" },
    {
      $set: {
        topList: [
          { name: "maggi", price: 5 },
          { name: "notebook", price: 40 },
        ],
      },
    },
    { new: true }
  );
  res.status(200).json(shop)
}

module.exports = {
  updateUser,
  followUser,
  unfollowUser,
  getAllUsers,
  getFollowing,
  getNearByShop,
  getBalance,
  getUser,
};


