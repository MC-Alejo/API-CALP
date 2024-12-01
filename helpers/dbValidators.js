const fs = require("fs");
const { DataBase } = require("../models");

// ---------------------  VALIDACIONES USUARIO --------------------------------
const validarEmailExiste = async (correo = "") => {
  const db = new DataBase();
  const resp = await db.validarEmailExiste(correo.toLowerCase());
  if (resp) {
    throw new Error(`Ese correo ya existe en la BD`);
  }

  return true;
};

const validarIdUsuario = async (id = "") => {
  const db = new DataBase();

  const resp = await db.getUsuarioPorId(id);

  if (!resp) {
    throw new Error(`No existe un usuario con ese id`);
  }

  if (!resp.estado) {
    throw new Error(`No existe un usuario con ese id - estado: false`);
  }

  return true;
};

// ---------------------  VALIDACIONES AREAS --------------------------------
const existeAreaPorId = async (id) => {
  const db = new DataBase();

  const resp = await db.getAreaPorId(id);
  if (!resp || !resp.estado) {
    throw new Error(`No existe un area con ese id`);
  }

  return true;
};

const existeNombreArea = async (nombre = "") => {
  const db = new DataBase();

  const resp = await db.getAreaPorNombre(nombre);
  if (resp && resp.estado) {
    throw new Error(`Ya existe un area con ese nombre`);
  }

  return true;
};

const areaYaAsignada = async (id_area) => {
  const db = new DataBase();

  const resp = await db.validarAreaDefinida(id_area);
  if (resp) {
    throw new Error(
      `Esa area ha sido asignada al usuario con el id: ${resp.id_usuario}`
    );
  }

  return true;
};

// ---------------------  VALIDACIONES SECTOR --------------------------------
const existeSectorPorId = async (id) => {
  const db = new DataBase();

  const resp = await db.getSectorPorId(id);
  if (!resp || !resp.estado) {
    throw new Error(`No existe un sector con ese id`);
  }

  return true;
};

// ---------------------  VALIDACIONES EQUIPAMIENTO --------------------------------
const existeEquipamientoPorId = async (id) => {
  const db = new DataBase();

  const resp = await db.getEquipamientoPorId(id);
  if (!resp || !resp.estado) {
    throw new Error(`No existe un equipamiento con ese id`);
  }

  return true;
};

// ---------------------  VALIDACIONES ALARMAS --------------------------------
const validarFecha = (fecha) => {
  const inputDate = new Date(fecha); //transformo la fecha de string a formato Date
  const fecActuSinTratar = new Date(); //extraigo la fecha actual

  console.log(inputDate);
  // Configuro la hora de la fecha actual a medianoche para comparación solo de fechas
  fecActuSinTratar.setHours(0, 0, 0, 0);

  const fechaArray = fecActuSinTratar.toJSON().split("T");
  const fechaActual = new Date(fechaArray[0]);

  //no puede crear alarmas con fechas anteriores a la actual ni en la actual (para eso deberia crear una tarea nueva)
  if (inputDate <= fechaActual) {
    throw new Error(
      "La fecha de alarma no puede ser anterior a la fecha actual"
    );
  }

  return true;
};

const existeAlarma = async (id) => {
  const db = new DataBase();

  const resp = await db.getAlarma(id);
  if (!resp) {
    throw new Error(`No existe Alarma con ese ID`);
  }

  return true;
};

// ---------------------  VALIDACIONES EMPLEADOS --------------------------------
const correoEmpleadoExiste = async (email = "") => {
  const db = new DataBase();

  const resp = await db.getEmpleadoByCorreo(email.toLowerCase());
  if (resp) {
    throw new Error(`Ese correo ya pertenece a un empleado`);
  }

  return true;
};

const telefonoEmpleadoExiste = async (telefono = "") => {
  const db = new DataBase();

  const resp = await db.getEmpleadoByTelefono(telefono);
  if (resp) {
    throw new Error(`Ese telefono ya pertenece a un empleado`);
  }

  return true;
};

const existeEmpleadoPorId = async (id) => {
  const db = new DataBase();

  const resp = await db.getEmpleadoByID(id);
  if (!resp || !resp.estado) {
    throw new Error(`No existe empleado con ese id`);
  }

  return true;
};

// ---------------------  VALIDACIONES DEPOSITOS --------------------------------
const existeNombreDeposito = async (nombre) => {
  const db = new DataBase();

  const resp = await db.getDepositoPorNombre(nombre);
  if (resp) {
    throw new Error(`Ya existe un deposito con ese nombre`);
  }

  return true;
};

const existeDepositoPorId = async (id) => {
  const db = new DataBase();

  const resp = await db.getDepositoPorId(id);
  if (!resp) {
    throw new Error(`No existe un deposito con ese id`);
  }

  return true;
};

const depositoYaAsignado = async (id_deposito) => {
  const db = new DataBase();

  const resp = await db.validarJefeDefinido(id_deposito);
  if (resp) {
    throw new Error(
      `Ese deposito ya ha sido asignado al usuario con el id: ${resp.id_usuario}`
    );
  }

  return true;
};

// ---------------------  VALIDACIONES INVENTARIO  --------------------------------

const existeInventarioPorId = async (id) => {
  const db = new DataBase();

  const resp = await db.getInventarioPorId(id);
  if (!resp || !resp.estado) {
    throw new Error(`No existe un inventario con ese id`);
  }

  return true;
};

// ---------------------  VALIDACIONES SOLICITUDES  --------------------------------
const existeSolicitudPorId = async (id) => {
  const db = new DataBase();

  const resp = await db.getSolicitudPorId(id);
  if (!resp) {
    throw new Error(`No existe una solicitud con ese id`);
  }

  return true;
};

const SolicitudEstaPendiente = async (id) => {
  const db = new DataBase();

  const resp = await db.getSolicitudPorId(id);
  if (resp.estado !== "pendiente") {
    throw new Error(`La solcitud ya fue tratada`);
  }

  return true;
};

// ---------------------  VALIDACIONES TAREAS  --------------------------------
const existeTareaPorId = async (id) => {
  const db = new DataBase();

  const resp = await db.getTareaPorId(id);
  if (!resp) {
    throw new Error(`No existe una tarea con ese id`);
  }

  return true;
};

const tareaPorIdFinalizo = async (id) => {
  const db = new DataBase();

  const resp = await db.getTareaPorId(id);
  if (!resp || resp.estado === "finalizada") {
    throw new Error(`No existe una tarea con ese id o la tarea ya finalizo`);
  }

  return true;
};

const tareaTieneResponsable = async (id) => {
  const db = new DataBase();

  const resp = await db.getTareaPorId(id);
  if (!resp || resp.estado === "finalizada") {
    throw new Error(`No existe una tarea con ese id o la tarea ya finalizo`);
  }

  if (!resp.id_responsable) {
    throw new Error(`La tarea no tiene responsable`);
  }

  return true;
};

// ---------------------  VALIDACIONES RESTORE/BACKUPS (NO A BD)  --------------------------------
const validarExisteArchivo = async (id) => {
  const backup = id + ".backup";

  const files = await fs.promises.readdir("./backups");

  let bandera = 0;

  for (const i in files) {
    if (files[i] === backup) {
      bandera = 1;
      break;
    }
  }

  if (bandera === 0) {
    throw new Error("El punto de restauración no existe");
  }

  return true;
};

module.exports = {
  areaYaAsignada,
  correoEmpleadoExiste,
  depositoYaAsignado,
  existeAlarma,
  existeAreaPorId,
  existeDepositoPorId,
  existeEmpleadoPorId,
  existeEquipamientoPorId,
  existeInventarioPorId,
  existeNombreArea,
  existeNombreDeposito,
  existeSectorPorId,
  existeSolicitudPorId,
  existeTareaPorId,
  SolicitudEstaPendiente,
  tareaPorIdFinalizo,
  tareaTieneResponsable,
  telefonoEmpleadoExiste,
  validarEmailExiste,
  validarExisteArchivo,
  validarFecha,
  validarIdUsuario,
};
