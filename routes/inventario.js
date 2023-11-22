const { Router } = require('express');
const { check } = require('express-validator');


const { validarCampos, validarJWT, esJefeDeMantenimiento } = require('../middlewares');

const { existeInventarioPorId } = require('../helpers');

const { actualizarInventario, eliminarInventario } = require('../controllers');


const router = Router();

// TODO: GETS
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