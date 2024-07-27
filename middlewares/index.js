const validarCampos = require("../middlewares/validarCampos");
const validarCamposDeRoles = require("../middlewares/validarRoles");
const validarJuez = require("./validarJuez");
const validarJWT = require("./validarJWT");

module.exports = {
  ...validarCampos,
  ...validarCamposDeRoles,
  ...validarJuez,
  ...validarJWT,
};
