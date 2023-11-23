const { Router } = require('express');
const { check } = require('express-validator');


const { validarCampos, validarJWT, esJefeDeMantenimiento } = require('../middlewares');

const { existeInventarioPorId } = require('../helpers');

const { actualizarInventario, eliminarInventario, obtenerInventario, obtenerInventarioPorId } = require('../controllers');


const router = Router();

//obtener todo el inventario
router.get('/', [
    validarJWT,
    esJefeDeMantenimiento,
    validarCampos,
], obtenerInventario);

//obtener un inventario por id
router.get('/:id', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esJefeDeMantenimiento,
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    check('id').custom(existeInventarioPorId),
    validarCampos,
], obtenerInventarioPorId);

// Actualizar Inventario
router.put('/:id', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esJefeDeMantenimiento,
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    check('id').custom(existeInventarioPorId),

    validarCampos,
], actualizarInventario);



// Eliminar inventario
router.delete('/:id', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esJefeDeMantenimiento,
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    check('id').custom(existeInventarioPorId),

    validarCampos,
], eliminarInventario);




module.exports = router;