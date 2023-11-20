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


const crearTarea = async (req, res) => {
    const { descripcion = '', prioridad, id_responsable } = req.body;
    const { id } = req.params;

    try {
        const db = new DataBase();
        await db.connect();
        //modificar estado de la solicitud a aceptada
        await db.modificarEstadoSolicitud(id, 'aceptada');
        //setear el juez que acepto la solicitud
        await db.setJuezSolicitud(id, req.usuario.id);

        //creo la tarea en la bd
        await db.crearTarea('en curso', descripcion, prioridad, id, id_responsable)

        await db.disconnect();

        res.status(201).json({
            msg: 'La solicitud se rechazo correctamente'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al crear la tarea'
        });
    }
}


module.exports = {
    crearSolicitud,
    crearTarea,
    rechazarSolicitud,
}