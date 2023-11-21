const alarma = require('./alarma');
const areas = require('./areas');
const depositos = require('./depositos');
const empleados = require('./empleados');
const inventario = require('./inventario');
const login = require('./auth');
const maquinaria = require('./maquinaria');
const sectores = require('./sectores');
const usuarios = require('./usuarios');
const tareas = require('./tareas');



module.exports = {
    ...alarma,
    ...areas,
    ...depositos,
    ...empleados,
    ...inventario,
    ...login,
    ...maquinaria,
    ...sectores,
    ...tareas,
    ...usuarios,
}