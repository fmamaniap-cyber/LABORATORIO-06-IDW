const express = require("express");

const courseRoutes = require("./routes/courseRoutes");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;
// Middleware incorporado para procesar JSON.
app.use(express.json());
// Middleware personalizado de auditoría.
app.use(logger);
// Rutas del recurso Cursos.
app.use("/api/cursos", courseRoutes);

// Respuesta para rutas que no existen.
app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Ruta no encontrada"
  });
});
// Gestor global de errores:
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`API de cursos disponible en http://localhost:${PORT}`);
  });
}

module.exports = app;
