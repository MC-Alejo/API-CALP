const validarCampos   = require('../middlewares/validarCampos');
const validarCamposDeRoles  = require('../middlewares/validarRoles');
const validarJWT     = require('./validarJWT');



module.exports = {
    ...validarCampos,
    ...validarCamposDeRoles,
    ...validarJWT,
}