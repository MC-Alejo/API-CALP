const { Router } = require('express');
const { check } = require('express-validator');


const { validarCampos, validarJWT, esJefeDeMantenimiento } = require('../middlewares');

const { existeAlarma } = require('../helpers');

const { actualizarAlarmaMantenimiento, eliminarAlarmaMantenimiento } = require('../controllers');


const router = Router();


// Actualizar alarma al equipamiento
router.put('/:id', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esJefeDeMantenimiento,
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    check('id').custom(existeAlarma),
    validarCampos,
], actualizarAlarmaMantenimiento);


// Eliminar alarma al equipamiento
router.delete('/:id', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esJefeDeMantenimiento,
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    check('id').custom(existeAlarma),
    validarCampos,
], eliminarAlarmaMantenimiento);



module.exports = router;