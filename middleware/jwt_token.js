const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // console.log("THIS ARE HEADERS:", req.headers);

  console.log("THIS IS AUTH HEADER:", authHeader);

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
      if (err) {
        return res
          .status(403)
          .json({ status: false, message: "Invalid Token!", error: err });
      }

      req.user = user;
      next();
    });
  } else {
    return res
      .status(401)
      .json({ status: false, message: "User Not Verified!" });
  }
};

module.exports = verifyToken;
