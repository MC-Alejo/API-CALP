const {Router} = require ('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares'); 
const { login } = require('../controllers');


const router = Router();

//ruta para loguearse
router.post('/login', [
    //VALIDACIONES DEL ENDPOINT
    check('email', 'El correo es obligatorio').not().isEmpty(), // el correo no debe estar vacio
    check('email', 'El correo ingresado, no es un correo valido').isEmail(), // el correo debe ser un correo valido
    check('password', 'El password es obligatorio').not().isEmpty(), // el password no debe estar vacio
    check('password', 'El password es obligatorio').isLength({min: 6}), // el password debe tener minimo 6 caracteres
    validarCampos
], login);




module.exports = router;