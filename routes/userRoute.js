const router = require("express").Router();
const authenticateToken = require("../middleware/authenticateToken");
const {
	updateUser,
	followUser,
	unfollowUser,
	getAllUsers,
	getFollowing,
	getNearByShop,
	
} = require("../controllers/userController");

router.put("/updateuser", authenticateToken, updateUser);
router.get("/nearbyshop", authenticateToken, getNearByShop);
router.put("/:id/follow", followUser);
router.put("/:id/unfollow", unfollowUser);
router.get("/:id/following", getFollowing);
router.get("/", getAllUsers);

module.exports = router;
