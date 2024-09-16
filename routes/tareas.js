const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, esJefeDeMantenimiento, esGerente, esJuezEsGo } = require('../middlewares');

const { existeTareaPorId, tareaPorIdFinalizo, existeInventarioPorId, existeEmpleadoPorId, existeEquipamientoPorId, tareaTieneResponsable } = require('../helpers');

const {
    actualizarTarea,
    agregarInventarioATarea,
    cargarTareaDelJefe,
    finalizarTarea,
    obtenerInventarioDeTarea,
    obtenerTareaPorId,
    obtenerTareas,
    obtenerTareasMaquinaria,
    obtenerTareasOrdenadas,
    obtenerTareasPorJuez,
    obtenerTareasPorJuezOrdenadas,
    obtenerTarPorMaquiYJuezOrd
} = require('../controllers');


const router = Router();

//obtener todas las tareas
router.get('/', [
    validarJWT,
    esGerente,
    validarCampos,
], obtenerTareas);


//obtener las tareas ordenadas
router.get('/order', [
    validarJWT,
    esGerente,
    validarCampos,
], obtenerTareasOrdenadas);


//obtener una tarea por id de maquinaria
router.get('/maquinaria/:id', [
    validarJWT,
    esGerente,
    check('id', 'El ID debe ser un numero').not().isEmpty(),
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    check('id').custom(existeEquipamientoPorId),
    validarCampos,
], obtenerTareasMaquinaria);

//obtener una tarea por id
router.get('/:id', [
    validarJWT,
    esJefeDeMantenimiento,
    check('id', 'El ID debe ser un numero').not().isEmpty(),
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    validarCampos,
], obtenerTareaPorId);


//obtener todas las tareas de un juez (quien acepta, rechaza o finaliza la solicitud o tambien quien crea las tareas)
router.get('/juez/:id', [
    validarJWT,
    esJefeDeMantenimiento,
    check('id', 'El ID es obligatorio').not().isEmpty(),
    check('id', 'El ID no es un formato valido').isUUID(),
    validarCampos,
], obtenerTareasPorJuez);


//obtener las tareas ordenadas de un juez (quien acepta, rechaza o finaliza la solicitud o tambien quien crea las tareas)
router.get('/juez/:id/order', [
    validarJWT,
    esJefeDeMantenimiento,
    check('id', 'El ID es obligatorio').not().isEmpty(),
    check('id', 'El ID no es un formato valido').isUUID(),
    validarCampos,
], obtenerTareasPorJuezOrdenadas);


//obtener las tareas ordenadas de un juez (quien acepta, rechaza o finaliza la solicitud o tambien quien crea las tareas) que creó en dicha maquinaria
router.get('/juez/:id/order/maq/:equipamiento', [
    validarJWT,
    esJefeDeMantenimiento,
    check('id', 'El ID es obligatorio').not().isEmpty(),
    check('id', 'El ID no es un formato valido').isUUID(),

    check('equipamiento', 'El ID debe ser un numero').isNumeric(),
    check('equipamiento', 'El ID debe ser un numero').isInt(),
    check('equipamiento').custom(existeEquipamientoPorId),
    validarCampos,
], obtenerTarPorMaquiYJuezOrd);

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
  //check('prioridad', 'La prioridad es obligatoria').not().isEmpty(),
    check('id_responsable', 'El id_responsable es obligatorio').not().isEmpty(),

    check('id_equipamiento', 'El ID del equipamiento debe ser un numero').isNumeric(),
    check('id_equipamiento', 'El ID del equipamiento debe ser un numero').isInt(),
    check('id_equipamiento').custom(existeEquipamientoPorId),

    //descripcion de la solicitud
    check('desc_soli', 'La descripcion debe tener mas de 10 caracteres').optional().isLength({ min: 10 }),
    check('desc_soli', 'La descripcion debe tener menos de 250 caracteres').optional().isLength({ max: 250 }),
    
    //descripcion de la tarea
    check('descripcion', 'La descripcion debe tener mas de 10 caracteres').optional().isLength({ min: 10 }),
    check('descripcion', 'La descripcion debe tener menos de 250 caracteres').optional().isLength({ max: 250 }),

    //prioridad
    check('prioridad', 'El ID debe ser un numero').optional().isNumeric(),
    check('prioridad', 'El ID debe ser un numero').optional().isInt(),
    check('prioridad', 'La prioridad debe ser un numero entre 1 y 3').optional().isInt({ min: 1, max: 3 }), // 1 (alta), 2 (media), 3 (baja)

    //estado
    check('estado', 'El estado no es un estado valido').optional().isIn(['en curso', 'finalizada']),

    //id_responsable //TODO: DOCUMENTAR
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
    check('id').custom(tareaPorIdFinalizo),
    validarCampos,
    esJuezEsGo,
], actualizarTarea);

//finalizar tarea
router.patch('/:id', [
    validarJWT,
    esJefeDeMantenimiento,
    check('id', 'El ID debe ser un numero').not().isEmpty(),
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    check('id').custom(tareaTieneResponsable),
    validarCampos,
    esJuezEsGo,
], finalizarTarea);

//agregar inventario a tarea
router.post('/:id', [
    validarJWT,
    esJefeDeMantenimiento,
    check('id', 'El ID debe ser un numero').not().isEmpty(),
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    check('id').custom(tareaPorIdFinalizo),

    check('id_inventario', 'El ID de inventario debe ser un numero').not().isEmpty(),
    check('id_inventario', 'El ID de inventario debe ser un numero').isNumeric(),
    check('id_inventario', 'El ID de inventario debe ser un numero').isInt(),
    check('id_inventario').custom(existeInventarioPorId),

    check('cantidad', 'La cantidad debe ser un numero').not().isEmpty(),
    check('cantidad', 'La cantidad debe ser un numero').isNumeric(),
    check('cantidad', 'La cantidad debe ser un numero').isInt(),
    check('cantidad', 'La cantidad debe mayor a 0').isInt({ gt: 0 }),
    validarCampos,
    esJuezEsGo,
], agregarInventarioATarea)

module.exports = router;