const User = require("../models/User");

module.exports = {
  getUser: async (req, res, next) => {
    //1-First way passsing Id as a param
    // try {
    //   const userId = req.params.id;
    //   const user = await User.findById(userId, "-password -profile");

    //   if (!user) {
    //     return res
    //       .status(404)
    //       .json({ status: false, message: "User doesnt exist!" });
    //   }

    //   console.log(user);

    //   res.status(200).json({
    //     status: true,
    //     message: "User successfully returned!",
    //     user: user,
    //   });
    // } catch (error) {
    //   return next(error);
    // }

    //2-Second way, extracting id from token
    const userId = req.user.id;

    console.log("THIS IS USER ID:", userId);

    try {
      const user = await User.findById(
        userId,
        "-password -__v -createdAt -updatedAt"
      );

      console.log("THIS IS USER:", user);

      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "User not found!" });
      }

      res.status(200).json(user);
    } catch (error) {
      return next(error);
    }
  },

  deleteUser: async (req, res, next) => {
    //1-First way passsing Id as a param
    // try {
    //   const userId = req.params.id;
    //   const user = await User.findByIdAndDelete(userId);

    //   res
    //     .status(200)
    //     .json({ status: true, message: "User Successfully Deleted!" });
    // } catch (error) {
    //   return next(error);
    // }

    //2-Second way, extracting id from token
    try {
      const userId = req.user.id;
      await User.findByIdAndDelete(userId);

      res
        .status(200)
        .json({ status: true, message: "User Successfully Deleted!" });
    } catch (error) {
      return next(error);
    }
  },
};
