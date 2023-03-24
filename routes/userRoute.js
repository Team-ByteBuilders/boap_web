const router = require("express").Router();
const authenticateToken = require("../middleware/authenticateToken");
const {
	updateUser,
	followUser,
	unfollowUser,
	getAllUsers,
	getFollowing,
	
} = require("../controllers/userController");

router.put("/updateuser", authenticateToken, updateUser);
router.put("/:id/follow", followUser);
router.put("/:id/unfollow", unfollowUser);
router.get("/:id/following", getFollowing);
router.get("/", getAllUsers);

module.exports = router;
