const fs = require("fs");
const bcryptjs = require("bcryptjs");
const { request, response } = require("express");
const { DataBase } = require("../models");
const {
  configurarBackupAuto,
  backupAuto,
} = require("../models/backupScheduler");
const { crearBackup } = require("../helpers");

const getBackups = async (req = request, res = response) => {
  try {
    const { freq = false } = req.query;

    if (freq) {
      const frequency = backupAuto();
      return res.status(200).json({
        frequency,
      });
    }

    const files = await fs.promises.readdir("./backups");

    const backups = [];

    files.forEach((element) => {
      const archivo = element.split(".");

      if (archivo[archivo.length - 1] === "backup") {
        const fechahora = archivo[0].split("_");
        const [anio, mes, dia] = fechahora[1].split("-");
        const [hora, min, seg] = fechahora[2].split("-");
        backups.push({
          fecha_backup: `${dia}/${mes}/${anio}`,
          hora_backup: `${hora}:${min}.${seg}`,
          id: archivo[0] + "." + archivo[1],
        });
      }
    });

    res.status(200).json({
      backups,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error al obtener los backups",
    });
  }
};

const postBackup = async (req = request, res = response) => {
  try {
    const { email } = req.usuario;
    const { password = "" } = req.body;

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

    const backupRealizado = await crearBackup();

    backupRealizado
      ? res.status(201).json({
          msg: "Backup creado con exito",
        })
      : res.status(500).json({
          msg: "Error al crear el backup",
        });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error al crear el backup",
    });
  }
};

const setBackupAuto = async (req = request, res = response) => {
  try {
    const { email } = req.usuario;
    const { password = "" } = req.body;
    const { frequency = "" } = req.params;

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

    configurarBackupAuto(frequency);

    res.status(200).json({
      msg: "Se ha configurado el backup automático",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error al crear el backup",
    });
  }
};

module.exports = {
  getBackups,
  postBackup,
  setBackupAuto,
};
