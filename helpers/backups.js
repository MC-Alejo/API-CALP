const fs = require("fs");
const os = require("os");
const { DataBase } = require("../models");
const {
  escribirScriptBackups,
  ejecutarScriptBackups,
  escribirScriptRestores,
  ejecutarScriptRestores,
} = require("./readWrite");

const crearBackup = async () => {
  try {
    //insertar a la tabla de backups
    const db = new DataBase();

    const fecha = await db.extraerFecha();

    sistemaOperativo = os.platform();

    //escribo el script..
    escribirScriptBackups(fecha, sistemaOperativo);

    //lo ejecuto..
    ejecutarScriptBackups(sistemaOperativo);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const restaurar = async (id) => {
  try {
    const backup = id + ".backup";

    //hago una segunda validacion por las dudas
    //existe el id.backup?
    if (!fs.existsSync(`./backups/${backup}`)) {
      throw new Error("No existe archivo .backup!");
    }

    sistemaOperativo = os.platform();

    //escribo el script..
    escribirScriptRestores(backup, sistemaOperativo);

    //ejecutarScript
    ejecutarScriptRestores(sistemaOperativo);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  crearBackup,
  restaurar,
};
