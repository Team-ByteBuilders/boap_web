const router = require("express").Router();
const authenticateToken = require("../middleware/authenticateToken");
const {
  updateUser,
  followUser,
  unfollowUser,
  getAllUsers,
  getFollowing,
  getNearByShop,
  getUser,
} = require("../controllers/userController");

router.put("/updateuser", authenticateToken, updateUser);
router.post("/nearbyshop", authenticateToken, getNearByShop);
router.put("/:id/follow", followUser);
router.put("/:id/unfollow", unfollowUser);
router.get("/:id/following", getFollowing);
router.get("/", getAllUsers);;
router.get("/getUser",authenticateToken, getUser);
module.exports = router;
