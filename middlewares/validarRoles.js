const { response } = require('express');
const { DataBase } = require('../models');


const validarCamposDeRoles = async (req, res = response, next) => {
    const { rol, id_area, id_deposito } = req.body;

    try {

        if (rol === 'EA') {
            //validamos si el id_area viene en el body
            if (!id_area) {
                return res.status(400).json({
                    errors: [{
                        msg: 'El id del area es obligatorio'
                    }]
                });
            }

            //verificamos si el id_area es numerico
            if (isNaN(id_area) || typeof id_area !== 'number') {
                return res.status(400).json({
                    errors: [{
                        msg: 'El id del area debe ser numerico'
                    }]
                });
            }

            // verificamos si el id_area existe en la BD
            const db = new DataBase();
            
            const resp = await db.getAreaPorId(id_area);
            if (!resp || !resp.estado) {
                
                return res.status(400).json({
                    errors: [{
                        msg: 'El id del area no existe en la BD'
                    }]
                });
            }

            //Verificar si el area ya tiene un encargado
            const encargado = await db.validarAreaDefinida(id_area);
            if (encargado) {
                
                return res.status(400).json({
                    errors: [{
                        msg: 'El area ya tiene un encargado'
                    }]
                });
            }

            
        }

        if (rol === 'JM') {
            // validamos si el id_deposito viene en el body
            if (!id_deposito) {
                return res.status(400).json({
                    errors: [{
                        msg: 'El id del deposito es obligatorio'
                    }]
                });
            }

            // verificamos si el id_deposito es numerico
            if (isNaN(id_deposito) || typeof id_deposito !== 'number') {
                return res.status(400).json({
                    errors: [{
                        msg: 'El id del deposito debe ser numerico'
                    }]
                });
            }

            // Verificamos si el id_deposito existe en la BD
            const db = new DataBase();
            
            const resp = await db.getDepositoPorId(id_deposito);
            if (!resp) {
                
                return res.status(400).json({
                    errors: [{
                        msg: 'El id del deposito no existe en la BD'
                    }]
                });
            }

            //verificar si el deposito ya tiene un jefe
            const jefe = await db.validarJefeDefinido(id_deposito);
            if (jefe) {
                
                return res.status(400).json({
                    errors: [{
                        msg: 'El deposito ya tiene un jefe'
                    }]
                });
            }

            
        }

        next();
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errors: [{
                msg: 'Error en el servidor. Hable con el administrador'
            }]
        });
    }


}


const esGerente = async (req, res = response, next) => {
    if (!req.usuario) {
        //server error porque no atrape bien el token
        return res.status(500).json({
            errors: [{
                msg: 'Se quiere verificar el rol sin validar el token primero'
            }]
        });
    }

    if (!req.usuario.rol || req.usuario.rol !== 'GO') {
        //verificamos que venga el rol con la request y que sea el correcto
        return res.status(401).json({
            errors: [{
                msg: 'Usted no tiene permisos para realizar esta acción'
            }]
        });
    }

    next();
}

const esJefeDeMantenimiento = async (req, res = response, next) => {
    if (!req.usuario) {
        //server error porque no atrape bien el token
        return res.status(500).json({
            errors: [{
                msg: 'Se quiere verificar el rol sin validar el token primero'
            }]
        });
    }

    if (req.usuario.rol === 'JM' || req.usuario.rol === 'GO') {
        return next();
    }

    return res.status(401).json({
        errors: [{
            msg: 'Usted no tiene permisos para realizar esta acción'
        }]
    });
}

const esEncargadoDeArea = async (req, res = response, next) => {
    if (!req.usuario) {
        //server error porque no atrape bien el token
        return res.status(500).json({
            errors: [{
                msg: 'Se quiere verificar el rol sin validar el token primero'
            }]
        });
    }

    if (req.usuario.rol === 'EA') {
        const db = new DataBase();
        

        const tieneAreaACargo = await db.getAreaDelUsuario(req.usuario.id)
        if (!tieneAreaACargo) {
            return res.status(401).json({
                errors: [{
                    msg: 'Usted no tiene permisos para realizar esta acción'
                }]
            });
        }

        return next();
    }

    if (req.usuario.rol === 'GO') {
        return next();
    }

    return res.status(401).json({
        errors: [{
            msg: 'Usted no tiene permisos para realizar esta acción'
        }]
    });
}

const esUnRolValido = async (req, res = response, next) => {
    if (!req.usuario) {
        //server error porque no atrape bien el token
        return res.status(500).json({
            errors: [{
                msg: 'Se quiere verificar el rol sin validar el token primero'
            }]
        });
    }

    if (req.usuario.rol === 'EA') {
        const db = new DataBase();
        

        const tieneAreaACargo = await db.getAreaDelUsuario(req.usuario.id)
        if (!tieneAreaACargo) {
            return res.status(401).json({
                errors: [{
                    msg: 'Usted no tiene permisos para realizar esta acción'
                }]
            });
        }

        return next();
    }

    if (req.usuario.rol === 'JM' || req.usuario.rol === 'GO') {
        return next();
    }

    return res.status(401).json({
        errors: [{
            msg: 'Usted no tiene permisos para realizar esta acción'
        }]
    });
}

module.exports = {
    esEncargadoDeArea,
    esGerente,
    esJefeDeMantenimiento,
    esUnRolValido,
    validarCamposDeRoles,
}