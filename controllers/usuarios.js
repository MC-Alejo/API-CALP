const { request, response } = require("express");
const bcryptjs = require('bcryptjs');
const { DataBase } = require("../models");
const { v4: uuidv4 } = require('uuid');
const { obtenerRol } = require("../helpers");


const crearUsuario = async (req = request, res = response) => {

    try {
        const { nombre, apellido, email, password, rol, id_area, id_deposito } = req.body;

        const usuario = {
            nombre,
            apellido,
            email,
            password
        };

        // guardar en BD
        const db = new DataBase();
        await db.connect(); // conecto a la bd

        // encriptar la contraseña
        const salt = bcryptjs.genSaltSync(); // numero de vueltas para encriptar (por defecto 10) mientras mas vueltas mas seguro pero mas lento
        usuario.password = bcryptjs.hashSync(password, salt); // el hashSync es para encriptar la contraseña en una sola via, y esta funcion recibe la contraseña a encriptar y el numero de vueltas o salt
        usuario.id = uuidv4();

        const { password: pass, estado, ...resp } = await db.crearUsuario(usuario); // creo el usuario en la bd y guardo la respuesta en resp

        // asignar rol al usuario
        await db.asignarRol(resp.id, rol, id_area, id_deposito);

        await db.disconnect(); // desconecto de la bd una vez realizado todo

        //se devuelve el usuario creado
        res.status(201).json({
            usuario: resp
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            errors: [{
                msg: 'Error en el servidor. Hable con el administrador'
            }]
        });
    }

};

const actualizarUsuario = async (req = request, res = response) => {

    try {
        const { id } = req.params;
        const { nombre = '', apellido = '', email = '', password = '' } = req.body; // Por el momento solo se permite actualizar estos campos, ¿tambien se debe actualizar ROL?

        if (!nombre && !apellido && !email && !password) {
            return res.status(400).json({
                errors: [{
                    msg: 'Debe enviar al menos un campo para actualizar'
                }]
            });
        }

        if (nombre) {
            if (nombre.length < 2 || nombre.length > 46) {
                return res.status(400).json({
                    errors: [{
                        msg: 'El nombre debe tener minimo 2 caracteres y no tener mas de 46'
                    }]
                });
            }
        }

        if (apellido) {
            if (apellido.length < 2 || apellido.length > 46) {
                return res.status(400).json({
                    errors: [{
                        msg: 'El apellido debe tener minimo 2 caracteres y no tener mas de 46'
                    }]
                });
            }
        }

        if (email) {
            //expresion regular para validar que sea un email valido
            const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/

            if (!regex.test(email)) {
                return res.status(400).json({
                    errors: [{
                        msg: 'El email ingresado no es valido'
                    }]
                });
            }

            const db = new DataBase();
            await db.connect();

            const resp = await db.getUsuarioPorCorreo(email);
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

        let passwordCrypt = null;
        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    errors: [{
                        msg: 'El password debe tener minimo 6 caracteres'
                    }]
                });
            }

            // encriptar la contraseña
            const salt = bcryptjs.genSaltSync();
            passwordCrypt = bcryptjs.hashSync(password, salt);
        }

        const db = new DataBase();
        await db.connect();

        const { password: pass, estado, ...resp } = await db.actualizarUsuario(id, { nombre, apellido, email, password: passwordCrypt });

        await db.disconnect();

        res.json({
            usuario: resp
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            errors: [{
                msg: 'Error en el servidor. Hable con el administrador'
            }]
        });
    }
}

const actualizarAreaDelEncargado = async (req = request, res = response) => {

    try {

        const { id } = req.params;
        const { id_area } = req.body;

        const rol = await obtenerRol(id)
        if (rol !== 'EA') {
            return res.status(400).json({
                errors: [{
                    msg: 'El usuario a modificar el area debe ser un Encargado de Area'
                }]
            });
        }


        const db = new DataBase();
        await db.connect();

        await db.updateAreaDeEncargado(id, id_area);

        await db.disconnect();

        res.json({
            msg: 'El area del encargado se actualizo con exito'
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            errors: [{
                msg: 'Error en el servidor. Hable con el administrador'
            }]
        });
    }

}

const demitirAreaAEncargado = async (req = request, res = response) => {

    try {

        const { id } = req.params;

        const rol = await obtenerRol(id)
        if (rol !== 'EA') {
            return res.status(400).json({
                errors: [{
                    msg: 'El usuario a demitir el area debe ser un Encargado de Area'
                }]
            });
        }


        const db = new DataBase();
        await db.connect();

        await db.demitirAreaAEncargado(id);

        await db.disconnect();

        res.json({
            msg: 'El area del encargado dimitió con exito'
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            errors: [{
                msg: 'Error en el servidor. Hable con el administrador'
            }]
        });
    }

}

const eliminarUsuario = async (req = request, res = response) => {

    try {
        const { id } = req.params;

        if (id === req.usuario.id) {
            return res.status(400).json({
                errors: [{
                    msg: 'No puede desactivar su propio usuario'
                }]
            });
        }

        const usuarioRol = await obtenerRol(id)

        const db = new DataBase();
        await db.connect();

        if (usuarioRol === 'EA') {
            await db.demitirAreaAEncargado(id)
        }

        await db.eliminarUsuario(id);

        await db.disconnect();

        res.json({
            msg: "Usuario desactivado con éxito"
        });

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
    crearUsuario,
    actualizarUsuario,
    actualizarAreaDelEncargado,
    demitirAreaAEncargado,
    eliminarUsuario
}