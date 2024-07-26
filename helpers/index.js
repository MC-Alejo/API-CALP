const backups = require("./backups");
const dbValidators = require("./dbValidators");
const generarJWT = require("./generarJWT");
const obtenerRol = require("./obtenerRol");

module.exports = {
  ...backups,
  ...dbValidators,
  ...generarJWT,
  ...obtenerRol,
};
