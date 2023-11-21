const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, esJefeDeMantenimiento } = require('../middlewares');

const { existeTareaPorId } = require('../helpers');

const { actualizarTarea, finalizarTarea } = require('../controllers');

const router = Router();

//modificar tarea
router.put('/:id', [
    validarJWT,
    esJefeDeMantenimiento,
    check('id', 'El ID debe ser un numero').not().isEmpty(),
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    check('id').custom(existeTareaPorId),

    validarCampos,
], actualizarTarea);

//finalizar tarea
router.patch('/:id', [
    validarJWT,
    esJefeDeMantenimiento,
    check('id', 'El ID debe ser un numero').not().isEmpty(),
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    check('id').custom(existeTareaPorId),

    validarCampos,
], finalizarTarea);

module.exports = router;