const User = require("../models/User");

const CryptoJS = require("crypto-js");
var jwt = require("jsonwebtoken");

module.exports = {
  createUser: async (req, res, next) => {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRETB
      ).toString(),
    });

    try {
      await newUser.save();
      res
        .status(201)
        .json({ status: true, message: "User Successfully created!" });
    } catch (error) {
      // res
      //   .status(500)
      //   .json({ status: false, message: "Something went wrong", error: error });

      return next(error);
    }
  },

  loginUser: async (req, res, next) => {
    try {
      //1-Find the user by email
      const user = await User.findOne({ email: req.body.email });

      //2-If user not exist, return :
      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "User not found!" });
      }

      //3-Get the user password and decrypt
      const decryptedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.SECRETB
      );

      //4-Convert it to String
      const decryptedPasswordString = decryptedPassword.toString(
        CryptoJS.enc.Utf8
      );

      if (decryptedPasswordString !== req.body.password) {
        return res
          .status(401)
          .json({ status: false, message: "Wrong Password!" });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      const userId = user._id;

      res.status(200).json({
        status: true,
        id: userId,
        token: token,
        message: "User Successfully Login!",
      });
    } catch (error) {
      return next(error);
    }
  },
};
