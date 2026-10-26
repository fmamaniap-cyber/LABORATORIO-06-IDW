module.exports = (req, res, next) => {
  const inicio = process.hrtime.bigint();

  res.on("finish", () => {
    const fin = process.hrtime.bigint();
    const tiempoMs = Number(fin - inicio) / 1_000_000;

    console.log(
      `[${new Date().toISOString()}] ` +
      `${req.method} ${req.originalUrl} - ` +
      `${res.statusCode} - ${tiempoMs.toFixed(2)} ms`
    );
  });

  next();
};
