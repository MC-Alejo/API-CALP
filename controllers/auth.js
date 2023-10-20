const { request, response } = require("express");
const bcryptjs = require('bcryptjs');
const { DataBase } = require("../models");
const { generarJWT, obtenerRol } = require("../helpers");



const login = async (req=request, res = response) => {

    const { email, password } = req.body;

    try {
        //creamos la instancia de la BD y nos conectamos
        const db = new DataBase();
        await db.connect();

        // Verificar si el email existe
        const usuario = await db.getUsuarioPorCorreo(email);
        if (!usuario) {
            return res.status(400).json({errors:[{
                msg: 'Usuario / Password no son correctos - correo'
            }]})
        }

        // Verificar si el usuario esta activo o mejor dicho no ha sido borrado logicamente de la BD
        if (!usuario.estado) {
            return res.status(400).json({errors:[{
                msg: 'Usuario / Password no son correctos - estado: false'
            }]})
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);        
        if (!validPassword) {
            return res.status(400).json({errors:[{
                msg: 'Usuario / Password no son correctos - password'
            }]})
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);
        await db.disconnect(); // nos desconectamos de la BD

        usuario.rol = await obtenerRol(usuario.id);

        const {password: pass, estado, ...resto} = usuario; // no enviamos el password en la respuesta
        
        res.json({
            usuario: resto,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({errors:[{
            msg: 'Error en el servidor. Hable con el administrador'
        }]})
    }
}


module.exports = {
    login
}