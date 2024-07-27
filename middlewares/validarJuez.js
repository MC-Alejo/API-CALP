const { response, request } = require("express");
const { DataBase } = require("../models");

const esJuezEsGo = async (req = request, res = response, next) => {
  try {
    const { id: userID, rol } = req.usuario;
    const { id } = req.params;

    const db = new DataBase();

    const resp = await db.getJuezDeTarea(id);

    if (!resp || resp.estado === "finalizada") {
      return res.status(401).json({
        errors: [
          {
            msg: "No existe tarea con ese ID o usted no tiene permisos para realizar esa accion - No existe tarea con ese ID ",
          },
        ],
      });
    }

    if (resp.id_juez === userID || rol === "GO") {
      return next();
    }

    res.status(401).json({
      errors: [
        {
          msg: "No existe tarea con ese ID o usted no tiene permisos para realizar esa accion - Usted no tiene permisos para realizar esa accion",
        },
      ],
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      errors: [
        {
          msg: "No se ha proporcionado un ID valido o no existe juez",
        },
      ],
    });
  }
};

const esJuezEsGoAlarma = async (req = request, res = response, next) => {
  try {
    const { id: userID, rol } = req.usuario;
    const { id } = req.params;

    const db = new DataBase();

    const resp = await db.getJuezDeAlarma(id);

    if (!resp || resp.estado === "finalizada") {
      return res.status(401).json({
        errors: [
          {
            msg: "No existe alarma con ese ID o usted no tiene permisos para realizar esa accion - No existe alarma con ese ID ",
          },
        ],
      });
    }

    if (resp.id_juez === userID || rol === "GO") {
      return next();
    }

    res.status(401).json({
      errors: [
        {
          msg: "No existe alarma con ese ID o usted no tiene permisos para realizar esa accion - Usted no tiene permisos para realizar esa accion",
        },
      ],
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      errors: [
        {
          msg: "No se ha proporcionado un ID valido o no existe juez",
        },
      ],
    });
  }
};

module.exports = {
  esJuezEsGo,
  esJuezEsGoAlarma,
};
