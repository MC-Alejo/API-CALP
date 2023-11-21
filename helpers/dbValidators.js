const { DataBase } = require('../models')

// ---------------------  VALIDACIONES USUARIO --------------------------------
const validarEmailExiste = async (correo = '') => {
    const db = new DataBase();
    const resp = await db.validarEmailExiste(correo);
    if (resp) {
        throw new Error(`Ese correo ya existe en la BD`);
    }

    return true;
}

const validarIdUsuario = async (id = '') => {
    const db = new DataBase();
    await db.connect();

    const resp = await db.getUsuarioPorId(id);

    if (!resp) {
        await db.disconnect();
        throw new Error(`No existe un usuario con ese id`);
    }

    if (!resp.estado) {
        await db.disconnect();
        throw new Error(`No existe un usuario con ese id - estado: false`);
    }

    await db.disconnect();

    return true;
}


// ---------------------  VALIDACIONES AREAS --------------------------------
const existeAreaPorId = async (id) => {
    const db = new DataBase();
    await db.connect();
    const resp = await db.getAreaPorId(id);
    if (!resp || !resp.estado) {
        await db.disconnect();
        throw new Error(`No existe un area con ese id`);
    }
    await db.disconnect();

    return true;
}

const existeNombreArea = async (nombre = '') => {
    const db = new DataBase();
    await db.connect();
    const resp = await db.getAreaPorNombre(nombre);
    if (resp && resp.estado) {
        await db.disconnect();
        throw new Error(`Ya existe un area con ese nombre`);
    }
    await db.disconnect();

    return true;

}

const areaYaAsignada = async (id_area) => {
    const db = new DataBase();
    await db.connect();
    const resp = await db.validarAreaDefinida(id_area);
    if (resp) {
        await db.disconnect();
        throw new Error(`Esa area ha sido asignada al usuario con el id: ${resp.id_usuario}`);
    }
    await db.disconnect();

    return true;
}

// ---------------------  VALIDACIONES SECTOR --------------------------------
const existeSectorPorId = async (id) => {
    const db = new DataBase();
    await db.connect();
    const resp = await db.getSectorPorId(id);
    if (!resp || !resp.estado) {
        await db.disconnect();
        throw new Error(`No existe un sector con ese id`);
    }

    await db.disconnect();

    return true;

}


// ---------------------  VALIDACIONES EQUIPAMIENTO --------------------------------
const existeEquipamientoPorId = async (id) => {
    const db = new DataBase();
    await db.connect();
    const resp = await db.getEquipamientoPorId(id);
    if (!resp || !resp.estado) {
        await db.disconnect();
        throw new Error(`No existe un equipamiento con ese id`);
    }

    await db.disconnect();

    return true;
}

// ---------------------  VALIDACIONES ALARMAS --------------------------------
const existeAlarmaMantenimiento = async (id) => {
    const db = new DataBase();
    await db.connect();
    const resp = await db.getAlarmaDeEquipamiento(id);
    if (resp) {
        await db.disconnect();
        throw new Error(`Existe Alarma en ese equipamiento`);
    }

    await db.disconnect();

    return true;
}

const existeAlarma = async (id) => {
    const db = new DataBase();
    await db.connect();
    const resp = await db.getAlarma(id);
    if (!resp) {
        await db.disconnect();
        throw new Error(`No existe Alarma con ese ID`);
    }

    await db.disconnect();

    return true;
}

// ---------------------  VALIDACIONES EMPLEADOS --------------------------------
const correoEmpleadoExiste = async (email = '') => {
    const db = new DataBase();
    await db.connect();
    const resp = await db.getEmpleadoByCorreo(email);
    if (resp) {
        await db.disconnect();
        throw new Error(`Ese correo ya pertenece a un empleado`);
    }

    await db.disconnect();

    return true;
}

const existeEmpleadoPorId = async (id) => {
    const db = new DataBase();
    await db.connect();
    const resp = await db.getEmpleadoByID(id);
    if (!resp || !resp.estado) {
        await db.disconnect();
        throw new Error(`No existe empleado con ese id`);
    }

    await db.disconnect();

    return true;
}

// ---------------------  VALIDACIONES DEPOSITOS --------------------------------
const existeNombreDeposito = async (nombre) => {
    const db = new DataBase();
    await db.connect();
    const resp = await db.getDepositoPorNombre(nombre);
    if (resp) {
        await db.disconnect();
        throw new Error(`Ya existe un deposito con ese nombre`);
    }
    await db.disconnect();

    return true;
}

const existeDepositoPorId = async (id) => {
    const db = new DataBase();
    await db.connect();
    const resp = await db.getDepositoPorId(id);
    if (!resp) {
        await db.disconnect();
        throw new Error(`No existe un deposito con ese id`);
    }
    await db.disconnect();

    return true;
}

// ---------------------  VALIDACIONES INVENTARIO  --------------------------------
const existeInventarioPorNombre = async (nombre) => {
    const db = new DataBase();
    await db.connect();
    const resp = await db.getInventarioPorNombre(nombre);
    if (resp) {
        await db.disconnect();
        throw new Error(`Ya existe un inventario con ese nombre`);
    }
    await db.disconnect();

    return true;
}

const existeInventarioPorId = async (id) => {
    const db = new DataBase();
    await db.connect();
    const resp = await db.getInventarioPorId(id);
    if (!resp || !resp.estado) {
        await db.disconnect();
        throw new Error(`No existe un inventario con ese id`);
    }
    await db.disconnect();

    return true;
}

// ---------------------  VALIDACIONES SOLICITUDES  --------------------------------
const existeSolicitudPorId = async (id) => {
    const db = new DataBase();
    await db.connect();
    const resp = await db.getSolicitudPorId(id);
    if (!resp) {
        await db.disconnect();
        throw new Error(`No existe una solicitud con ese id`);
    }
    await db.disconnect();

    return true;

}

// ---------------------  VALIDACIONES TAREAS  --------------------------------
const existeTareaPorId = async (id) => {
    const db = new DataBase();
    await db.connect();
    const resp = await db.getTareaPorId(id);
    if (!resp || resp.estado === 'finalizada') {
        await db.disconnect();
        throw new Error(`No existe una tarea con ese id o la tarea ya finalizo`);
    }
    await db.disconnect();

    return true;


}
module.exports = {
    areaYaAsignada,
    correoEmpleadoExiste,
    existeAlarma,
    existeAlarmaMantenimiento,
    existeAreaPorId,
    existeDepositoPorId,
    existeEmpleadoPorId,
    existeEquipamientoPorId,
    existeInventarioPorId,
    existeInventarioPorNombre,
    existeNombreArea,
    existeNombreDeposito,
    existeSectorPorId,
    existeSolicitudPorId,
    existeTareaPorId,
    validarEmailExiste,
    validarIdUsuario,
}