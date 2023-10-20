const { response, request } = require('express');
const {validationResult} = require('express-validator'); // express-validator es un middleware que nos permite validar los datos que se envian por el body


const validarCampos = (req=request, res=response, next) => {
    const errors = validationResult(req); //se encarga de darnos un resultado luego de aplicar las validaciones
    if( !errors.isEmpty() ){
        return res.status(400).json(errors);
    }

    // si no hay errores, se ejecuta el next
    // next es para que se ejecute el siguiente middleware o si no hay mas middlewares, se ejecute el controlador
    next();
}

module.exports = {
    validarCampos
}