module.exports = {
  // not Found
  notFound: (req, res, next) => {
    const error = new Error("Not Found ", req.originalUrl);
    res.status(404);
    next(error);
  },

  // Error handler
  errorHandler: (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
      message: err?.message, //nếu có thì làm k thì trả về undifined
      stack: err?.stack,
    });
  },
};
