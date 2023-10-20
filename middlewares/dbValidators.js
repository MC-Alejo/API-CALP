const { response } = require('express');
const { DataBase } = require('../models');

const existeEquipamientoPorId = async(req=request, res=response, next) => {
    const {id,idEquipamiento} = req.params
    const db = new DataBase();
    await db.connect();
    const resp = await db.getEquipamientoPorId(parseInt(idEquipamiento));

    if (!resp || !resp.estado) {
        await db.disconnect();
        return res.status(400).json({errors:[{
            msg: 'No existe un equipamiento con ese id'
        }]});
    }

    if (resp.id_sector !== parseInt(id)) {
        await db.disconnect();
        return res.status(400).json({errors:[{
            msg: 'No existe un equipamiento con ese id en el sector'
        }]});
    }

    await db.disconnect();
    // si no hay errores, se ejecuta el next
    // next es para que se ejecute el siguiente middleware o si no hay mas middlewares, se ejecute el controlador
    next();
}


module.exports = {
    existeEquipamientoPorId,
}