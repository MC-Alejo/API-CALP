
const generarJWT = require("./generarJWT");
const dbValidators = require("./dbValidators");
const obtenerRol = require("./obtenerRol");




module.exports = {
    ...generarJWT,
    ...dbValidators,
    ...obtenerRol
}