const { response } = require("express");
const { DataBase } = require("../models");

const obtenerTareas = async (req, res = response) => {
  try {
    const { estado, prioridad } = req.query;
    const db = new DataBase();

    if (estado) {
      if (estado === "en curso" || estado === "finalizada") {
        const tareas = await db.getTareasPorEstado(estado);

        return res.json({
          tareas,
        });
      }
    }

    if (prioridad) {
      if (prioridad === "1" || prioridad === "2" || prioridad === "3") {
        const tareas = await db.getTareasPorPrioridad(prioridad);

        return res.json({
          tareas,
        });
      }
    }

    const tareas = await db.getTareas();

    return res.json({
      tareas,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error al obtener tareas",
    });
  }
};

const obtenerTareasOrdenadas = async (req, res = response) => {
  try {
    const db = new DataBase();

    const tareas = await db.getTareasOrdenadas();

    return res.json({
      tareas,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error al obtener tareas",
    });
  }
};

const obtenerTareasMaquinaria = async (req, res = response) => {
  const { id } = req.params;
  try {
    const db = new DataBase();

    const tareas = await db.getTareasPorIdMaquina(id);

    return res.json({
      tareas,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error al obtener tareas",
    });
  }
};

const obtenerTareaPorId = async (req, res = response) => {
  const { id } = req.params;
  try {
    const db = new DataBase();

    const tarea = await db.getTareaPorId(id);

    if (!tarea) {
      return res
        .status(400)
        .json({ errors: [{ msg: "No existe una tarea con ese id" }] });
    }

    return res.json({
      tarea,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error al obtener tarea por id",
    });
  }
};

const obtenerTareasPorJuez = async (req, res = response) => {
  const { id } = req.params;
  try {
    const db = new DataBase();

    const tareas = await db.getTareasPorJuez(id);

    return res.json({
      tareas,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error al obtener tareas por juez",
    });
  }
};

const obtenerTareasPorJuezOrdenadas = async (req, res = response) => {
  const { id } = req.params;
  try {
    const db = new DataBase();

    const tareas = await db.getTareasPorJuezOrdenada(id);

    return res.json({
      tareas,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error al obtener tareas por juez",
    });
  }
};

const obtenerTarPorMaquiYJuezOrd = async (req, res = response) => {
  const { id, equipamiento } = req.params;
  try {
    const db = new DataBase();

    const tareas = await db.getTareasPorMaquinaJuezOrdenada(id, equipamiento);

    return res.json({
      tareas,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error al obtener tareas por juez",
    });
  }
};

const obtenerInventarioDeTarea = async (req, res = response) => {
  const { id } = req.params;
  try {
    const db = new DataBase();

    const inventario = await db.getInventarioDeTarea(id);

    return res.json({
      inventario,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error al obtener inventario de tarea",
    });
  }
};

const cargarTareaDelJefe = async (req, res = response) => {
  const {
    id_equipamiento,
    estado,
    descripcion,
    prioridad,
    id_responsable = null,
    desc_soli = "",
  } = req.body;
  const id_usuario = req.usuario.id;
  try {
    const db = new DataBase();

    const solicitud = await db.crearSolicitud(
      desc_soli,
      id_equipamiento,
      id_usuario
    );
    const tarea = await db.crearTarea(
      "en curso",
      null,
      descripcion,
      prioridad,
      solicitud.id,
      id_responsable
    );
    await db.modificarEstadoSolicitud(solicitud.id, "aceptada");
    await db.setJuezSolicitud(solicitud.id, id_usuario);
    let tareaFinalizada;
    if (estado === "finalizada") {
      tareaFinalizada = await db.modificarEstadoTarea(tarea.id, "finalizada");
    }

    return res.status(201).json({
      msg: "Tarea creada correctamente",
      tarea: estado === "finalizada" ? tareaFinalizada : tarea,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error al crear tarea",
    });
  }
};

const cargarAlarma = async (req, res = response) => {
  const { id } = req.params;
  const { fecha, descripcion, prioridad, desc_soli = "" } = req.body;
  const id_usuario = req.usuario.id;
  try {
    const db = new DataBase();

    const solicitud = await db.crearSolicitud(desc_soli, id, id_usuario);
    const tarea = await db.crearTarea("en curso", fecha, descripcion, prioridad, solicitud.id, null);
    await db.modificarEstadoSolicitud(solicitud.id, "aceptada");
    await db.setJuezSolicitud(solicitud.id, id_usuario);

    return res.status(201).json({
      msg: "Alarma creada correctamente",
      tarea: tarea,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error al crear una alarma",
    });
  }
};

const actualizarTarea = async (req, res = response) => {
  const { id } = req.params;
  const { id_responsable, prioridad, descripcion = "" } = req.body;

  if (!id_responsable && !prioridad && !descripcion) {
    return res
      .status(400)
      .json({
        errors: [{ msg: "Debe enviar al menos un campo para actualizar" }],
      });
  }

  try {
    if (descripcion !== "") {
      if (descripcion.length < 10) {
        return res
          .status(400)
          .json({
            errors: [{ msg: "La descripcion debe tener mas de 10 caracteres" }],
          });
      }
      if (descripcion.length > 250) {
        return res
          .status(400)
          .json({
            errors: [
              { msg: "La descripcion debe tener menos de 250 caracteres" },
            ],
          });
      }
    }

    if (prioridad) {
      if (prioridad < 1 || prioridad > 3) {
        return res
          .status(400)
          .json({
            errors: [{ msg: "La prioridad debe ser un numero entre 1 y 3" }],
          });
      }
    }

    if (id_responsable) {
      const db = new DataBase();

      const resp = await db.getEmpleadoByID(id_responsable);
      if (!resp || !resp.estado) {
        return res
          .status(400)
          .json({ errors: [{ msg: "No existe un empleado con ese id" }] });
      }
    }

    const db = new DataBase();

    const tareaActualizada = await db.actualizarTarea(id, { descripcion, prioridad, id_responsable});

    return res.json({
      msg: "Tarea actualizada correctamente",
      tareaActualizada,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error al actualizar Tarea",
    });
  }
};

const finalizarTarea = async (req, res = response) => {
  const { id } = req.params;
  try {
    const db = new DataBase();

    const tareaFinalizada = await db.modificarEstadoTarea(id, "finalizada");

    return res.json({
      msg: "Tarea finalizada correctamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error al finalizar Tarea",
    });
  }
};

const agregarInventarioATarea = async (req, res = response) => {
  const { id } = req.params;
  const { id_inventario, cantidad } = req.body;

  try {
    const db = new DataBase();

    const resp = await db.getInventarioEnTarea(id, id_inventario);
    if (resp) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Ya existe ese inventario en la tarea" }] });
    }

    const inventario = await db.getInventarioPorId(id_inventario);

    const restarCantidad = Number(inventario.stock) - Number(cantidad);
    
    if(restarCantidad < 0){
      return res
        .status(400)
        .json({ errors: [{ msg: "La cantidad es superior a la cantidad disponible en stock" }] });
    }

    const inventarioTarea = await db.agregarInventarioATarea(
      id,
      id_inventario,
      cantidad,
      restarCantidad
    );

    return res.status(201).json({
      msg: "Inventario agregado correctamente",
      inventarioTarea,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error al agregar inventario a tarea",
    });
  }
};

const eliminarInventarioDeTarea = async (req, res = response) => {
  
  const { id } = req.params;
  const { id_inventario } = req.body;
  try {

    const db = new DataBase();

    const resp = await db.getInventarioEnTarea(id, id_inventario);

    if (!resp) {
      return res
        .status(400)
        .json({ errors: [{ msg: "No existe ese inventario en la tarea" }] });
    }


    const inventario = await db.getInventarioPorId(id_inventario);

    const newStock = Number(inventario.stock) + Number(resp.cantidad_usada);

    const inventarioTarea = await db.EliminarInventarioATarea(id,id_inventario, newStock);

    return res.status(200).json({
      msg: "Inventario eliminado correctamente"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error al eliminar el inventario de una tarea",
    });
  }
}

module.exports = {
  actualizarTarea,
  agregarInventarioATarea,
  cargarAlarma,
  cargarTareaDelJefe,
  eliminarInventarioDeTarea,
  finalizarTarea,
  obtenerInventarioDeTarea,
  obtenerTareaPorId,
  obtenerTareas,
  obtenerTareasMaquinaria,
  obtenerTareasOrdenadas,
  obtenerTareasPorJuez,
  obtenerTareasPorJuezOrdenadas,
  obtenerTarPorMaquiYJuezOrd,
};
