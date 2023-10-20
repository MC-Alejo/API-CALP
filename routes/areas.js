const {Router} = require ('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, esJefeDeMantenimiento } = require('../middlewares');

const { existeAreaPorId, existeSectorPorId, existeNombreArea } = require('../helpers');

const { crearArea, crearSector, crearEquipamientoSector, actualizarNombreArea, eliminarUsuario, eliminarArea } = require('../controllers');



const router = Router();

//obtener todas las areas

//ruta para agregar un area ???? esto realmente lo puede crear un gerente de area?
router.post('/', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esJefeDeMantenimiento,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre', 'El nombre debe de tener mas de 3 caracteres').isLength({min: 3}),
    check('nombre', 'El nombre puede tener hasta 65 caracteres').isLength({max: 65}),
    check('nombre').custom( existeNombreArea ),
    validarCampos
], crearArea);


//Actualizar un area
router.put('/:id', [
     //VALIDACIONES DEL ENDPOINT
     validarJWT,
     esJefeDeMantenimiento,
     check('id', 'El ID debe ser un numero').isNumeric(),
     check('id', 'El ID debe ser un numero').isInt(),
     check('id').custom( existeAreaPorId ),
     check('nombre', 'El nombre es obligatorio').not().isEmpty(),
     check('nombre', 'El nombre debe de tener mas de 3 caracteres').isLength({min: 3}),
     check('nombre', 'El nombre puede tener hasta 65 caracteres').isLength({max: 65}),
     check('nombre').custom( existeNombreArea ),
     validarCampos
], actualizarNombreArea);

//Eliminar un area
 router.delete('/:id', [
     //VALIDACIONES DEL ENDPOINT
     validarJWT,
     esJefeDeMantenimiento,
     check('id', 'El ID debe ser un numero').isNumeric(),
     check('id', 'El ID debe ser un numero').isInt(),
     check('id').custom( existeAreaPorId ),
     validarCampos
], eliminarArea);

//crear un sector en un area
router.post('/:id', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esJefeDeMantenimiento,
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    check('id').custom( existeAreaPorId ),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre', 'El nombre debe de tener mas de 3 caracteres').isLength({min: 3}),
    check('nombre', 'El nombre puede tener hasta 65 caracteres').isLength({max: 65}),
    validarCampos
], crearSector);





module.exports = router;