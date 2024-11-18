const { Router } = require("express");
const { check } = require("express-validator");

const {
  validarCampos,
  validarJWT,
  esJefeDeMantenimiento,
} = require("../middlewares");

const {
  existeEquipamientoPorId,
  validarFecha,
  existeEmpleadoPorId,
} = require("../helpers");

const {
  actualizarEquipamiento,
  bajaEquipamiento,
  cargarAlarma,
  obtenerAlarmaDeEquipamiento,
  obtenerEquipamientoPorId,
  obtenerEquipamientos,
  obtenerAlarmaDeJuezMaquinaria,
} = require("../controllers");
const router = Router();

//obtener todos los equipamientos
router.get(
  "/",
  [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esJefeDeMantenimiento,
    validarCampos,
  ], obtenerEquipamientos);

//obtener maquinaria por id
router.get(
  "/:id",
  [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esJefeDeMantenimiento,
    check("id", "El ID debe ser un numero").isNumeric(),
    check("id", "El ID debe ser un numero").isInt(),
    check("id").custom(existeEquipamientoPorId),
    validarCampos,
  ], obtenerEquipamientoPorId);


router.get('/:id/alarmas', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esJefeDeMantenimiento,
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    check('id').custom(existeEquipamientoPorId),
    validarCampos,
], obtenerAlarmaDeEquipamiento);


// obtener la alarma de una maquinaria segun el juez
router.get('/:id/alarmas/juez/:id_juez', [
  //VALIDACIONES DEL ENDPOINT
  validarJWT,
  esJefeDeMantenimiento,
  check('id', 'El ID debe ser un numero').isNumeric(),
  check('id', 'El ID debe ser un numero').isInt(),
  check('id').custom(existeEquipamientoPorId),

  check('id_juez', 'El ID es obligatorio').not().isEmpty(),
  check('id_juez', 'El ID no es un formato valido').isUUID(),

  validarCampos,
], obtenerAlarmaDeJuezMaquinaria);


//Actualizar equipamiento (nombre y sector al que pertenece)
router.put(
  "/:id",
  [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esJefeDeMantenimiento,
    check("id", "El ID debe ser un numero").isNumeric(),
    check("id", "El ID debe ser un numero").isInt(),
    check("id").custom(existeEquipamientoPorId),
    validarCampos,
  ], actualizarEquipamiento);

//Dar de baja equipamiento de un sector
router.delete(
  "/:id",
  [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esJefeDeMantenimiento,
    check("id", "El ID debe ser un numero").isNumeric(),
    check("id", "El ID debe ser un numero").isInt(),
    check("id").custom(existeEquipamientoPorId),
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

    check('fecha', 'La fecha de alarma es obligatoria').not().isEmpty(),
    check('fecha', 'El formato de la fecha no es valido').isDate(),
    check('fecha').custom(validarFecha),

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


    //id_responsable
    check('id_responsable', 'El ID debe ser un numero').isNumeric(),
    check('id_responsable', 'El ID debe ser un numero').isInt(),
    check('id_responsable').custom(existeEmpleadoPorId),

    validarCampos,
], cargarAlarma);

module.exports = router;
