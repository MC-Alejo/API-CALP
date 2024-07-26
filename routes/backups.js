const { Router } = require("express");
const { check } = require("express-validator");

const { getBackups, postBackup, setBackupAuto } = require("../controllers");

const { validarCampos, validarJWT, esGerente } = require("../middlewares");

const router = Router();


router.get("/", [validarJWT, esGerente, validarCampos], getBackups);

router.post("/", [
    validarJWT,
    esGerente,
    check('password', 'Para el proceso de backup es necesario proporcionar la contraseña de su usuario').not().isEmpty(), // el password no debe estar vacio
    check('password', 'Porfavor ingrese una contraseña valida').isLength({min: 6}), // el password debe tener minimo 6 caracteres
    validarCampos
], postBackup);

//para el backup automatico:
router.post("/:frequency", [
    validarJWT,
    esGerente,
    //frec
    check('frequency', 'Es necesario proporcionar una frecuencia para el backup automatico').not().isEmpty(),
    check('frequency', 'la frecuencia ingresada no es valida').isIn(['d','w','m','n']), // d=diary, w=weekly, m=monthly, n=none

    check('password', 'Para el proceso de backup es necesario proporcionar la contraseña de su usuario').not().isEmpty(), // el password no debe estar vacio
    check('password', 'Porfavor ingrese una contraseña valida').isLength({min: 6}), // el password debe tener minimo 6 caracteres
    validarCampos
], setBackupAuto);

module.exports = router;
