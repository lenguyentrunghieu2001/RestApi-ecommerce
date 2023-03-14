const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;

const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const morgan = require("morgan");
const dbConnect = require("./configs/dbConnect");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");

// config request body
app.use(express.json()); //utilizes the body-parser package
app.use(express.urlencoded({ extended: true }));

// config morgan
app.use(morgan("dev"));

// config cookie parser
app.use(cookieParser());

// config routes
app.use("/api/v1/user", authRouter);
app.use("/api/v1/product", productRouter);

// middleware error
app.use(notFound);
app.use(errorHandler);

(async () => {
  await dbConnect();

  app.listen(PORT, () => {
    console.log(`Server running on port: http://localhost:${PORT}`);
  });
})();
