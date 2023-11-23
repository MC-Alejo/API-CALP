const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, esJefeDeMantenimiento, esGerente } = require('../middlewares');

const { existeTareaPorId, existeInventarioPorId, existeEmpleadoPorId } = require('../helpers');

const {
    actualizarTarea,
    finalizarTarea,
    agregarInventarioATarea,
    obtenerTareas,
    obtenerTareaPorId,
    obtenerTareasPorJuez,
    cargarTareaDelJefe,
    obtenerInventarioDeTarea
} = require('../controllers');

const router = Router();

//obtener todas las tareas
router.get('/', [
    validarJWT,
    esGerente,
    validarCampos,
], obtenerTareas);

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

//obtener inventario de una tarea
router.get('/:id/inventario', [
    validarJWT,
    esJefeDeMantenimiento,
    check('id', 'El ID debe ser un numero').not().isEmpty(),
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    check('id').custom(existeTareaPorId),
    validarCampos,
], obtenerInventarioDeTarea);

//cargar tarea cargada propia del jefe de mantenimiento
router.post('/', [
    validarJWT,
    esJefeDeMantenimiento,
    check('prioridad', 'La prioridad es obligatoria').not().isEmpty(),
    check('id_responsable', 'El id_responsable es obligatorio').not().isEmpty(),

    //descripcion
    check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
    check('descripcion', 'La descripcion debe tener mas de 10 caracteres').isLength({ min: 10 }),
    check('descripcion', 'La descripcion debe tener menos de 250 caracteres').isLength({ max: 250 }),

    //prioridad
    check('prioridad', 'El ID debe ser un numero').isNumeric(),
    check('prioridad', 'El ID debe ser un numero').isInt(),
    check('prioridad', 'La prioridad debe ser un numero entre 1 y 3').isInt({ min: 1, max: 3 }), // 1 (alta), 2 (media), 3 (baja)

    //id_responsable
    check('id_responsable', 'El ID debe ser un numero').isNumeric(),
    check('id_responsable', 'El ID debe ser un numero').isInt(),
    check('id_responsable').custom(existeEmpleadoPorId),

    validarCampos,
], cargarTareaDelJefe)

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