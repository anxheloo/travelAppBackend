const router = require("express").Router();
const verifyToken = require("../middleware/jwt_token");
const placeController = require("../controllers/placeController");

router.post("/", verifyToken, placeController.addPlace);
router.post("/addHotel", placeController.addHotelsToPlace);
router.get("/", placeController.getPlaces);
router.get("/:id", placeController.getPlaceById);
router.get("/byCountry/:countryId", placeController.getPlaceByCountry);
router.get("/search/:key", placeController.search);

module.exports = router;
