const { DataBase } = require("../models");

const obtenerSolicitudes = async (req, res) => {
    try {
        const { estado } = req.query;
        const db = new DataBase();
        
        if (estado) {
            if (estado === 'aceptada' || estado === 'rechazada' || estado === 'pendiente') {
                const solicitudes = await db.getSolicitudesPorEstado(estado);
                
                return res.status(200).json({
                    solicitudes
                });
            }
        }
        const solicitudes = await db.getSolicitudes();
        

        res.status(200).json({
            solicitudes
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al obtener las solicitudes'
        });
    }
}

const obtenerSolicitudesOrdenadas = async (req, res) => {
    try {
        const db = new DataBase();
        
        const solicitudes = await db.getSolicitudesOrdenadas();
        

        res.status(200).json({
            solicitudes
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al obtener las solicitudes'
        });
    }
}

const obtenerSolicitudesPorIdUsuario = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.query;
    try {
        const db = new DataBase();
        
        if (estado) {
            if (estado === 'aceptada' || estado === 'rechazada' || estado === 'pendiente') {
                const solicitudes = await db.getSolicitudesPorIdUsuario(id, estado);
                
                return res.status(200).json({
                    solicitudes
                });
            }
        }
        const solicitudes = await db.getSolicitudesPorIdUsuario(id);
        

        res.status(200).json({
            solicitudes
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al obtener las solicitudes'
        });
    }
}

const obtenerSolicitudesPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const db = new DataBase();
        
        const solicitudes = await db.getSolicitudPorId(id);
        

        res.status(200).json({
            solicitudes
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al obtener las solicitudes'
        });
    }
}

const obtenerTareaPorIdSolicitud = async (req, res) => {
    const { id } = req.params;

    try {
        const db = new DataBase();
        
        const tarea = await db.getTareaPorIdSolicitud(id);
        

        res.status(200).json({
            tarea
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al obtener la tarea'
        });
    }
}

const crearSolicitud = async (req, res) => {
    const { descripcion, id_equipamiento } = req.body;
    const { id } = req.usuario;

    try {
        const db = new DataBase();
        
        const solicitud = await db.crearSolicitud(
            descripcion,
            id_equipamiento,
            id,
        );

        

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
        
        await db.modificarEstadoSolicitud(id, 'rechazada');
        await db.setJuezSolicitud(id, req.usuario.id);
        

        

        res.status(200).json({
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
    const { descripcion = '', prioridad, id_responsable = null } = req.body;
    const { id } = req.params;

    try {
        const db = new DataBase();
        
        //modificar estado de la solicitud a aceptada
        await db.modificarEstadoSolicitud(id, 'aceptada');
        //setear el juez que acepto la solicitud
        await db.setJuezSolicitud(id, req.usuario.id);

        //creo la tarea en la bd
        const tarea = await db.crearTarea('en curso', null, descripcion, prioridad, id, id_responsable)

        

        res.status(201).json({
            tarea
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
    obtenerSolicitudes,
    obtenerSolicitudesOrdenadas,
    obtenerSolicitudesPorId,
    obtenerSolicitudesPorIdUsuario,
    obtenerTareaPorIdSolicitud,
    rechazarSolicitud,
}