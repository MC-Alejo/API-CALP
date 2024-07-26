const { request, response } = require("express");
const bcryptjs = require("bcryptjs");
const { DataBase } = require("../models");
const { restaurar } = require("../helpers");

const realizarRestore = async (req = request, res = response) => {
  try {
    const { email } = req.usuario;
    const { id = "", password = "" } = req.body;

    const db = new DataBase();
    
    const usuario = await db.getUsuarioPorCorreo(email.toLowerCase());
    

    const validPassword = bcryptjs.compareSync(password, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        errors: [
          {
            msg: "Porfavor ingrese una contraseña valida",
          },
        ],
      });
    }

    const restoreRealizado = await restaurar(id);

    restoreRealizado
      ? res.status(200).json({
          msg: "Restauración realizada con exito",
        })
      : res.status(500).json({
          msg: "Error al realizar la restauración",
        });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errors: [
        {
          msg: "Ha ocurrido un problema al realizar la restauración",
        },
      ],
    });
  }
};

module.exports = {
  realizarRestore,
};
