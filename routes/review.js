const router = require("express").Router();
const reviewController = require("../controllers/reviewController");
const verifyToken = require("../middleware/jwt_token");

router.post("/", verifyToken, reviewController.addReview);
router.get("/:placeId", reviewController.getReviews);
// router.get("/getByUser", reviewController.getReviews);
// router.get("/getByUser", verifyToken, reviewController.getReviews);
router.post("/addReview", reviewController.addReview);

module.exports = router;
