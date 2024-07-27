const { request, response } = require("express");
const { DataBase } = require("../models");
const { buildPDF } = require("../libs/pdfs.libs");
const transporter = require("../libs/nodemailer.lib");

const estados = ["C", "F"]; // C: en curso, F: finalizada
const intervalos = ["T", "W", "M"]; //T: Today, W: Week, M: Month

const realizarReporte = async (req = request, res = response) => {
  try {
    const { email } = req.usuario;

    const {
      estado = "",
      intervalo = "",
      responsable,
      area,
      equipamiento,
      grafico = "",
    } = req.query;
    const db = new DataBase();

    const variablesTratadas = {
      estadoTratado: null,
      intervaloTratado: null,
      responsableTratado: null,
      areaTratada: null,
      equipamientoTrado: null,
    };

    //validaciones y trato de los datos x querys ----------------------------------------------------------------
    if (estado) {
      if (!estados.includes(estado.toUpperCase())) {
        return res.status(400).json({
          errors: [
            {
              msg: "El estado, no es un estado valido de las tareas",
            },
          ],
        });
      }

      variablesTratadas.estadoTratado =
        estado.toUpperCase() === "F" ? "'finalizada'" : "'en curso'";
    }

    if (intervalo) {
      if (!intervalos.includes(intervalo.toUpperCase())) {
        return res.status(400).json({
          errors: [
            {
              msg: "Intervalo incorrecto",
            },
          ],
        });
      }

      variablesTratadas.intervaloTratado =
        intervalo.toUpperCase() === "T"
          ? "T"
          : intervalo.toUpperCase() === "W"
          ? "W"
          : intervalo.toUpperCase() === "M"
          ? "M"
          : null;
    }

    if (responsable) {
      if (!isNaN(Number(responsable))) {
        const db = new DataBase();

        const resp = await db.getEmpleadoByID(Number(responsable));
        if (!resp || !resp.estado) {
          return res.status(400).json({
            errors: [
              {
                msg: "Empleado ingresado no es válido",
              },
            ],
          });
        }

        variablesTratadas.responsableTratado = resp.id;
      } else {
        return res.status(400).json({
          errors: [
            {
              msg: "ID del empleado debe ser un número",
            },
          ],
        });
      }
    }

    if (area) {
      if (!isNaN(Number(area))) {
        const db = new DataBase();

        const resp = await db.getAreaPorId(Number(area));
        if (!resp || !resp.estado) {
          return res.status(400).json({
            errors: [
              {
                msg: "Area ingresada no es válida",
              },
            ],
          });
        }

        variablesTratadas.areaTratada = resp.id;
      } else {
        return res.status(400).json({
          errors: [
            {
              msg: "Area ingresada debe ser un numero",
            },
          ],
        });
      }
    }

    if (equipamiento) {
      if (!isNaN(Number(equipamiento))) {
        if (variablesTratadas.areaTratada) {
          const db = new DataBase();

          const resp = await db.existeEquipamientoEnArea(
            variablesTratadas.areaTratada,
            Number(equipamiento)
          );

          if (!resp) {
            return res.status(400).json({
              errors: [
                {
                  msg: "El equipamiento ingresado no pertenece a esa área",
                },
              ],
            });
          }

          variablesTratadas.equipamientoTrado = resp.id_equipo;
        } else {
          const db = new DataBase();

          const resp = await db.getEquipamientoPorId(Number(equipamiento));

          if (!resp) {
            return res.status(400).json({
              errors: [
                {
                  msg: "Equipamiento ingresado no es válido",
                },
              ],
            });
          }

          variablesTratadas.equipamientoTrado = resp.id;
        }
      } else {
        return res.status(400).json({
          errors: [
            {
              msg: "El equipamiento debe ser un numero",
            },
          ],
        });
      }
    }

    // FIN validaciones -----------------------------------------------------------------------------------------

    //construyo mi objeto de opciones con los datos tratados
    const options = {
      estado: variablesTratadas.estadoTratado,
      intervalo: variablesTratadas.intervaloTratado,
      responsable: variablesTratadas.responsableTratado,
      area: variablesTratadas.areaTratada,
      equipamiento: variablesTratadas.equipamientoTrado,
    };

    //generar reporte
    const tareas = await db.generarReporte(options);

    let datosAreas = null;

    if (grafico.toLowerCase() === "y") {
      datosAreas = await db.cantidadTareasPorArea();
    }

    await buildPDF(tareas ? tareas : [], datosAreas ? datosAreas : null);

    const fecha = new Date();

    const subject = `Informe de tareas  ${fecha.getDate()}/${
      fecha.getMonth() + 1
    }/${fecha.getFullYear()}`;

    const filename = `Informe_${fecha.getDate()}-${
      fecha.getMonth() + 1
    }-${fecha.getFullYear()}.pdf`;

    await transporter.sendMail({
      from: `CALP Mantenimiento ${process.env.EMAIL}`,
      to: email,
      subject,
      text: "Informe mantenimiento CALP.",
      attachments: [
        {
          filename,
          path: "./reports/informe.pdf",
          contentType: "application/pdf",
        },
      ],
    });

    res.status(200).json({
      msg: "Reporte generado y enviado con éxito",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errors: [
        {
          msg: "Ha ocurrido un problema al realizar el reporte",
        },
      ],
    });
  }
};

module.exports = {
  realizarReporte,
};
