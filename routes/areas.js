const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, esJefeDeMantenimiento, esGerente } = require('../middlewares');

const { existeAreaPorId, existeNombreArea } = require('../helpers');

const {
    crearArea,
    crearSector,
    actualizarNombreArea,
    eliminarArea,
    obtenerAreaPorIdUsuario,
    obtenerAreas,
    obtenerArea,
    obtenerSectoresPorIdArea
} = require('../controllers');



const router = Router();

//obtener todas las areas
router.get('/', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esJefeDeMantenimiento,
    validarCampos
], obtenerAreas)

//obtener area por id
router.get('/:id', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esJefeDeMantenimiento,
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    check('id').custom(existeAreaPorId),
    validarCampos
], obtenerArea)

//obtener area de un EA
router.get('/usr/:id', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    check('id', 'El ID ingresado no es un formato valido').isUUID(),
    validarCampos
], obtenerAreaPorIdUsuario);

//obtener los sectores de un area
router.get('/:id/sectores', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    check('id').custom(existeAreaPorId),
    validarCampos
], obtenerSectoresPorIdArea)

//crear un area
router.post('/', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esGerente,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre', 'El nombre debe de tener mas de 3 caracteres').isLength({ min: 3 }),
    check('nombre', 'El nombre puede tener hasta 65 caracteres').isLength({ max: 65 }),
    check('nombre').custom(existeNombreArea),
    validarCampos
], crearArea);


//Actualizar un area
router.put('/:id', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esGerente,
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    check('id').custom(existeAreaPorId),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre', 'El nombre debe de tener mas de 3 caracteres').isLength({ min: 3 }),
    check('nombre', 'El nombre puede tener hasta 65 caracteres').isLength({ max: 65 }),
    check('nombre').custom(existeNombreArea),
    validarCampos
], actualizarNombreArea);

//Eliminar un area
router.delete('/:id', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esGerente,
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    check('id').custom(existeAreaPorId),
    validarCampos
], eliminarArea);

//crear un sector en un area
router.post('/:id', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esGerente,
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    check('id').custom(existeAreaPorId),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre', 'El nombre debe de tener mas de 3 caracteres').isLength({ min: 3 }),
    check('nombre', 'El nombre puede tener hasta 65 caracteres').isLength({ max: 65 }),
    validarCampos
], crearSector);





module.exports = router;