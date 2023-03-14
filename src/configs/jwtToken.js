const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  generateToken: (id) => {
    // tạo mã token trong 3 ngày
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  },
};
