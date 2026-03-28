const errorHandler = (err, req, res, next) => {
  console.error(err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(error => error.message).join(', ');
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource identifier';
  }

  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate value entered';
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token expired';
  }

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

module.exports = errorHandler;
