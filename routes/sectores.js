const {Router} = require ('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, esJefeDeMantenimiento } = require('../middlewares');

const { existeSectorPorId} = require('../helpers');

const { crearEquipamientoSector, actualizarSector, bajaSector } = require('../controllers');

const router = Router();

//Obtener los sectores:

// Actualizar sector (nombre o area a la que pertenece)
router.put('/:id', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esJefeDeMantenimiento,
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    check('id').custom( existeSectorPorId ),
    validarCampos
], actualizarSector);


//eliminar sector (Baja sector)
router.delete('/:id', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esJefeDeMantenimiento,
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    check('id').custom( existeSectorPorId ),
    validarCampos
], bajaSector);


//agregar equipamiento de un sector:
router.post('/:id', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esJefeDeMantenimiento,
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    check('id').custom( existeSectorPorId ),
    //input de equipamiento
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre', 'El nombre debe de tener mas de 3 caracteres').isLength({min: 3}),
    check('nombre', 'El nombre puede tener hasta 65 caracteres').isLength({max: 65}),
    validarCampos
], crearEquipamientoSector);



module.exports = router;