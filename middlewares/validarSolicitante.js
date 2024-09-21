const { response, request } = require("express");
const { DataBase } = require("../models");

const esSolicitanteEsGo = async (req = request, res = response, next) => {
  try {
    const { id: userID, rol } = req.usuario;
    const { id } = req.params;

    const db = new DataBase();

    const resp = await db.getSolicitudPorId(id);

    if (!resp || resp.estado !== "pendiente") {
      return res.status(401).json({
        errors: [
          {
            msg: "No existe solicitud con ese ID o usted no tiene permisos para realizar esa accion - No existe ID o la tarea ya se trató",
          },
        ],
      });
    }

    if (resp.id_usuario_soli === userID || rol === "GO") {
      return next();
    }

    res.status(401).json({
      errors: [
        {
          msg: "No existe solicitud con ese ID o usted no tiene permisos para realizar esa accion - Usted no tiene permisos para realizar esa accion",
        },
      ],
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      errors: [
        {
          msg: "No se ha proporcionado un ID valido",
        },
      ],
    });
  }
};

module.exports = {
  esSolicitanteEsGo
};
