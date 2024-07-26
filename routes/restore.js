const { Router } = require("express");
const { check } = require("express-validator");

const { realizarRestore } = require("../controllers");
const { validarCampos, validarJWT, esGerente } = require("../middlewares");
const { validarExisteArchivo } = require("../helpers");

const router=Router();


router.post('/',[
    validarJWT,
    esGerente,
    check('password', 'Para el proceso de restauración es necesario proporcionar la contraseña de su usuario').not().isEmpty(), // el password no debe estar vacio
    check('password', 'Porfavor ingrese una contraseña valida').isLength({min: 6}), // el password debe tener minimo 6 caracteres
    
    //el id del backup 
    check('id', 'El id del punto de restauración es necesario').not().isEmpty(),
    check('id', 'El id del punto de restauración debe ser una cadena de caracteres').isString(),
    check('id').custom(validarExisteArchivo),
    validarCampos
], realizarRestore);


module.exports=router;