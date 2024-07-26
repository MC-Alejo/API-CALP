const { DataBase } = require("../models");

const obtenerEmpleados = async (req, res) => {
    try {
        const { correo, telefono } = req.query;

        const db = new DataBase();

        if (correo) {
            const resp = await db.getEmpleadoByCorreo(correo);

            if (!resp || resp.estado === false) return res.status(404).json({
                msg: "No se encontro un empleado con ese correo o el correo ingresado, no es un correo valido"
            });
            return res.json({
                empleado: {
                    id: resp.id,
                    nombre: resp.nombre,
                    email: resp.email,
                    telefono: resp.telefono
                }
            })
        }

        if (telefono) {
            const resp = await db.getEmpleadoByTelefono(telefono);

            if (!resp || resp.estado === false) return res.status(404).json({
                msg: "No se encontro un empleado con ese telefono o el telefono ingresado, no es un telefono valido"
            });
            return res.json({
                empleado: {
                    id: resp.id,
                    nombre: resp.nombre,
                    email: resp.email,
                    telefono: resp.telefono
                }
            })
        }
        const empleados = await db.getEmpleados();

        res.json({
            empleados
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

const obtenerEmpleadoById = async (req, res) => {
    try {
        const { id } = req.params;

        const db = new DataBase();

            const resp = await db.getEmpleadoByID(id);
    
        res.json({
            empleado: {
                id: resp.id,
                nombre: resp.nombre,
                email: resp.email,
                telefono: resp.telefono
            }
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

const capitalizarNombre = (nombre = '') =>{
    const nombres = nombre.trim().split(' ');

    const nombresCapitalizados = [];

    nombres.forEach(nom => {
        const nombreCapitalizado = nom[0].toUpperCase() + nom.slice(1).toLowerCase()
        nombresCapitalizados.push(nombreCapitalizado)
    });

    return nombresCapitalizados.join(' ');
}

const crearEmpleado = async (req, res) => {
    const { nombre, email, telefono } = req.body;
    try {
        const db = new DataBase();
        
        const { estado, ...empleado } = await db.crearEmpleado(capitalizarNombre(nombre), email.toLowerCase(), telefono);
        

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
    const { nombre, email, telefono } = req.body;

    if (!nombre && !email && !telefono) {
        return res.status(400).json({
            errors: [{
                msg: 'Debe enviar al menos un campo para actualizar'
            }]
        })
    }

    if (nombre) {
        if (nombre.trim().length < 2 || nombre.trim().length > 65) {
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
            

            const resp = await db.getEmpleadoByCorreo(email.toLowerCase());
            if (resp) {
                
                return res.status(400).json({
                    errors: [{
                        msg: 'El email ingresado ya existe en la BD'
                    }]
                });
            }
            
        }

        const db = new DataBase();
        
        const emple = { nombre: nombre ? capitalizarNombre(nombre) : null, email: email ? email.toLowerCase(): null, telefono }

        const { estado, ...empleado } = await db.actualizarEmpleado(id, emple);
        

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
        
        await db.eliminarEmpleado(id);
        

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
    eliminarEmpleado,
    obtenerEmpleadoById,
    obtenerEmpleados,
}
