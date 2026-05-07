export function notFoundHandler(_request, response) {
  response.status(404).json({ detail: "Not found" });
}

export function errorHandler(error, _request, response, _next) {
  const status = error.status || 500;
  response.status(status).json({
    detail: error.message || "Internal server error",
  });
}
