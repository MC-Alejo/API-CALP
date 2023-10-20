const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, esJefeDeMantenimiento } = require('../middlewares');

const { correoEmpleadoExiste, existeEmpleadoPorId } = require('../helpers');

const { crearEmpleado, actualizarEmpleado, eliminarEmpleado } = require('../controllers');

const router = Router();


//crear empleado
router.post('/', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esJefeDeMantenimiento,

    // validaciones del body
    check('nombre').escape().trim(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre', 'El nombre debe ser un string').isString(),
    check('nombre', 'El nombre debe tener minimo 2 caracteres').isLength({ min: 2 }),
    check('nombre', 'El nombre debe tener maximo 46 caracteres').isLength({ max: 65 }),

    check('email').escape().trim(),
    check('email', 'El correo es obligatorio').not().isEmpty(),
    check('email', 'El correo ingresado, no es un correo valido').isEmail(),
    check('email').custom(correoEmpleadoExiste),
    validarCampos,
], crearEmpleado);

// actualizar empleado
router.put('/:id', [
    validarJWT,
    esJefeDeMantenimiento,
    check('id', 'El ID es obligatorio').not().isEmpty(),
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    check('id').custom(existeEmpleadoPorId),
    validarCampos,
], actualizarEmpleado);

//eliminar empleado
router.delete('/:id', [
    validarJWT,
    esJefeDeMantenimiento,
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    check('id').custom(existeEmpleadoPorId),
    validarCampos,
], eliminarEmpleado);



module.exports = router;