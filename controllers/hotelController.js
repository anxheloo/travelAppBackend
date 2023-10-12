const Hotel = require("../models/Hotel");
const Review = require("../models/Review");

module.exports = {
  addHotel: async (req, res, next) => {
    const {
      country_id,
      title,
      description,
      availability,
      imageUrl,
      location,
      contact,
      rating,
      review,
      coordinates,
      price,
      facilities,
    } = req.body;

    try {
      const newHotel = new Hotel({
        country_id,
        description,
        availability,
        title,
        imageUrl,
        location,
        contact,
        rating,
        review,
        coordinates,
        price,
        facilities,
      });

      await newHotel.save();

      res
        .status(201)
        .json({ status: true, message: "New Hotel created Successfully!" });
    } catch (error) {
      next(error);
    }
  },

  getHotel: async (req, res, next) => {
    const queryParameter = req.query.limit;

    try {
      //we can use : {_id:1, place_id:1} -> so we only inclide these properties instead of using exclusion: "-popular -description".
      // using : {_id:0, place_id:0} -> it is an exclusion similar to "-_id -place_id"
      // or we can include properties: {"_id place_id description"}

      let limit = "";

      if (queryParameter !== "all") {
        limit = Number(queryParameter) || 4;
      }

      const hotels = await Hotel.find({}, "-facilities._id").limit(limit);

      res
        .status(200)
        .json({ status: true, message: "These are Hotels:", hotels });
    } catch (error) {
      next(error);
    }
  },

  getHotelById: async (req, res, next) => {
    const hotelId = req.params.id;

    try {
      const hotel = await Hotel.findById(
        hotelId,
        "-createdAt -updatedAt -__v"
      ).populate({
        path: "reviews",
        options: { limit: 2, sort: { updatedAt: -1 } }, //we get only 2 reviews from the hotel
        select: " rating review updatedAt user",
        populate: {
          path: "user",
          model: "User",
          select: "username profile",
        },
      });

      if (!hotel) {
        res.status(404).json({
          status: false,
          message: `Hotel with id:${hotelId} doesnt exist!`,
        });
      }

      // Fetch all reviews associated with the hotel
      // const reviews = await Review.find({
      //   place: hotelId,
      // })
      //   .select("rating review updatedAt user")
      //   .populate({
      //     path: "user",
      //     model: "User",
      //     select: "username profile",
      //   })
      //   .limit(2); // Set the limit to 2 reviews;

      // hotel.reviews = reviews;

      res.status(200).json({
        status: true,
        message: `Hotel with id: ${hotelId} exists!`,
        hotel,
      });
    } catch (error) {
      next(error);
    }
  },

  getHotelByCountry: async (req, res, next) => {
    try {
      const countryId = req.params.countryId;
      const limitParams = req.query.limit;

      let limit = "";

      if (limitParams !== "all") {
        limit = Number(limitParams) || 4;
      }

      const hotels = await Hotel.find({ country_id: countryId }).limit(limit);

      if (hotels.length === 0) {
        return res.status(200).json({
          message: `There are no hotels with countryId: ${countryId}`,
          hotels: [],
        });
      }

      res
        .status(200)
        .json({ status: true, message: "These are hotels:", hotels });
    } catch (error) {
      next(error);
    }
  },

  addReviewToHotel: async (req, res, next) => {
    const { hotelId, reviewId } = req.body;

    console.log(hotelId, reviewId);

    try {
      const hotel = await Hotel.findById(hotelId);

      // .populate({
      //   path: "reviews",
      //   select: "place review rating user",
      // });

      if (!hotel) {
        return res.status(404).json({
          status: false,
          message: `Hotel with id: ${hotelId} doesnt exist!`,
        });
      }
      // const index = country.popular.indexOf(placeId)

      // if(index !== -1){
      //   country.popular.splice(index, 1)
      // }else{
      //   country.popular.push(placeId)
      // }

      if (hotel.reviews.includes(reviewId)) {
        return res.status(400).json({
          status: false,
          message: `Review with id: ${reviewId} is already added!`,
        });
      }

      hotel.reviews.push(reviewId);
      await hotel.save();

      res.status(200).json({
        status: true,
        message: `Review with id: ${reviewId} is added to hotel with id: ${hotelId}`,
      });
    } catch (error) {
      next(error);
    }
  },

  // search: async (req, res, next) => {
  //   try {
  //     const results = await Place.aggregate([
  //       {
  //         $search: {
  //           index: "places",
  //           text: {
  //             query: req.params.key,
  //             path: {
  //               wildcard: "*",
  //             },
  //           },
  //         },
  //       },
  //     ]);

  //     res.status(200).json(results);
  //   } catch (error) {
  //     next(error);
  //   }
  // },
};
