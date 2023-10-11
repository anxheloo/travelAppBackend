const router = require("express").Router();
const verifyToken = require("../middleware/jwt_token");
const countryController = require("../controllers/countryControllers");

router.post("/", verifyToken, countryController.addCountry);
router.get("/", countryController.getCountries);
router.get("/:id", countryController.getCountry);
router.post("/addPlace", countryController.addPlacesToCountry);

module.exports = router;
