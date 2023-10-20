const { DataBase } = require("../models");

const crearEmpleado = async (req, res) => {
    const { nombre, email } = req.body;
    try {
        const db = new DataBase();
        await db.connect();
        const { estado, ...empleado } = await db.crearEmpleado(nombre, email);
        await db.disconnect();

        res.status(201).json({
            empleado
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            errors: [{
                msg: 'Error en el servidor. Hable con el administrador'
            }]
        });
    }
}

const actualizarEmpleado = async (req, res) => {
    const { id } = req.params;
    const { nombre, email } = req.body;

    if (!nombre && !email) {
        return res.status(400).json({
            errors: [{
                msg: 'Debe enviar al menos un campo para actualizar'
            }]
        })
    }

    if (nombre) {
        if (nombre.length < 2 || nombre.length > 65) {
            return res.status(400).json({
                errors: [{
                    msg: 'El nombre debe tener entre 2 y 65 caracteres'
                }]
            })
        }
    }


    try {

        if (email) {
            //validar si es un email valido
            const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/

            if (!regex.test(email)) {
                return res.status(400).json({
                    errors: [{
                        msg: 'El email ingresado no es valido'
                    }]
                })
            }
            const db = new DataBase();
            await db.connect();

            const resp = await db.getEmpleadoByCorreo(email);
            if (resp) {
                await db.disconnect();
                return res.status(400).json({
                    errors: [{
                        msg: 'El email ingresado ya existe en la BD'
                    }]
                });
            }
            await db.disconnect();
        }

        const db = new DataBase();
        await db.connect();

        const { estado, ...empleado } = await db.actualizarEmpleado(id, { nombre, email });

        await db.disconnect();

        res.json({
            msg: 'Empleado actualizado correctamente',
            empleado
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            errors: [{
                msg: 'Error en el servidor. Hable con el administrador'
            }]
        });
    }
}


const eliminarEmpleado = async (req, res) => {
    const { id } = req.params;
    try {
        const db = new DataBase();
        await db.connect();
        await db.eliminarEmpleado(id);
        await db.disconnect();

        res.json({
            msg: 'Empleado eliminado correctamente'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            errors: [{
                msg: 'Error en el servidor. Hable con el administrador'
            }]
        });
    }
}

module.exports = {
    actualizarEmpleado,
    crearEmpleado,
    eliminarEmpleado
}
