const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, esEncargadoDeArea, esJefeDeMantenimiento } = require('../middlewares');

const { crearSolicitud, rechazarSolicitud } = require('../controllers/solicitudes');
const { existeEquipamientoPorId, existeSolicitudPorId } = require('../helpers');


const router = Router();

// crear una solicitud
//TODO: continuar con el endpoint
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


router.delete('/:id', [ //rechazar solicitud
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esJefeDeMantenimiento,
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    check('id').custom(existeSolicitudPorId),

    validarCampos,
], rechazarSolicitud);





module.exports = router;