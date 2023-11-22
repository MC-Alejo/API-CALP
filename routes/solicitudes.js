const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, esEncargadoDeArea, esJefeDeMantenimiento } = require('../middlewares');

const { crearSolicitud, rechazarSolicitud, crearTarea } = require('../controllers/solicitudes');
const { existeEquipamientoPorId, existeSolicitudPorId, existeEmpleadoPorId } = require('../helpers');


const router = Router();

// TODO: GETS

// crear una solicitud
router.post('/', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT, // aca sale el id del usuario que esta haciendo la peticion
    esEncargadoDeArea,
    check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
    check('id_equipamiento', 'El id_equipamiento es obligatorio').not().isEmpty(),

    check('descripcion', 'La descripcion debe ser string').isString(),
    check('descripcion', 'La descripcion debe tener mas de 10 caracteres').isLength({ min: 10 }),
    check('descripcion', 'La descripcion debe tener menos de 100 caracteres').isLength({ max: 250 }),

    check('id_equipamiento', 'El ID del equipamiento debe ser un numero').isNumeric(),
    check('id_equipamiento', 'El ID del equipamiento debe ser un numero').isInt(),
    check('id_equipamiento').custom(existeEquipamientoPorId),

    validarCampos,
],
    crearSolicitud);

//rechazar solicitud
router.delete('/:id', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esJefeDeMantenimiento,
    check('id', 'El ID debe ser un numero').not().isEmpty(),
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    check('id').custom(existeSolicitudPorId),

    validarCampos,
], rechazarSolicitud);

//crear una tarea (solicitud aceptada)
router.post('/:id', [
    validarJWT,
    esJefeDeMantenimiento,
    check('id', 'El ID debe ser un numero').not().isEmpty(),
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    check('id').custom(existeSolicitudPorId),

    check('prioridad', 'La prioridad es obligatoria').not().isEmpty(),
    check('id_responsable', 'El id_responsable es obligatorio').not().isEmpty(),

    //prioridad
    check('prioridad', 'El ID debe ser un numero').isNumeric(),
    check('prioridad', 'El ID debe ser un numero').isInt(),
    check('prioridad', 'La prioridad debe ser un numero entre 1 y 3').isInt({ min: 1, max: 3 }), // 1 (alta), 2 (media), 3 (baja)

    //id_responsable
    check('id_responsable', 'El ID debe ser un numero').isNumeric(),
    check('id_responsable', 'El ID debe ser un numero').isInt(),
    check('id_responsable').custom(existeEmpleadoPorId),
    validarCampos,
], crearTarea);






module.exports = router;