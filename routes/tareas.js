const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, esJefeDeMantenimiento, esGerente } = require('../middlewares');

const { existeTareaPorId, existeInventarioPorId } = require('../helpers');

const {
    actualizarTarea,
    finalizarTarea,
    agregarInventarioATarea,
    obtenerTareas,
    obtenerTareaPorId,
    obtenerTareasPorJuez
} = require('../controllers');

const router = Router();

//obtener todas las tareas
router.get('/', [
    validarJWT,
    esGerente,
    validarCampos,
], obtenerTareas);

//TODO: documentar los siguientes endpoints y  ojo, acordarse de que se puede filtrar por estado y prioridad tambien
//obtener una tarea por id
router.get('/:id', [
    validarJWT,
    esJefeDeMantenimiento,
    check('id', 'El ID debe ser un numero').not().isEmpty(),
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    validarCampos,
], obtenerTareaPorId);

//obtener tareas por juez (quien acepta, rechaza o finaliza la solicitud)
router.get('/juez/:id', [
    validarJWT,
    esJefeDeMantenimiento,
    check('id', 'El ID es obligatorio').not().isEmpty(),
    check('id', 'El ID no es un formato valido').isUUID(),
    validarCampos,
], obtenerTareasPorJuez);

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

//agregar inventario a tarea
router.post('/:id', [
    validarJWT,
    esJefeDeMantenimiento,
    check('id', 'El ID debe ser un numero').not().isEmpty(),
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    check('id').custom(existeTareaPorId),

    check('id_inventario', 'El ID de inventario debe ser un numero').not().isEmpty(),
    check('id_inventario', 'El ID de inventario debe ser un numero').isNumeric(),
    check('id_inventario', 'El ID de inventario debe ser un numero').isInt(),
    check('id_inventario').custom(existeInventarioPorId),

    check('cantidad', 'La cantidad debe ser un numero').not().isEmpty(),
    check('cantidad', 'La cantidad debe ser un numero').isNumeric(),
    check('cantidad', 'La cantidad debe ser un numero').isInt(),
    check('cantidad', 'La cantidad debe mayor a 0').isInt({ gt: 0 }),
    validarCampos,
], agregarInventarioATarea)

module.exports = router;