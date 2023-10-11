const Country = require("../models/Country");
const Place = require("../models/Place");

module.exports = {
  addCountry: async (req, res, next) => {
    const { country, description, imageUrl, region, popular } = req.body;

    try {
      const newCountry = new Country({
        country: country,
        description: description,
        imageUrl: imageUrl,
        region: region,
        popular: popular,
      });

      await newCountry.save();

      res
        .status(201)
        .json({ status: true, message: "Country Successfully created!" });
    } catch (error) {
      next(error);
    }
  },

  addPlacesToCountry: async (req, res, next) => {
    const { placeId, countryId } = req.body;

    try {
      const country = await Country.findById(countryId);

      if (!country) {
        return res.status(404).json({
          status: false,
          message: `Country with id: ${countryId} doesnt exist!`,
        });
      }
      // const index = country.popular.indexOf(placeId)

      // if(index !== -1){
      //   country.popular.splice(index, 1)
      // }else{
      //   country.popular.push(placeId)
      // }

      if (country.popular.includes(placeId)) {
        return res
          .status(400)
          .json({
            status: false,
            message: `Place with id: ${placeId} is already added!`,
          });
      }

      country.popular.push(placeId);
      await country.save();

      res.status(200).json({
        status: true,
        message: `Place with id: ${placeId} is added to country with id: ${countryId}`,
      });
    } catch (error) {
      next(error);
    }
  },

  getCountries: async (req, res, next) => {
    try {
      const countries = await Country.find(
        {},
        "-description -region -popular -createdAt -updatedAt -__v"
      );

      res.status(201).json({
        status: true,
        message: "These are countries in your collection:",
        countries,
      });
    } catch (error) {
      next(error);
    }
  },

  getCountry: async (req, res, next) => {
    const countryId = req.params.id;

    try {
      //Without the populate method, we will simply get the ObjectId reference instead of the place document itself.
      const country = await Country.findById(
        countryId,
        "-createdAt -updatedAt -__v"
      ).populate({
        path: "popular",
        select: "title rating review imageUrl location",
      });

      if (!country) {
        res.status(404).json({
          status: false,
          message: `Country with id:${countryId} doesnt exist!`,
        });
      }

      res.status(200).json({
        status: true,
        message: `Country with id: ${countryId} exists!`,
        country,
      });
    } catch (error) {
      next(error);
    }
  },
};
