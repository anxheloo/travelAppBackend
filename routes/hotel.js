const router = require("express").Router();
const verifyToken = require("../middleware/jwt_token");
const hotelController = require("../controllers/hotelController");

router.post("/", verifyToken, hotelController.addHotel);
router.get("/", hotelController.getHotel);
router.get("/:id", hotelController.getHotelById);
router.get("/byCountry/:countryId", hotelController.getHotelByCountry);
// router.get("/search/:key", hotelController.search);
router.post("/addReview", hotelController.addReviewToHotel);

module.exports = router;
