const { Router } = require('express');
const { check } = require('express-validator');


const { validarCampos, validarJWT, esGerente } = require('../middlewares');
const { validarCamposDeRoles } = require('../middlewares');

const { validarEmailExiste, validarIdUsuario, areaYaAsignada, existeAreaPorId } = require('../helpers/dbValidators');

const {
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    actualizarAreaDelEncargado,
    demitirAreaAEncargado,
    obtenerUsuarios,
    obtenerUsuarioPorID,
} = require('../controllers');


const router = Router();

//ruta para obtener todos los usuarios / filtrar por correo
router.get('/', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esGerente,
    validarCampos
], obtenerUsuarios)

//ruta para obtener un usuario por id
router.get('/:id', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esGerente,
    check('id', 'El formato del ID no es valido').isUUID(),
    validarCampos
], obtenerUsuarioPorID)

//ruta para crear un usuario
router.post('/', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esGerente,
    // sanitizamos los campos utilizando el express-validator para que no involucren inyecciones sql ni de javascript
    check('nombre').escape().trim(),
    check('apellido').escape().trim(),
    check('email').escape().trim(),

    check('email', 'El correo es obligatorio').not().isEmpty(), // el correo no debe estar vacio
    check('email', 'El correo ingresado, no es un correo valido').isEmail(), // el correo debe ser un correo valido
    check('email').custom(validarEmailExiste), // el correo debe ser unico en la BD

    check('password', 'El password es obligatorio').not().isEmpty(), // el password no debe estar vacio
    check('password', 'El password es obligatorio').isLength({ min: 6 }), // el password debe tener minimo 6 caracteres

    check('nombre', 'El nombre es obligatorio').not().isEmpty(), // el nombre no debe estar vacio
    check('nombre', 'El nombre debe ser un string').isString(), // el nombre debe ser un string
    check('nombre', 'El nombre debe tener minimo 2 caracteres').isLength({ min: 2 }), // el nombre debe tener minimo 2 caracteres
    check('nombre', 'El nombre debe tener maximo 46 caracteres').isLength({ max: 46 }), // el nombre debe tener maximo 46 caracteres

    check('apellido', 'El apellido es obligatorio').not().isEmpty(), // el apellido no debe estar vacio
    check('apellido', 'El apellido debe ser un string').isString(), // el apellido debe ser un string
    check('apellido', 'El apellido debe tener minimo 2 caracteres').isLength({ min: 2 }), // el apellido debe tener minimo 2 caracteres
    check('apellido', 'El apellido debe tener maximo 46 caracteres').isLength({ max: 46 }), // el apellido debe tener maximo 46 caracteres

    check('rol', 'El rol es obligatorio').not().isEmpty(), // el rol no debe estar vacio
    check('rol', 'El rol debe ser un string').isString(), // el rol debe ser un string
    check('rol', 'El rol debe tener 2 caracteres').isLength({ min: 2, max: 2 }), // el rol debe tener minimo y un maximo de 2 caracteres
    check('rol', 'El rol debe ser un rol valido').isIn(['GO', 'JM', 'EA']), // el rol debe ser un rol valido GO (Gerente operativo), JM (Jefe de mantenimiento), EA (Encargado de area)
    validarCamposDeRoles, // si el rol es JM o EA, se debe enviar el id del deposito o del area respectivamente

    validarCampos // si hay algun error en las validaciones anteriores, se detiene la ejecucion y se devuelve el error con la siguiente referencia al middleware
], crearUsuario);


//ruta para actualizar un usuario
router.put('/:id', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esGerente,
    check('id', 'El formato del ID no es valido').isUUID(),
    check('id').custom(validarIdUsuario), // el id debe ser un id valido de un usuario en la BD
    check('nombre').escape().trim(),
    check('apellido').escape().trim(),
    check('email').escape().trim(),
    validarCampos
], actualizarUsuario);


//ruta para dar de baja un usuario
router.delete('/:id', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esGerente,
    check('id', 'El formato del ID no es valido').isUUID(),
    check('id').custom(validarIdUsuario),
    validarCampos
], eliminarUsuario);


//ruta para actualizar el area de un encargado
router.put('/areas/:id', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esGerente,
    check('id', 'El formato del ID no es valido').isUUID(),
    check('id').custom(validarIdUsuario), // el id debe ser un id valido de un usuario en la BD
    check('id_area', 'El ID debe ser un numero').isNumeric(),
    check('id_area', 'El ID debe ser un numero').isInt(),
    check('id_area').custom(existeAreaPorId),
    check('id_area').custom(areaYaAsignada),
    validarCampos
], actualizarAreaDelEncargado);

router.delete('/areas/:id', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esGerente,
    check('id', 'El formato del ID no es valido').isUUID(),
    check('id').custom(validarIdUsuario), // el id debe ser un id valido de un usuario en la BD
    validarCampos
], demitirAreaAEncargado);

module.exports = router;