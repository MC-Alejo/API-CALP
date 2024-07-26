const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const { DataBase } = require("../models");
const { obtenerRol } = require("../helpers");

//el middleware es una funcion que recibe 3 argumentos: request, response y next siempre
const validarJWT = async (req = request, res = response, next) => {
  const token = req.header("calp-token"); // el header es una propiedad de la request
  if (!token) {
    return res.status(401).json({
      errors: [
        {
          msg: "No hay token en la petición",
        },
      ],
    });
  }

  try {
    // const payload = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    // verify es un metodo de jwt que verifica el token y devuelve el payload
    // la funcion recibe el token y la clave secreta
    const { id } = jwt.verify(token, process.env.PRIVATEKEY);

    //crear una instancia de la db para conectarnos
    const db = new DataBase();

    //leer el usuario que corresponde al id
    const usuario = await db.getUsuarioPorId(id);

    //verificar si el usuario existe
    if (!usuario) {
      return res.status(401).json({
        errors: [
          {
            msg: "Token no válido - usuario no existe en DB",
          },
        ],
      });
    }

    // verificar si el usuario con ese id tiene estado en true
    if (!usuario.estado) {
      return res.status(401).json({
        errors: [
          {
            msg: "Token no válido - usuario con estado: false",
          },
        ],
      });
    }

    const { password, estado, ...resto } = usuario; //desestructuro el usuario para no enviar el password y el estado
    req.usuario = resto; //agrego el usuario a la request

    req.usuario.rol = await obtenerRol(usuario.id); //agrego el rol al usuario

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      errors: [
        {
          msg: "Token no válido",
        },
      ],
    });
  }
};

module.exports = {
  validarJWT,
};
