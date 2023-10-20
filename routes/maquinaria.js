const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, esJefeDeMantenimiento } = require('../middlewares');

const { existeEquipamientoPorId, existeAlarmaMantenimiento } = require('../helpers');

const { actualizarEquipamiento, bajaEquipamiento, crearAlarmaDeMantenimiento } = require('../controllers');

const router = Router();


//Actualizar equipamiento (nombre y sector al que pertenece)
router.put('/:id', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esJefeDeMantenimiento,
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    check('id').custom(existeEquipamientoPorId),
    validarCampos,
], actualizarEquipamiento);


//Dar de baja equipamiento de un sector
router.delete('/:id', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esJefeDeMantenimiento,
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    check('id').custom(existeEquipamientoPorId),
    validarCampos,
], bajaEquipamiento);



//Dar de alta una alarma de mantenimiento a un equipamiento
router.post('/:id', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esJefeDeMantenimiento,
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    check('id').custom(existeEquipamientoPorId),
    check('id').custom(existeAlarmaMantenimiento),
    check('fecha', 'La fecha de alarma es obligatoria').not().isEmpty(),
    check('hora', 'La hora de alarma es obligatoria').not().isEmpty(),
    check('fecha', 'El formato de la fecha no es valido').isDate(),
    check('hora', 'El formato de la hora no es valido').isTime(),
    validarCampos,
], crearAlarmaDeMantenimiento);

module.exports = router;