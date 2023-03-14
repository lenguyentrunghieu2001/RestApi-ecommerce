const userController = require("../controllers/userController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = require("express").Router();

router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/all-users", userController.getAllUsers);
router.get("/refesh-token", userController.handleRefeshToken);
router.get("/logout", userController.logout);
router.get("/:id", authMiddleware, userController.getAUser);
router.put("/edit-user", authMiddleware, userController.updateAUser);
router.delete("/:id", userController.deleteAUser);
router.put(
  "/block-user/:id",
  authMiddleware,
  isAdmin,
  userController.blockUser
);
router.put(
  "/unblock-user/:id",
  authMiddleware,
  isAdmin,
  userController.unBlockUser
);

module.exports = router;
