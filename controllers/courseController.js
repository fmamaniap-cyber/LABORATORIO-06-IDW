const courses = require("../data/courses");

// GET: l
exports.getAllCourses = (req, res) => {
  const { creditos } = req.query;
  let result = courses;

  if (creditos !== undefined) {
    const cantidad = Number(creditos);

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      return res.status(400).json({
        status: "fail",
        message: "El parámetro creditos debe ser un entero positivo"
      });
    }

    result = courses.filter((course) => course.creditos === cantidad);
  }

  return res.status(200).json({
    status: "success",
    total: result.length,
    data: result
  });
};

// GET: buscar un curso por ID.
exports.getCourseById = (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      status: "fail",
      message: "El ID debe ser un entero positivo"
    });
  }

  const course = courses.find((item) => item.id === id);

  if (!course) {
    return res.status(404).json({
      status: "fail",
      message: "Curso no encontrado"
    });
  }

  return res.status(200).json({
    status: "success",
    data: course
  });
};

// POST: crear un curso.
exports.createCourse = (req, res) => {
  const { nombre, codigo, creditos } = req.body ?? {};

  if (
    typeof nombre !== "string" ||
    !nombre.trim() ||
    typeof codigo !== "string" ||
    !codigo.trim() ||
    creditos === undefined ||
    creditos === null ||
    creditos === ""
  ) {
    return res.status(400).json({
      status: "fail",
      message: "Los campos nombre, codigo y creditos son obligatorios"
    });
  }

  const cantidad = Number(creditos);

  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    return res.status(400).json({
      status: "fail",
      message: "Los créditos deben ser un entero positivo"
    });
  }

  const codigoNormalizado = codigo.trim();
  const existeCodigo = courses.some(
    (course) =>
      course.codigo.toLowerCase() === codigoNormalizado.toLowerCase()
  );

  if (existeCodigo) {
    return res.status(400).json({
      status: "fail",
      message: "Ya existe un curso con ese código"
    });
  }

  const newCourse = {
    id: courses.reduce(
      (maxId, course) => Math.max(maxId, course.id),
      0
    ) + 1,
    nombre: nombre.trim(),
    codigo: codigoNormalizado,
    creditos: cantidad
  };

  courses.push(newCourse);

  return res.status(201).json({
    status: "success",
    message: "Curso creado correctamente",
    data: newCourse
  });
};

// PUT: actualizar un curso existente (reemplazo de campos editables).
exports.updateCourse = (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      status: "fail",
      message: "El ID debe ser un entero positivo"
    });
  }

  const course = courses.find((item) => item.id === id);

  if (!course) {
    return res.status(404).json({
      status: "fail",
      message: "Curso no encontrado"
    });
  }

  const { nombre, codigo, creditos } = req.body ?? {};

  if (
    typeof nombre !== "string" ||
    !nombre.trim() ||
    typeof codigo !== "string" ||
    !codigo.trim() ||
    creditos === undefined ||
    creditos === null ||
    creditos === ""
  ) {
    return res.status(400).json({
      status: "fail",
      message: "Envíe nombre, codigo y creditos para actualizar"
    });
  }

  const cantidad = Number(creditos);

  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    return res.status(400).json({
      status: "fail",
      message: "Los créditos deben ser un entero positivo"
    });
  }

  const codigoNormalizado = codigo.trim();
  const codigoEnUso = courses.some(
    (item) =>
      item.id !== id &&
      item.codigo.toLowerCase() === codigoNormalizado.toLowerCase()
  );

  if (codigoEnUso) {
    return res.status(400).json({
      status: "fail",
      message: "Otro curso ya utiliza ese código"
    });
  }

  course.nombre = nombre.trim();
  course.codigo = codigoNormalizado;
  course.creditos = cantidad;

  return res.status(200).json({
    status: "success",
    message: "Curso actualizado correctamente",
    data: course
  });
};

// DELETE: eliminar un curso.
exports.deleteCourse = (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      status: "fail",
      message: "El ID debe ser un entero positivo"
    });
  }

  const index = courses.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      status: "fail",
      message: "Curso no encontrado"
    });
  }

  const deletedCourse = courses.splice(index, 1)[0];

  return res.status(200).json({
    status: "success",
    message: "Curso eliminado correctamente",
    data: deletedCourse
  });
};
