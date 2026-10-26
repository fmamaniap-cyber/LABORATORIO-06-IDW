module.exports = (err, req, res, next) => {
  console.error("Error en la API:", err);

  if (res.headersSent) {
    return next(err);
  }
  const status = Number.isInteger(err.status) && err.status >= 400
    ? err.status
    : 500;

  return res.status(status).json({
    status: status === 500 ? "error" : "fail",
    message: status === 400
      ? "El cuerpo JSON enviado no es válido"
      : "Error interno del servidor"
  });
};
