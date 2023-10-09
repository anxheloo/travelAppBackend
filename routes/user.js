const router = require("express").Router();
const authController = require("../controllers/userController");
const verifyToken = require("../middleware/jwt_token");

router.get("/", verifyToken, authController.getUser);

router.delete("/", verifyToken, authController.deleteUser);

module.exports = router;
