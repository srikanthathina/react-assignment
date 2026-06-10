export const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;

  if (err.name === "ZodError") {
    return res.status(400).json({
      status: "fail",
      message: "Validation failed",
      errors: err.errors.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message
      }))
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ status: "fail", message: "Invalid token" });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ status: "fail", message: "Token expired" });
  }

  return res.status(statusCode).json({
    status: err.status || "error",
    message: err.isOperational ? err.message : "Something went wrong"
  });
};
