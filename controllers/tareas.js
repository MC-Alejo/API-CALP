const { response } = require("express");
const { DataBase } = require("../models");

const actualizarTarea = async (req, res = response) => {
    const { id } = req.params;
    const { id_responsable, prioridad, descripcion = '' } = req.body;

    if (!id_responsable && !prioridad && !descripcion) {
        return res.status(400).json({ errors: [{ msg: 'Debe enviar al menos un campo para actualizar' }] })
    }

    try {
        if (descripcion !== '') {
            if (descripcion.length < 10) {
                return res.status(400).json({ errors: [{ msg: 'La descripcion debe tener mas de 10 caracteres' }] })
            }
            if (descripcion.length > 250) {
                return res.status(400).json({ errors: [{ msg: 'La descripcion debe tener menos de 250 caracteres' }] })
            }
        }

        if (prioridad) {
            if (prioridad < 1 || prioridad > 3) {
                return res.status(400).json({ errors: [{ msg: 'La prioridad debe ser un numero entre 1 y 3' }] })
            }
        }

        if (id_responsable) {
            const db = new DataBase();
            await db.connect();
            const resp = await db.getEmpleadoByID(id_responsable);
            if (!resp || !resp.estado) {
                await db.disconnect();
                return res.status(400).json({ errors: [{ msg: 'No existe un empleado con ese id' }] })
            }
            await db.disconnect();
        }

        const db = new DataBase();
        await db.connect();
        const tareaActualizada = await db.actualizarTarea(id, { id_responsable, prioridad, descripcion });
        await db.disconnect();

        return res.json({
            msg: 'Tarea actualizada correctamente',
            tareaActualizada
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Error al actualizar Tarea'
        })
    }
}

const finalizarTarea = async (req, res = response) => {
    const { id } = req.params;
    try {
        const db = new DataBase();
        await db.connect();
        const tareaFinalizada = await db.modificarEstadoTarea(id, 'finalizada');
        await db.disconnect();
        return res.json({
            msg: 'Tarea finalizada correctamente'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Error al finalizar Tarea'
        })
    }
}


module.exports = {
    actualizarTarea,
    finalizarTarea
}