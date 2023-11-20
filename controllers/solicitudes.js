const { DataBase } = require("../models");


const crearSolicitud = async (req, res) => {
    const { descripcion, id_equipamiento } = req.body;
    const { id } = req.usuario;

    try {
        const db = new DataBase();
        await db.connect();
        const solicitud = await db.crearSolicitud(
            descripcion,
            id_equipamiento,
            id,
        );

        await db.disconnect();

        res.status(201).json({
            solicitud
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al crear la solicitud'
        });
    }
}

const rechazarSolicitud = async (req, res) => {
    const { id } = req.params;

    try {
        const db = new DataBase();
        await db.connect();
        await db.modificarEstadoSolicitud(id, 'rechazada');
        await db.setJuezSolicitud(id, req.usuario.id);
        await db.disconnect();

        await db.disconnect();

        res.status(201).json({
            msg: 'La solicitud se rechazo correctamente'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al actualizar la solicitud'
        });
    }
}


module.exports = {
    crearSolicitud,
    rechazarSolicitud
}