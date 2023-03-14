const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

module.exports = {
  authMiddleware: asyncHandler(async (req, res, next) => {
    let token;
    //   check có jwt k
    if (req?.headers?.authorization?.startsWith("Bearer")) {
      // split ra mảng xong lấy phần tử chứa mã token
      token = req.headers.authorization.split(" ")[1];
      try {
        if (token) {
          // giải mã token
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const user = await User.findById(decoded?.id);
          req.user = user;
          next();
        }
      } catch (error) {
        throw new Error("Not Authenticated token expired , please login again");
      }
    } else {
      throw new Error("There is no token acttached to header");
    }
  }),

  //   check admin
  isAdmin: asyncHandler(async (req, res, next) => {
    let email = req.user.email;
    const adminUser = await User.findOne({ email: email });
    if (adminUser.role !== "admin") {
      throw new Error("Not admin");
    } else {
      next();
    }
  }),
};
