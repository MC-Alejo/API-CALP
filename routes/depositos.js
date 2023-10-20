const { Router } = require('express');
const { check } = require('express-validator');


const { validarCampos, validarJWT, esGerente, esJefeDeMantenimiento } = require('../middlewares');

const { existeNombreDeposito, existeDepositoPorId, existeInventarioPorNombre } = require('../helpers');

const { crearDeposito, actualizarDeposito, agregarAInventario } = require('../controllers');


const router = Router();

//TODO: DOCUMENTAR ESTO EN EL DRIVE
// Crear Deposito
router.post('/', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esGerente,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre', 'El nombre no es un nombre valido').isString(),
    check('nombre', 'El nombre debe tener minimo 2 caracteres').isLength({ min: 2 }),
    check('nombre', 'El nombre no puede tener mas de 46 caracteres').isLength({ max: 65 }),
    check('nombre').custom(existeNombreDeposito),
    validarCampos,
], crearDeposito);


// Actualizar Deposito
router.put('/:id', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esGerente,
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    check('id').custom(existeDepositoPorId),

    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre', 'El nombre no es un nombre valido').isString(),
    check('nombre', 'El nombre debe tener minimo 2 caracteres').isLength({ min: 2 }),
    check('nombre', 'El nombre no puede tener mas de 46 caracteres').isLength({ max: 65 }),
    check('nombre').custom(existeNombreDeposito),
    validarCampos,
], actualizarDeposito);

// Agregar Inventario a deposito
router.post('/:id', [
    //VALIDACIONES DEL ENDPOINT
    validarJWT,
    esJefeDeMantenimiento,
    check('id', 'El ID debe ser un numero').isNumeric(),
    check('id', 'El ID debe ser un numero').isInt(),
    check('id').custom(existeDepositoPorId),

    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre', 'El nombre no es un nombre valido').isString(),
    check('nombre', 'El nombre debe tener minimo 2 caracteres').isLength({ min: 2 }),
    check('nombre', 'El nombre no puede tener mas de 46 caracteres').isLength({ max: 65 }),
    check('nombre').custom(existeInventarioPorNombre),

    check('stock', 'El stock es obligatorio').not().isEmpty(),
    check('stock', 'El stock debe ser un numero').isNumeric(),
    check('stock', 'El stock debe ser un numero').isInt(),
    check('stock', 'El stock debe ser un numero mayor a 0').isInt({ gt: 0 }),
    check('stock', 'El stock debe ser un numero menor a 1000000000').isInt({ lt: 1000000000 }),

    validarCampos,
], agregarAInventario);


module.exports = router;