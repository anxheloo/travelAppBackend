const Place = require("../models/Place");

module.exports = {
  addPlace: async (req, res, next) => {
    const {
      country_id,
      description,
      imageUrl,
      location,
      contact_id,
      title,
      rating,
      review,
      latitude,
      longitude,
      // popular,
    } = req.body;

    try {
      const newPlace = new Place({
        country_id,
        description,
        imageUrl,
        location,
        contact_id,
        title,
        rating,
        review,
        latitude,
        longitude,
        // popular,
      });

      await newPlace.save();

      res
        .status(201)
        .json({ status: true, message: "New Place created Successfully!" });
    } catch (error) {
      next(error);
    }
  },

  getPlaces: async (req, res, next) => {
    try {
      const limitParams = req.query.limit;
      //we can use : {_id:1, place_id:1} -> so we only inclide these properties instead of using exclusion: "-popular -description".
      // using : {_id:0, place_id:0} -> it is an exclusion similar to "-_id -place_id"
      // or we can include properties: {"_id place_id description"}

      //WAY 1- MY OWN WAY
      //-------------------

      let limit = "";
      if (limitParams !== "all") {
        limit = Number(limitParams) || 5;
      }
      const places = await Place.find(
        {},
        "-description -popular -createdAt -updatedAt -__v"
      ).limit(limit); //-> limit the amount of results we get to "5"

      //WAY 2 - UDEMY WAY
      //--------------------

      // let query = Place.find(
      //   {},
      //   "-description -popular -createdAt -updatedAt -__v"
      // );

      // if (limitParams !== "all") {
      //   const limit = parseInt(limitParams) || 5;
      //   query = query.limit(limit);
      // }

      // const places = await query.exec();

      res
        .status(200)
        .json({ status: true, message: "These are places:", places });
    } catch (error) {
      next(error);
    }
  },

  getPlaceById: async (req, res, next) => {
    const placeId = req.params.id;

    try {
      const place = await Place.findById(
        placeId,
        "-createdAt -updatedAt -__v"
      ).populate({
        path: "popular",
        select: "title rating review imageUrl location",
      });

      if (!place) {
        res.status(404).json({
          status: false,
          message: `Place with id:${placeId} doesnt exist!`,
        });
      }

      res.status(200).json({
        status: true,
        message: `Place with id: ${placeId} exists!`,
        place,
      });
    } catch (error) {
      next(error);
    }
  },

  getPlaceByCountry: async (req, res, next) => {
    try {
      const countryId = req.params.countryId;

      const places = await Place.find(
        { country_id: countryId },
        "-popular -createdAt -updatedAt -__v"
      );

      if (places.length === 0) {
        return res.status(200).json({
          message: `There are no places with countryId: ${countryId}`,
          places: [],
        });
      }

      res
        .status(200)
        .json({ status: true, message: "These are places:", places });
    } catch (error) {
      next(error);
    }
  },

  addHotelsToPlace: async (req, res, next) => {
    const { placeId, hotelId } = req.body;

    try {
      const place = await Place.findById(placeId);

      if (!place) {
        return res.status(404).json({
          status: false,
          message: `Place with id: ${placeId} doesnt exist!`,
        });
      }
      // const index = country.popular.indexOf(placeId)

      // if(index !== -1){
      //   country.popular.splice(index, 1)
      // }else{
      //   country.popular.push(placeId)
      // }

      if (place.popular.includes(hotelId)) {
        return res.status(400).json({
          status: false,
          message: `Hotel with id: ${hotelId} is already added!`,
        });
      }

      place.popular.push(hotelId);
      await place.save();

      res.status(200).json({
        status: true,
        message: `Hotel with id: ${hotelId} is added to place with id: ${placeId}`,
      });
    } catch (error) {
      next(error);
    }
  },

  search: async (req, res, next) => {
    try {
      const results = await Place.aggregate([
        {
          $search: {
            index: "places",
            text: {
              query: req.params.key,
              path: {
                wildcard: "*",
              },
            },
          },
        },
      ]);

      res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  },
};
