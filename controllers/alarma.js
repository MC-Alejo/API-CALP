const { DataBase } = require("../models");

//obtener todas las alarmas
const obtenerAlarmas = async (req, res) => {
  try {
    const db = new DataBase();

    const alarmas = await db.getAlarmas();

    res.json({
      alarmas,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errors: [
        {
          msg: "Error al obtener las alarmas",
        },
      ],
    });
  }
};

const obtenerAlarmaPorId = async (req, res = response) => {
  const { id } = req.params;
  try {
    const db = new DataBase();

    const alarma = await db.getAlarma(id);

    if (!alarma) {
      return res
        .status(400)
        .json({ errors: [{ msg: "No existe una alarma con ese id" }] });
    }

    return res.json({
      alarma,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error al obtener tarea por id",
    });
  }
};

//obtener todas las alarmas de forma ordenada
const obtenerAlarmasOrdenadas = async (req, res) => {
  try {
    const db = new DataBase();

    const alarmas = await db.getAlarmasOrdenadas();

    res.json({
      alarmas,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errors: [
        {
          msg: "Error al obtener las alarmas",
        },
      ],
    });
  }
};

//obtener las alarmas de un juez
const obtenerAlarmasJuez = async (req, res) => {
  const { id } = req.params;
  try {
    const db = new DataBase();

    //leer el usuario que corresponde al id
    const alarma = await db.getAlarmasPorJuez(id);

    res.json({
      alarma,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errors: [
        {
          msg: "Error al obtener la alarma de mantenimiento",
        },
      ],
    });
  }
};

const actualizarAlarmaMantenimiento = async (req, res) => {
  const { id } = req.params;
  const { prioridad, descripcion = "", fecha } = req.body;

  if (!descripcion && !prioridad && !fecha) {
    return res.status(400).json({
      errors: [{ msg: "Debe enviar al menos un campo para actualizar" }],
    });
  }

  try {
    if (descripcion !== "") {
      if (descripcion.length < 10) {
        return res.status(400).json({
          errors: [{ msg: "La descripcion debe tener mas de 10 caracteres" }],
        });
      }
      if (descripcion.length > 250) {
        return res.status(400).json({
          errors: [
            { msg: "La descripcion debe tener menos de 250 caracteres" },
          ],
        });
      }
    }

    if (prioridad) {
      if (prioridad < 1 || prioridad > 3) {
        return res.status(400).json({
          errors: [{ msg: "La prioridad debe ser un numero entre 1 y 3" }],
        });
      }
    }

    const db = new DataBase();

    const tareaActualizada = await db.actualizarAlarma(id, {
      prioridad,
      descripcion,
      fecha,
    });

    return res.json({
      msg: "Alarma actualizada correctamente",
      alarma: tareaActualizada,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errors: [
        {
          msg: "Error al actualizar la alarma de mantenimiento",
        },
      ],
    });
  }
};

const eliminarAlarmaMantenimiento = async (req, res) => {
  const { id } = req.params;

  try {
    const db = new DataBase();

    const alarma = await db.getAlarma(id);
    if (!alarma) {
      return res
        .status(400)
        .json({ errors: [{ msg: "No existe una alarma con ese id" }] });
    }

    const solicitud = await db.getSolicitudPorId(alarma.id_solicitud);

    if (!solicitud) {
      return res.status(400).json({
        errors: [
          {
            msg: "Ha ocurrido un problema al eliminar la solicitud de la alarma",
          },
        ],
      });
    }

    const resp = await db.eliminarAlarmaMantenimiento(id, solicitud.id_solicitud);

    res.json({
      msg: "Alarma de mantenimiento eliminada con exito",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errors: [
        {
          msg: "Error al eliminar la alarma de mantenimiento",
        },
      ],
    });
  }
};

module.exports = {
  actualizarAlarmaMantenimiento,
  eliminarAlarmaMantenimiento,
  obtenerAlarmaPorId,
  obtenerAlarmas,
  obtenerAlarmasJuez,
  obtenerAlarmasOrdenadas,
};
