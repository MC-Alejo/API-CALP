const fs = require("fs");
const { CronJob } = require("cron");
const { crearBackup } = require("../helpers/backups");

const validFrequency = ["daily", "weekly", "monthly", "none"];

class BackupScheduler {
  constructor() {
    this.frequency = "none";
    this.currentTask = null;

    this.loadConfig();
  }

  loadConfig() {
    try {
      const data = fs.readFileSync("./config.json", "utf8");
      const config = JSON.parse(data);
      const freq = config.frequency;
      //valido que la frecuencia sea una frecuencia valida
      if (validFrequency.includes(freq)) {
        this.frequency = freq;
      } else {
        //en el caso que no venga una frecuencia bien definida entonces la seteo para que sobreescriba el archivo e inicio la task
        return this.setFreq("none");
      }

      // Crear la tarea
      this.initTask();
    } catch (error) {
      console.error("Error al cargar la configuración:", error);
    }
  }

  getFreq() {
    return this.frequency;
  }

  async setFreq(freq) {
    this.frequency = freq;

    //creo la data en un objeto
    const data = {
      frequency: freq,
    };

    //transformo la data en un string para almacenarlo en el archivo config
    const config = JSON.stringify(data, null, 2);

    fs.writeFile("./config.json", config, (error) => {
      if (error) {
        this.frequency = "none";
        throw error;
      }
    });

    // Reprogramar la tarea con la nueva frecuencia
    this.initTask();
  }

  initTask() {
    //si no hay ninguna frecuencia o la frecuencia directamente es ninguna entonces si existe alguna tarea corriendo la detengo y la seteo en null
    if (!this.frequency || this.frequency === "none") {
      if (this.currentTask) this.currentTask.stop();
      this.currentTask = null;
      return;
    }

    let cronExpression;

    //dependiendo de la frecuencia seteo la expresion del cron
    switch (this.frequency) {
      case "daily": // diario
        cronExpression = "0 17 * * *"; // todos los días a las 17hs
        break;
      case "weekly": // semanal
        cronExpression = "0 17 * * 1"; // todos los lunes a las 17hs
        break;
      case "monthly": // mensual
        cronExpression = "0 17 1 * *"; // el primer día de cada mes a las 17hs
        break;
      default:
        if (this.currentTask) this.currentTask.stop();
        this.currentTask = null;
        return;
    }

    if (this.currentTask) this.currentTask.stop();
    this.currentTask = null;

    // Programar la nueva tarea de backup
    this.currentTask = new CronJob(
      cronExpression, // cronTime
      async () => {
        const backupRealizado = await crearBackup();
        const cadena = backupRealizado
          ? "Se realizó un backup automático"
          : "No se pudo realizar el backup automático";

        console.log(cadena);
      }, // onTick
      null, // onComplete
      true, // start
      "America/Argentina/Buenos_Aires" // timeZone
    );
  }
}

const scheduler = new BackupScheduler();

const backupAuto = () => {
  if (scheduler) {
    return scheduler.getFreq();
  }
  return false;
};

const configurarBackupAuto = (freq) => {
  if (scheduler) {
    switch (freq) {
      case "d":
        scheduler.setFreq("daily");
        break;
      case "w":
        scheduler.setFreq("weekly");
        break;
      case "m":
        scheduler.setFreq("monthly");
        break;
      default:
        scheduler.setFreq("none");
        break;
    }
  }
};

module.exports = {
  backupAuto,
  configurarBackupAuto,
};
