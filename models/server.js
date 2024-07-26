const express = require("express");
const cors = require("cors");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      //uploads: "/api/uploads",
      alarma: "/api/alarmas",
      areas: "/api/areas",
      auth: "/api/auth",
      backup: "/api/backup",
      depositos: "/api/depositos",
      empleados: "/api/empleados",
      inventario: "/api/inventario",
      maquinaria: "/api/maquinaria",
      reportes: "/api/reports",
      restore: "/api/restore",
      sectores: "/api/sectores",
      solicitudes: "/api/solicitudes",
      tareas: "/api/tareas",
      usuarios: "/api/usuarios",
    };

    // Middlewares - funciones que añaden funcionalidades al web server
    this.middlewares();

    // Rutas de mi aplicación
    this.routes();
  }

  middlewares() {
    // CORS - configuración para que cualquier persona pueda hacer peticiones a mi servidor
    this.app.use(cors());

    // Lectura y parseo del body
    this.app.use(express.json()); // Middleware que parsea el body a formato json, es decir, que cualquier cosa que venga del body lo va a intentar serializar a formato json

    // Directorio público
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.paths.alarma, require("../routes/alarma"));
    this.app.use(this.paths.areas, require("../routes/areas"));
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.backup, require("../routes/backups"));
    this.app.use(this.paths.depositos, require("../routes/depositos"));
    this.app.use(this.paths.empleados, require("../routes/empleados"));
    this.app.use(this.paths.inventario, require("../routes/inventario"));
    this.app.use(this.paths.maquinaria, require("../routes/maquinaria"));
    this.app.use(this.paths.reportes, require("../routes/reportes"));
    this.app.use(this.paths.restore, require("../routes/restore"));
    this.app.use(this.paths.sectores, require("../routes/sectores"));
    this.app.use(this.paths.solicitudes, require("../routes/solicitudes"));
    this.app.use(this.paths.tareas, require("../routes/tareas"));
    this.app.use(this.paths.usuarios, require("../routes/usuarios"));
    //this.app.use(this.paths.uploads, require('../routes/uploads'))
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en puerto: ${this.port}`);
    });
  }
}

module.exports = Server;
