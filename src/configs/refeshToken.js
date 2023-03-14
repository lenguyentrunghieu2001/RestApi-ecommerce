const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  generateRefeshToken: (id) => {
    // tạo mã token trong 3 ngày
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "3d" });
  },
};
