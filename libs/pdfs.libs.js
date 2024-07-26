const fs = require("fs");
const PDFDocument = require("pdfkit-table");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const PDFMerger = require("pdf-merger-js");

/** CONFIGURACIONES DE LA TABLA */
const headers = [
  {
    label: "N°",
    align: "center",
    valign: "center",
    width: 15,
    renderer: (row, indexColumn, indexRow, rectRow, rectCell) => indexRow + 1,
  },
  {
    label: "SECTOR",
    property: "sec_nombre",
    align: "center",
    valign: "center",
    width: 77.378,
  },
  {
    label: "Equipamiento",
    property: "maquinaria",
    align: "center",
    valign: "center",
    width: 77.378,
  },
  {
    label: "Encargado solicitante",
    property: "usr_solicitante",
    align: "center",
    valign: "center",
    width: 77.378,
  },
  {
    label: "Fecha de solicitud",
    property: "fecha_soli_realizada",
    align: "center",
    valign: "center",
    width: 50,
  },
  {
    label: "Tarea solicitada",
    property: "desc_solicitud",
    align: "center",
    valign: "center",
    width: 135,
  },
  {
    label: "Prioridad",
    property: "priori_tar",
    align: "center",
    valign: "center",
    width: 40,
    renderer: (value) => {
      const prioridad = Number(value);
      return prioridad === 1
        ? "ALTA"
        : prioridad === 2
        ? "MEDIA"
        : prioridad === 3
        ? "BAJA"
        : "Sin prioridad";
    },
  },
  {
    label: "Encargado de aceptarla",
    property: "usr_juez",
    align: "center",
    valign: "center",
    width: 77.378,
  },
  {
    label: "Responsable de la tarea",
    property: "nom_responsable",
    align: "center",
    valign: "center",
    width: 77.378,
  },
  {
    label: "Fecha de Cumplimiento",
    property: "fecha_cumplimiento",
    align: "center",
    valign: "center",
    width: 60,
  },
  {
    label: "Observaciones",
    property: "desc_tar",
    align: "center",
    valign: "center",
    width: 135,
  },
];

/** CONFIGURACIONES DE LOS GRAFICOS */
const options = {
  layout: {
    padding: 30,
  },
  plugins: {
    title: {
      display: true,
      position: "bottom",
      text: "Cantidad de tareas por área",
      padding: {
        top: 10,
      },
    },
  },
};

//Tratamiento de datos de areas

const infoArrayAreas = (datosAreas = []) => {
  const arrayAreas = [];

  const arrayCantTareas = [];

  datosAreas.forEach((dato, index) => {
    arrayCantTareas[index] = dato.tot_tareas;
    arrayAreas[index] = dato.area_nombre;
  });

  return [arrayAreas, arrayCantTareas];
};

const buildPDF = async (datas = [], datosAreas = []) => {
  return await new Promise((resolve, reject) => {
    try {
      //genero el PDF
      const doc = new PDFDocument({
        margin: 10,
        size: "A4",
        layout: "landscape",
      });

      writeStream = fs.createWriteStream("./reports/informe.pdf");
      doc.pipe(writeStream);

      //config de la Tabla
      const table = {
        title:
          "TAREAS DE MANTENIMIENTO - Cooperativa Agropecuaria La Paz Ltda.",
        subtitle: `Total de tareas ${datas.length}`,
        headers: headers,
        datas,
      };

      // creo la tabla y a su vez configuro el background a la columna prioridad:
      doc.table(table, {
        prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
        prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
          doc.font("Helvetica").fontSize(8);

          const prioridad = Number(row.priori_tar);

          indexColumn === 6 && prioridad === 1
            ? doc.addBackground(rectCell, "red", 0.15)
            : indexColumn === 6 && prioridad === 2
            ? doc.addBackground(rectCell, "yellow", 0.15)
            : indexColumn === 6 &&
              prioridad === 3 &&
              doc.addBackground(rectCell, "green", 0.15);
        },
      });

      doc.end();

      writeStream.on("finish", async () => {
        //si el usuario pidio de las areas graficos:
        try {
          if (datosAreas) {
            await generarGrafico(datosAreas);
          }

          resolve();
        } catch (error) {
          reject(error);
        }
      });
    } catch (error) {
      reject("No se pudo generar informe: ", error);
    }
  });
};

const generarGrafico = async (datosAreas = []) => {
  try {
    if (datosAreas.length === 0) {
      return;
    }

    const dataAreas = infoArrayAreas(datosAreas);
    // creo un chart con ChartJS
    const chartJSNodeCanvas = new ChartJSNodeCanvas({
      type: "pdf",
      width: 841.89,
      height: 595.28,
    });

    const configuration = {
      type: "bar",
      data: {
        labels: dataAreas[0],
        datasets: [
          {
            label: "Areas",
            data: dataAreas[1],
            backgroundColor: "rgba(30, 132, 73, 1)",
          },
        ],
      },
      options,
    };

    // Generate chart image
    const imageBuffer = await chartJSNodeCanvas.renderToBufferSync(
      configuration
    );

    const merger = new PDFMerger();

    await merger.add("./reports/informe.pdf");
    await merger.add(imageBuffer);

    await merger.setMetadata({
      producer: "CALP API Mantenimiento",
      author: "CALP API Mantenimiento",
      creator: "CALP API Mantenimiento",
      title: "Informe",
    });

    const mergedPdfBuffer = await merger.saveAsBuffer();

    await fs.writeFileSync("./reports/informe.pdf", mergedPdfBuffer);
  } catch (error) {
    throw new Error("No se pudo generar grafico: ", error);
  }
};

module.exports = {
  buildPDF,
};
