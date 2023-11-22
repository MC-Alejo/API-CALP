const { DataBase } = require("../models");

//obtener todas las alarmas
const obtenerAlarmas = async (req, res) => {
    try {
        const db = new DataBase();
        await db.connect();

        const alarmas = await db.getAlarmas();
        await db.disconnect();
        res.json({
            alarmas
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [{
                msg: 'Error al obtener las alarmas'
            }]
        });
    }
}

//obtener alarma por id
const obtenerAlarmaPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const db = new DataBase();
        await db.connect();

        const alarma = await db.getAlarma(id);
        await db.disconnect();
        res.json({
            alarma
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [{
                msg: 'Error al obtener la alarma'
            }]
        });
    }
}

const actualizarAlarmaMantenimiento = async (req, res) => {
    const { id } = req.params;
    const { fecha, hora } = req.body;
    // validamos que venga la fecha y la hora
    if (!fecha && !hora) {
        return res.status(400).json({
            errors: [{
                msg: 'Falta la fecha o la hora'
            }]
        })
    }


    if (fecha) {
        //validar que la fecha sea tipo Date y el formato de la fecha sea AAAA-MM-DD
        if (!Date.parse(fecha)) {
            return res.status(400).json({
                errors: [{
                    msg: 'La fecha debe ser una fecha valida'
                }]
            })
        }

        //verificar si es una fecha valida
        const fechaArray = fecha.split('-');
        const anio = fechaArray[0];
        const mes = fechaArray[1];
        const dia = fechaArray[2];
        const fechaValida = new Date(anio, mes - 1, dia);

        if (dia != fechaValida.getDate() || mes != fechaValida.getMonth() + 1 || anio != fechaValida.getFullYear()) {
            return res.status(400).json({
                errors: [{
                    msg: 'La fecha debe ser una fecha valida'
                }]
            })
        }
    }

    //validar que la hora sea tipo Time y el formato de la hora sea HH:MM
    if (hora) {
        //manejo especial para verificar que es del tipo Time
        if (!Date.parse(`01/01/2023 ${hora}`)) {
            return res.status(400).json({
                errors: [{
                    msg: 'La hora debe ser una hora valida'
                }]
            })
        }

        //verificar si es una hora valida
        const horaArray = hora.split(':');
        const horaValida = new Date(`01/01/2021 ${hora}`);

        if (horaArray[0] != horaValida.getHours() || horaArray[1] != horaValida.getMinutes()) {
            return res.status(400).json({
                errors: [{
                    msg: 'La hora debe ser una hora valida'
                }]
            })
        }
    }

    try {
        const db = new DataBase();
        await db.connect();
        const alarma = await db.actualizarAlarmaMantenimiento(id, { fecha, hora });
        await db.disconnect();
        res.json({
            msg: 'Alarma de mantenimiento actualizada con exito',
            alarma
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [{
                msg: 'Error al actualizar la alarma de mantenimiento'
            }]
        });
    }
}

const eliminarAlarmaMantenimiento = async (req, res) => {
    const { id } = req.params;

    try {
        const db = new DataBase();
        await db.connect();
        const resp = await db.eliminarAlarmaMantenimiento(id);
        await db.disconnect();
        res.json({
            msg: 'Alarma de mantenimiento eliminada con exito',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [{
                msg: 'Error al eliminar la alarma de mantenimiento'
            }]
        });
    }
}


module.exports = {
    actualizarAlarmaMantenimiento,
    eliminarAlarmaMantenimiento,
    obtenerAlarmaPorId,
    obtenerAlarmas,
}