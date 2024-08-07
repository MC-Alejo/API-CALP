const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, esEncargadoDeArea, esJefeDeMantenimiento, esUnRolValido } = require('../middlewares');
const { existeEquipamientoPorId, existeSolicitudPorId, existeEmpleadoPorId, SolicitudEstaPendiente, validarIdUsuario } = require('../helpers');

const {
    crearSolicitud,
    crearTarea,
    obtenerSolicitudes,
    obtenerSolicitudesOrdenadas,
    obtenerSolicitudesPorId,
    obtenerSolicitudesPorIdUsuario,
    obtenerTareaPorIdSolicitud,
    rechazarSolicitud,
} = require('../controllers/solicitudes');


const router = Router();

//obtener solicitudes
router.get('/', [
    validarJWT,
    esJefeDeMantenimiento,
    validarCampos,
], obtenerSolicitudes);

//obtener solicitudes ordenadas
router.get('/order', [
    validarJWT,
    esJefeDeMantenimiento,
    validarCampos,
], obtenerSolicitudesOrdenadas);

//obtener solicitudes por id de usuario
router.get('/usr/:id', [
    validarJWT,
    esEncargadoDeArea,
    check('id', 'El ID es obligatorio').not().isEmpty(),
    check('id', 'El ID no posee un formato valido').isUUID(),
    check('id').custom(validarIdUsuario),
    validarCampos,
], obtenerSolicitudesPorIdUsuario);

//obtener solicitudes por id
router.get('/:id', [
    validarJWT,
    esUnRolValido,
    check('id', 'El ID es obligatorio').not().isEmpty(),
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    check('id').custom(existeSolicitudPorId),
    validarCampos,
], obtenerSolicitudesPorId);

//obtener la tarea de una solicitud
router.get('/:id/tarea', [
    validarJWT,
    esUnRolValido,
    check('id', 'El ID es obligatorio').not().isEmpty(),
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    check('id').custom(existeSolicitudPorId),
    validarCampos,
], obtenerTareaPorIdSolicitud);

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

//crear una tarea en base a las solicitudes de los EA (solicitud aceptada)
router.post('/:id', [
    validarJWT,
    esJefeDeMantenimiento,
    check('id', 'El ID debe ser un numero').not().isEmpty(),
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    check('id').custom(existeSolicitudPorId),
    check('id').custom(SolicitudEstaPendiente), //debe estar pendiente para poder crear una tarea

    //descripcion de la tarea
    check('descripcion', 'La descripcion debe tener mas de 10 caracteres').optional().isLength({ min: 10 }),
    check('descripcion', 'La descripcion debe tener menos de 250 caracteres').optional().isLength({ max: 250 }),

    //prioridad
    check('prioridad', 'El ID debe ser un numero').optional().isNumeric(),
    check('prioridad', 'El ID debe ser un numero').optional().isInt(),
    check('prioridad', 'La prioridad debe ser un numero entre 1 y 3').optional().isInt({ min: 1, max: 3 }), // 1 (alta), 2 (media), 3 (baja)

    //id_responsable OPCIONAL
    check('id_responsable', 'El ID debe ser un numero').optional().isNumeric(),
    check('id_responsable', 'El ID debe ser un numero').optional().isInt(),
    check('id_responsable').optional().custom(existeEmpleadoPorId),
    validarCampos,
], crearTarea);






module.exports = router;