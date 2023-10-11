const Review = require("../models/Review");

module.exports = {
  addReview: async (req, res, next) => {
    const userId = req.user.id; //-> we get this from our middleware(token)
    const { place, review, rating } = req.body;

    try {
      const existingReview = await Review.findOne({
        place: place,
        user: userId,
      });

      if (existingReview) {
        existingReview.rating = rating;
        existingReview.review = review;

        await existingReview.save();

        res.status(201).json({
          status: true,
          message: "Review Successfully updated!",
        });
      } else {
        const newReview = new Review({
          place,
          review,
          rating,
          user: userId,
        });
        await newReview.save();

        res.status(201).json({
          status: true,
          message: "Review Successfully submited!",
        });
      }
    } catch (error) {
      next(error);
    }
  },

  getReviews: async (req, res, next) => {
    const placeId = req.params.placeId;
    // const userId = req.user.id;

    try {
      const reviewsBasedOnPlaceId = await Review.find(
        {
          place: placeId,
        },
        "-__v"
      ).populate({
        path: "user",
        select: "username profile ",
      });
      // const reviewsBasedOnPlaceId = await Review.find({ user: userId });

      if (!reviewsBasedOnPlaceId) {
        return res
          .status(404)
          .json({ status: false, message: "There are no reviews" });
      }

      res.status(200).json({ status: true, reviewsBasedOnPlaceId });
    } catch (error) {
      next(error);
    }
  },
};
