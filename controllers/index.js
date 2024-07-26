const alarma = require("./alarma");
const areas = require("./areas");
const backups = require("./backups");
const depositos = require("./depositos");
const empleados = require("./empleados");
const inventario = require("./inventario");
const login = require("./auth");
const maquinaria = require("./maquinaria");
const reportes = require("./reportes");
const restore = require("./restore");
const sectores = require("./sectores");
const tareas = require("./tareas");
const usuarios = require("./usuarios");

module.exports = {
  ...alarma,
  ...areas,
  ...backups,
  ...depositos,
  ...empleados,
  ...inventario,
  ...login,
  ...maquinaria,
  ...reportes,
  ...restore,
  ...sectores,
  ...tareas,
  ...usuarios,
};
