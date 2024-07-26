const { DataBase } = require("../models");

const obtenerRol = async (id) => {
  const db = new DataBase();

  const rol = await db.getRol(id);

  return rol;
};

module.exports = {
  obtenerRol,
};
