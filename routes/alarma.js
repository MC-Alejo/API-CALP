
const { Router } = require('express');
const { check } = require('express-validator');


const { validarCampos, validarJWT, esJefeDeMantenimiento, esJuezEsGoAlarma } = require('../middlewares');

const { validarFecha, existeAlarma } = require('../helpers');

const { actualizarAlarmaMantenimiento, eliminarAlarmaMantenimiento, obtenerAlarmas, obtenerAlarmasOrdenadas, obtenerAlarmaPorId, obtenerAlarmasJuez } = require('../controllers');


const router = Router();

//obtener todas las alarmas
router.get('/', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esJefeDeMantenimiento,
    validarCampos,
], obtenerAlarmas);

//obtener todas las alarmas ordenadas
router.get('/order', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esJefeDeMantenimiento,
    validarCampos,
], obtenerAlarmasOrdenadas);

//obtener alarma por id
router.get('/:id', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esJefeDeMantenimiento,
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    check('id').custom(existeAlarma),
    validarCampos,
], obtenerAlarmaPorId);

//obtener todas las alarmas de un juez
router.get('/juez/:id', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esJefeDeMantenimiento,
    check('id', 'El ID es obligatorio').not().isEmpty(),
    check('id', 'El ID no es un formato valido').isUUID(),
    validarCampos,
], obtenerAlarmasJuez);


// Actualizar alarma al equipamiento
router.put('/:id', [
    validarJWT,
    esJefeDeMantenimiento,
    check('id', 'El ID debe ser un numero').not().isEmpty(),
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    check('id').custom(existeAlarma),

    check('fecha', 'El formato de la fecha no es valido').optional().isDate(),
    check('fecha').optional().custom(validarFecha),
    
    //descripcion de la tarea
    check('descripcion', 'La descripcion debe tener mas de 10 caracteres').optional().isLength({ min: 10 }),
    check('descripcion', 'La descripcion debe tener menos de 250 caracteres').optional().isLength({ max: 250 }),

    //prioridad
    check('prioridad', 'El ID debe ser un numero').optional().isNumeric(),
    check('prioridad', 'El ID debe ser un numero').optional().isInt(),
    check('prioridad', 'La prioridad debe ser un numero entre 1 y 3').optional().isInt({ min: 1, max: 3 }), // 1 (alta), 2 (media), 3 (baja)

    validarCampos,
    esJuezEsGoAlarma,
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
    esJuezEsGoAlarma,
], eliminarAlarmaMantenimiento);


module.exports = router;