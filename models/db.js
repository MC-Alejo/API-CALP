const { Pool } = require("pg");

class DataBase {
  constructor() {
    //a q bd? le tengo que decir a donde conectarse
    // Client busca en las variables de entorno por eso es que le tengo que decir a q bd conectar
    // - a que servidor conectar o host en el que se encuentra
    // - nombre de la bd
    // - necesitamos saber el puerto en el que corre la bd, esto basicamente es por si tenemos muchas bd (postgres por defecto en 5432)
    // - necesitamos el usuario y la contraseña
    this.client = new Pool({
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      port: process.env.PGPORT,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      idleTimeoutMillis: 1, //TODO: DOCUMENTAR ESTO
      max: 50,
    });

    this.client.on("error", (err) => {
      console.error("Unexpected error on idle client");
    });
  }

  // ----------------- Querys de los usuarios:  -----------------
  async getUsuarios() {
    const text = `SELECT id, nombre, apellido, email, 'EA' as rol FROM usuario
        JOIN encargado_area ea
        on usuario.id = ea.id_usuario
        where estado = true
        UNION SELECT id, nombre, apellido, email, 'GO' as rol FROM usuario
        JOIN gerente g
        on usuario.id = g.id_usuario
        where estado = true
        UNION SELECT id, nombre, apellido, email, 'JM' as rol FROM usuario
        JOIN jefe_mantenimiento jm
        on usuario.id = jm.id_usuario
        where estado = true`;
    const resp = await this.client.query(text);
    return resp.rows;
  }

  async getUsuarioPorCorreo(email = "") {
    const text = "SELECT * FROM usuario WHERE email = $1";
    const values = [email];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  async getUsuarioPorId(id) {
    const text = "SELECT * FROM usuario WHERE id = $1";
    const values = [id];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  async getEncargadosArea() {
    const text = `SELECT id, nombre, apellido, email, 'EA' as rol FROM usuario
        JOIN encargado_area ea
        on usuario.id = ea.id_usuario
        where estado = true`;

    const resp = await this.client.query(text);
    return resp.rows;
  }

  async getJefesMantenimiento() {
    const text = `SELECT id, nombre, apellido, email, 'JM' as rol FROM usuario
        JOIN jefe_mantenimiento jm
        on usuario.id = jm.id_usuario
        where estado = true`;
    const resp = await this.client.query(text);
    return resp.rows;
  }

  async getGerentesOperativos() {
    const text = `SELECT id, nombre, apellido, email, 'GO' as rol FROM usuario
        JOIN gerente g
        on usuario.id = g.id_usuario
        where estado = true`;
    const resp = await this.client.query(text);
    return resp.rows;
  }

  async crearUsuario({ id, nombre, apellido, email, password }) {
    const text =
      "INSERT INTO usuario (id, nombre, apellido, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *"; // el RETURNING * es para que me devuelva el objeto que se inserto
    const values = [id, nombre, apellido, email, password];

    const resp = await this.client.query(text, values);

    return resp.rows[0];
  }

  async actualizarUsuario(id, { nombre, apellido, email, password }) {
    const setNombre = "UPDATE usuario SET nombre = $1 WHERE id = $2";
    const setApellido = "UPDATE usuario SET apellido = $1 WHERE id = $2";
    const setEmail = "UPDATE usuario SET email = $1 WHERE id = $2";
    const setPassword = "UPDATE usuario SET password = $1 WHERE id = $2";
    const text = "SELECT * FROM usuario WHERE id = $1";

    if (nombre) {
      const values = [nombre, id];
      await this.client.query(setNombre, values);
    }
    if (apellido) {
      const values = [apellido, id];
      await this.client.query(setApellido, values);
    }
    if (email) {
      const values = [email, id];
      await this.client.query(setEmail, values);
    }
    if (password) {
      const values = [password, id];
      await this.client.query(setPassword, values);
    }

    const values = [id];
    const resp = await this.client.query(text, values);

    return resp.rows[0];
  }

  async eliminarUsuario(id) {
    const text = "UPDATE usuario SET estado = false WHERE id = $1 RETURNING *";
    const values = [id];

    const resp = await this.client.query(text, values);
    return resp;
  }

  async validarEmailExiste(correo = "") {
    const text = "SELECT * FROM usuario WHERE email = $1";
    const values = [correo];

    const resp = await this.client.query(text, values);

    return resp.rowCount;
  }

  async asignarRol(id, rol, idArea, idDeposito) {
    let text;
    let values;

    if (rol === "GO") {
      text = "INSERT INTO gerente(id_usuario) VALUES ($1) RETURNING *";
      values = [id];
    } else if (rol === "JM") {
      text =
        "INSERT INTO jefe_mantenimiento(id_usuario, id_deposito) VALUES ($1, $2) RETURNING *";
      values = [id, idDeposito];
    } else if (rol === "EA") {
      text =
        "INSERT INTO encargado_area(id_usuario, id_area) VALUES ($1, $2) RETURNING *";
      values = [id, idArea];
    } else {
      return new Error("Error al asignar rol");
    }

    const resp = await this.client.query(text, values);

    return resp.rows[0];
  }

  async getRol(id) {
    const buscarGerente = "SELECT * FROM gerente WHERE id_usuario = $1";
    const values = [id];

    const resp = await this.client.query(buscarGerente, values);
    if (resp.rowCount > 0) {
      return "GO";
    }

    const buscarJefe = "SELECT * FROM jefe_mantenimiento WHERE id_usuario = $1";
    const resp2 = await this.client.query(buscarJefe, values);
    if (resp2.rowCount > 0) {
      return "JM";
    }

    const buscarEncargado =
      "SELECT * FROM encargado_area WHERE id_usuario = $1";
    const resp3 = await this.client.query(buscarEncargado, values);
    if (resp3.rowCount > 0) {
      return "EA";
    }

    return null;
  }

  async validarAreaDefinida(id_area) {
    const text = "SELECT id_usuario FROM encargado_area WHERE id_area = $1";
    const values = [id_area];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  async demitirAreaAEncargado(id) {
    const text =
      "UPDATE encargado_area SET id_area = NULL WHERE id_usuario = $1";
    const values = [id];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  async updateAreaDeEncargado(id, id_area) {
    const text = "UPDATE encargado_area SET id_area = $2 WHERE id_usuario = $1";
    const values = [id, id_area];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  async getAreaDelUsuario(id) {
    const text = "SELECT id_area FROM encargado_area WHERE id_usuario = $1";
    const values = [id];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  async validarJefeDefinido(id) {
    const text =
      "SELECT id_usuario FROM jefe_mantenimiento WHERE id_deposito = $1";
    const values = [id];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  // ----------------- Querys de las areas:  -----------------

  async getAreas() {
    const text = "SELECT id, nombre FROM area WHERE estado = true";
    const resp = await this.client.query(text);
    return resp.rows;
  }

  async getAreasYEncargados() {
    const text = `SELECT
    a.id AS id_area,
    a.nombre AS nombre_area,
    us.nombre AS nombre_encargado,
    us.apellido AS apellido_encargado
    FROM area a
    LEFT JOIN encargado_area ea
    ON a.id = ea.id_area
    LEFT JOIN usuario us
    ON us.id = ea.id_usuario
    WHERE a.estado = true`;
    const resp = await this.client.query(text);
    return resp.rows;
  }

  async getAreaPorId(id) {
    const text = "SELECT * FROM area WHERE id = $1";
    const values = [id];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  async getAreaPorNombre(nombre) {
    const text = "SELECT * FROM area WHERE nombre = $1";
    const values = [nombre];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  async crearArea(nombre) {
    const text = "INSERT INTO area (nombre) VALUES ($1) RETURNING *";
    const values = [nombre];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  async actualizarNombreArea(id, nombre) {
    const text = "UPDATE area SET nombre = $2 WHERE id = $1";
    const values = [id, nombre];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  async eliminarArea(id) {
    const text = "UPDATE area SET estado = false WHERE id = $1";
    const values = [id];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  async darBajaSectoresArea(id_area) {
    const text = "UPDATE sector SET estado = false WHERE id_area = $1";
    const values = [id_area];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  // ----------------- Querys de los depositos:  -----------------

  async obtenerDepositos() {
    const text = `
    SELECT
    depo.id AS id_deposito,
    depo.nombre nombre_deposito,
    usuario.nombre nombre_jefe,
    usuario.apellido apellido_jefe
    FROM deposito depo
    LEFT JOIN jefe_mantenimiento jefe
    ON depo.id = jefe.id_deposito
    LEFT JOIN usuario usuario
    ON jefe.id_usuario = usuario.id
    `;
    const resp = await this.client.query(text);
    return resp.rows;
  }

  async getDepositoPorId(id) {
    const text = "SELECT * FROM deposito WHERE id = $1";
    const values = [id];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  async getDepositoPorNombre(nombre) {
    const text = "SELECT * FROM deposito WHERE nombre = $1";
    const values = [nombre];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  async getInventarioDeposito(id) {
    const text =
      "SELECT id, nombre, stock, id_deposito FROM inventario WHERE id_deposito = $1 AND estado = true";
    const values = [id];

    const resp = await this.client.query(text, values);
    return resp.rows;
  }

  async getDepositoDeJefe(id) {
    const text =
      "SELECT id, nombre FROM deposito WHERE id = (SELECT id_deposito FROM jefe_mantenimiento WHERE id_usuario = $1)";
    const values = [id];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  async crearDeposito(nombre) {
    const text = "INSERT INTO deposito (nombre) VALUES ($1) RETURNING *";
    const values = [nombre];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  async actualizarDeposito(id, nombre) {
    const text = "UPDATE deposito SET nombre = $2 WHERE id = $1 RETURNING *";
    const values = [id, nombre];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  // ----------------- Querys del inventario: -----------------

  async getInventario() {
    const text =
      "SELECT id, nombre, stock, id_deposito FROM inventario WHERE estado = true";
    const resp = await this.client.query(text);
    return resp.rows;
  }

  async getInventarioPorId(id) {
    const text = "SELECT * FROM inventario WHERE id = $1";
    const values = [id];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  async getInventarioPorNombre(nombre) {
    const text = "SELECT * FROM inventario WHERE nombre = $1";
    const values = [nombre];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  async agregarAInventario(nombre, stock, id_deposito) {
    const text =
      "INSERT INTO inventario (nombre, stock, id_deposito) VALUES ($1, $2, $3) RETURNING *";
    const values = [nombre, stock, id_deposito];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  async modificarInventario(id, { nombre, stock }) {
    const setNombre = "UPDATE inventario SET nombre = $1 WHERE id = $2";
    const setStock = "UPDATE inventario SET stock = $1 WHERE id = $2";
    const text = "SELECT * FROM inventario WHERE id = $1";

    if (nombre) {
      const values = [nombre, id];
      await this.client.query(setNombre, values);
    }
    if (stock || stock === 0) {
      const values = [stock, id];
      await this.client.query(setStock, values);
    }

    const values = [id];
    const resp = await this.client.query(text, values);

    return resp.rows[0];
  }

  async eliminarInventario(id) {
    const text =
      "UPDATE inventario SET estado = false WHERE id = $1 RETURNING *";
    const values = [id];

    const resp = await this.client.query(text, values);
    return resp;
  }

  // ----------------- Query de los sectores:  -----------------
  async crearSector(id_area, nombre) {
    const text =
      "INSERT INTO sector (id_area, nombre) VALUES ($1, $2) RETURNING *";
    const values = [id_area, nombre];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  async actualizarSector(id, { nombre, id_area }) {
    const setNombre = "UPDATE sector SET nombre = $1 WHERE id = $2";
    const setIdArea = "UPDATE sector SET id_area = $1 WHERE id = $2";
    const text = "SELECT * FROM sector WHERE id = $1";

    if (nombre) {
      const values = [nombre, id];
      await this.client.query(setNombre, values);
    }
    if (id_area) {
      const values = [id_area, id];
      await this.client.query(setIdArea, values);
    }

    const values = [id];
    const resp = await this.client.query(text, values);

    return resp.rows[0];
  }

  async eliminarSector(id) {
    const text = "UPDATE sector SET estado = false WHERE id = $1";
    const values = [id];

    const resp = await this.client.query(text, values);

    return resp.rows[0];
  }

  async getSectores() {
    const text = "SELECT id, nombre, id_area FROM sector WHERE estado = true";
    const resp = await this.client.query(text);
    return resp.rows;
  }

  async getSectorPorId(id) {
    const text = "SELECT * FROM sector WHERE id = $1";
    const values = [id];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  async getSectoresPorIdArea(id_area) {
    const text =
      "SELECT id, nombre, id_area from sector where id_area = $1 AND estado = true";
    const values = [id_area];

    const resp = await this.client.query(text, values);
    return resp.rows;
  }

  async getEquipamientosPorSector(id_sector) {
    const text =
      "SELECT id, nombre, id_sector FROM equipamiento WHERE id_sector = $1 AND estado = true";
    const values = [id_sector];

    const resp = await this.client.query(text, values);
    return resp.rows;
  }

  // ----------------- Querys de los responsables/empleados: -----------------
  async getEmpleados() {
    const text =
      "SELECT id, nombre, email, telefono FROM responsable WHERE estado = true";
    const resp = await this.client.query(text);
    return resp.rows;
  }

  async getEmpleadoByID(id) {
    const text = "SELECT * FROM responsable WHERE id = $1";
    const values = [id];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  async getEmpleadoByCorreo(email) {
    const text = "SELECT * FROM responsable WHERE email = $1";
    const values = [email];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  async getEmpleadoByTelefono(telefono) {
    const text = "SELECT * FROM responsable WHERE telefono = $1";
    const values = [telefono];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  async crearEmpleado(nombre, email, telefono) {
    const text =
      "INSERT INTO responsable (nombre, email, telefono) VALUES ($1, $2, $3) RETURNING *";
    const values = [nombre, email, telefono];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  async actualizarEmpleado(id, { nombre, email, telefono }) {
    const setNombre = "UPDATE responsable SET nombre = $1 WHERE id = $2";
    const setEmail = "UPDATE responsable SET email = $1 WHERE id = $2";
    const setTelefono = "UPDATE responsable SET telefono = $1 WHERE id = $2";
    const text = "SELECT * FROM responsable WHERE id = $1";

    if (nombre) {
      const values = [nombre, id];
      await this.client.query(setNombre, values);
    }

    if (email) {
      const values = [email, id];
      await this.client.query(setEmail, values);
    }

    if (telefono) {
      const values = [telefono, id];
      await this.client.query(setTelefono, values);
    }

    const values = [id];
    const resp = await this.client.query(text, values);

    return resp.rows[0];
  }

  async eliminarEmpleado(id) {
    const text = "UPDATE responsable SET estado = false WHERE id = $1";
    const values = [id];

    const resp = await this.client.query(text, values);

    return resp.rows[0];
  }

  // ----------------- Querys del equipamiento: -----------------

  async getEquipamientos() {
    const text =
      "SELECT id, nombre, id_sector FROM equipamiento WHERE estado = true";
    const resp = await this.client.query(text);
    return resp.rows;
  }

  async getEquipamientoPorId(id) {
    const text = "SELECT * FROM equipamiento WHERE id = $1";
    const values = [id];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  async existeEquipamientoEnArea(id_area, id_equipamiento) {
    const text = `
      SELECT area.id as id_area, sec.id as id_sector, maq.id as id_equipo FROM area area
      JOIN sector sec
      ON area.id = sec.id_area
      JOIN equipamiento maq
      ON sec.id = maq.id_sector
      WHERE area.id = $1 AND maq.id = $2
    `;
    const values = [id_area, id_equipamiento];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  async crearEquipamiento(nombre, id_sector) {
    const text =
      "INSERT INTO equipamiento (nombre, id_sector) VALUES ($1, $2) RETURNING *";
    const values = [nombre, id_sector];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  async actualizarEquipamiento(id, { nombre, id_sector }) {
    const setNombre = "UPDATE equipamiento SET nombre = $1 WHERE id = $2";
    const setIdArea = "UPDATE equipamiento SET id_sector = $1 WHERE id = $2";
    const text = "SELECT * FROM equipamiento WHERE id = $1";

    if (nombre) {
      const values = [nombre, id];
      await this.client.query(setNombre, values);
    }
    if (id_sector) {
      const values = [id_sector, id];
      await this.client.query(setIdArea, values);
    }

    const values = [id];
    const resp = await this.client.query(text, values);

    return resp.rows[0];
  }

  async eliminarEquipamiento(id) {
    const text = "UPDATE equipamiento SET estado = false WHERE id = $1";
    const values = [id];

    const resp = await this.client.query(text, values);

    return resp.rows[0];
  }

  // ----------------- Querys de las alarma: -----------------

  async getAlarmas() {
    const text = "select * from tarea WHERE fecha > date(now())";
    const resp = await this.client.query(text);
    return resp.rows;
  }

  async getAlarmasOrdenadas() {
    const text =
      "select * from tarea WHERE fecha > date(now()) ORDER BY fecha ASC";
    const resp = await this.client.query(text);
    return resp.rows;
  }

  async getAlarmasPorIdMaquina(id) {
    const text =
      "SELECT t.id AS id_tarea, t.estado AS estado_tarea, t.fecha AS fecha_alarma, t.fechacumplimiento, t.descripcion AS descripcion_tarea, t.prioridad AS prioridad_tarea, t.id_solicitud, id_responsable  FROM tarea AS t JOIN solicitud AS s ON t.id_solicitud = s.id WHERE t.fecha > date(now()) AND s.id_equipamiento = $1 ORDER BY t.fecha ASC";
    const values = [id];
    const resp = await this.client.query(text, values);
    return resp.rows;
  }

  async getAlarmasPorJuez(id_juez) {
    const text = `SELECT
        s.id_usuario AS usr_solicitante,
        s.id AS id_solicitud,
        s.estado AS estado_solicitud,
        s.fecha AS fecha_soli_realizada,
        s.descripcion AS desc_solicitud,
        s.id_equipamiento,
        tar.id AS id_tarea,
        tar.estado AS estado_tarea,
        tar.fecha AS fecha_alarma,
        tar.fechaCumplimiento AS fecha_cumplimiento,
        tar.descripcion AS desc_tar,
        tar.prioridad AS priori_tar,
        tar.id_responsable AS responsable_tar
    FROM solicitud s
    JOIN tarea tar
    ON tar.id_solicitud = s.id
    WHERE tar.fecha > date(now()) AND s.id_juez = $1
    ORDER BY tar.fecha ASC`;
    const values = [id_juez];

    const resp = await this.client.query(text, values);
    return resp.rows;
  }

  async getAlarmasPorMaquinaJuez(id_juez, id) {
    const text = `SELECT
        s.id_usuario AS usr_solicitante,
        s.id AS id_solicitud,
        s.estado AS estado_solicitud,
        s.fecha AS fecha_soli_realizada,
        s.descripcion AS desc_solicitud,
        s.id_equipamiento,
        tar.id AS id_tarea,
        tar.estado AS estado_tarea,
        tar.fecha AS fecha_alarma,
        tar.fechaCumplimiento AS fecha_cumplimiento,
        tar.descripcion AS desc_tar,
        tar.prioridad AS priori_tar,
        tar.id_responsable AS responsable_tar
    FROM solicitud s
    JOIN tarea tar
    ON tar.id_solicitud = s.id
    WHERE tar.fecha > date(now()) AND id_juez = $1 AND id_equipamiento = $2
    ORDER BY tar.fecha ASC`;
    const values = [id_juez, id];

    const resp = await this.client.query(text, values);
    return resp.rows;
  }

  async getAlarma(id) {
    const text = "SELECT * FROM tarea WHERE id = $1 AND fecha > DATE(now())";
    const values = [id];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  async actualizarAlarma(id, { descripcion, prioridad, fecha }) {
    const setDescripcion = "UPDATE tarea SET descripcion = $1 WHERE id = $2";
    const setPrioridad = "UPDATE tarea SET prioridad = $1 WHERE id = $2";
    const setFecha = "UPDATE tarea SET fecha = $1 WHERE id = $2";
    const text = "SELECT * FROM tarea WHERE id = $1";

    if (descripcion) {
      const values = [descripcion, id];
      await this.client.query(setDescripcion, values);
    }
    if (prioridad) {
      const values = [prioridad, id];
      await this.client.query(setPrioridad, values);
    }
    if (fecha) {
      const values = [fecha, id];
      await this.client.query(setFecha, values);
    }

    const values = [id];
    const resp = await this.client.query(text, values);

    return resp.rows[0];
  }

  async eliminarAlarmaMantenimiento(id, id_solicitud) {
    const eliminarAlarm =
      "DELETE FROM tarea WHERE id = $1 AND fecha > DATE(now())";
    const eliminarSoliAlarm = "DELETE FROM solicitud WHERE id = $1";
    const values = [id];
    const values_soli = [id_solicitud];

    const resp1 = await this.client.query(eliminarAlarm, values);
    const resp2 = await this.client.query(eliminarSoliAlarm, values_soli);

    return { elim_alarm: resp1.rows[0], elim_solicitud: resp2.rows[0] };
  }

  // ----------------- Querys de las solicitudes: -----------------

  async getSolicitudes() {
    const text = `
    SELECT
      soli.id AS id_solicitud,
      soli.descripcion AS descripcion,
      soli.estado AS estado,
      soli.fecha AS fecha,
      soli.id_juez AS id_juez,
      usuJuez.nombre AS nombre_juez,
      usuJuez.apellido AS apellido_juez,
      soli.id_usuario AS id_usuario_soli,
      usuSolicitante.nombre AS nombre_solicitante,
      usuSolicitante.apellido AS apellido_solicitante,
      soli.id_equipamiento AS id_equipamiento,
      maq.nombre AS nombre_equipamiento,
      sec.id AS id_sector,
      sec.nombre AS nombre_sector
    FROM solicitud soli
    JOIN equipamiento maq ON maq.id = soli.id_equipamiento
    JOIN sector sec ON sec.id = maq.id_sector
    LEFT JOIN usuario usuJuez ON soli.id_juez = usuJuez.id
    JOIN usuario usuSolicitante ON soli.id_usuario = usuSolicitante.id
    `;
    const resp = await this.client.query(text);
    return resp.rows;
  }

  async getSolicitudesOrdenadas() {
    const text = `
    SELECT
      soli.id AS id_solicitud,
      soli.descripcion AS descripcion,
      soli.estado AS estado,
      soli.fecha AS fecha,
      soli.id_juez AS id_juez,
      usuJuez.nombre AS nombre_juez,
      usuJuez.apellido AS apellido_juez,
      soli.id_usuario AS id_usuario_soli,
      usuSolicitante.nombre AS nombre_solicitante,
      usuSolicitante.apellido AS apellido_solicitante,
      soli.id_equipamiento AS id_equipamiento,
      maq.nombre AS nombre_equipamiento,
      sec.id AS id_sector,
      sec.nombre AS nombre_sector
    FROM solicitud soli
    JOIN equipamiento maq ON maq.id = soli.id_equipamiento
    JOIN sector sec ON sec.id = maq.id_sector
    LEFT JOIN usuario usuJuez ON soli.id_juez = usuJuez.id
    JOIN usuario usuSolicitante ON soli.id_usuario = usuSolicitante.id
    ORDER BY CASE WHEN soli.estado = 'pendiente' THEN 0 ELSE 1 END, soli.fecha DESC
    `;
    const resp = await this.client.query(text);
    return resp.rows;
  }

  async getSolicitudesPorIdUsuario(id, estado = "") {
    const text = `SELECT
      soli.id AS id_solicitud,
      soli.descripcion AS descripcion,
      soli.estado AS estado,
      soli.fecha AS fecha,
      soli.id_juez AS id_juez,
      usuJuez.nombre AS nombre_juez,
      usuJuez.apellido AS apellido_juez,
      soli.id_usuario AS id_usuario_soli,
      usuSolicitante.nombre AS nombre_solicitante,
      usuSolicitante.apellido AS apellido_solicitante,
      soli.id_equipamiento AS id_equipamiento,
      maq.nombre AS nombre_equipamiento,
      sec.id AS id_sector,
      sec.nombre AS nombre_sector
    FROM solicitud soli
    JOIN equipamiento maq ON maq.id = soli.id_equipamiento
    JOIN sector sec ON sec.id = maq.id_sector
    LEFT JOIN usuario usuJuez ON soli.id_juez = usuJuez.id
    JOIN usuario usuSolicitante ON soli.id_usuario = usuSolicitante.id
    WHERE soli.id_usuario = $1
    ORDER BY soli.fecha DESC`;
    const values = [id];

    if (estado !== "") {
      const text = `SELECT
        soli.id AS id_solicitud,
        soli.descripcion AS descripcion,
        soli.estado AS estado,
        soli.fecha AS fecha,
        soli.id_juez AS id_juez,
        usuJuez.nombre AS nombre_juez,
        usuJuez.apellido AS apellido_juez,
        soli.id_usuario AS id_usuario_soli,
        usuSolicitante.nombre AS nombre_solicitante,
        usuSolicitante.apellido AS apellido_solicitante,
        soli.id_equipamiento AS id_equipamiento,
        maq.nombre AS nombre_equipamiento,
        sec.id AS id_sector,
        sec.nombre AS nombre_sector
      FROM solicitud soli
      JOIN equipamiento maq ON maq.id = soli.id_equipamiento
      JOIN sector sec ON sec.id = maq.id_sector
      LEFT JOIN usuario usuJuez ON soli.id_juez = usuJuez.id
      JOIN usuario usuSolicitante ON soli.id_usuario = usuSolicitante.id
      WHERE soli.id_usuario = $1 AND soli.estado = $2`;
      const values = [id, estado];
      const resp = await this.client.query(text, values);
      return resp.rows;
    }

    const resp = await this.client.query(text, values);
    return resp.rows;
  }

  async getSolicitudPorId(id) {
    const text = `
    SELECT
      soli.id AS id_solicitud,
      soli.descripcion AS descripcion,
      soli.estado AS estado,
      soli.fecha AS fecha,
      soli.id_juez AS id_juez,
      usuJuez.nombre AS nombre_juez,
      usuJuez.apellido AS apellido_juez,
      soli.id_usuario AS id_usuario_soli,
      usuSolicitante.nombre AS nombre_solicitante,
      usuSolicitante.apellido AS apellido_solicitante,
      soli.id_equipamiento AS id_equipamiento,
      maq.nombre AS nombre_equipamiento,
      sec.id AS id_sector,
      sec.nombre AS nombre_sector
    FROM solicitud soli
    JOIN equipamiento maq ON maq.id = soli.id_equipamiento
    JOIN sector sec ON sec.id = maq.id_sector
    LEFT JOIN usuario usuJuez ON soli.id_juez = usuJuez.id
    JOIN usuario usuSolicitante ON soli.id_usuario = usuSolicitante.id
    WHERE soli.id = $1;`;
    const values = [id];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  async getSolicitudesPorEstado(estado) {
    const text = `
    SELECT
      soli.id AS id_solicitud,
      soli.descripcion AS descripcion,
      soli.estado AS estado,
      soli.fecha AS fecha,
      soli.id_juez AS id_juez,
      usuJuez.nombre AS nombre_juez,
      usuJuez.apellido AS apellido_juez,
      soli.id_usuario AS id_usuario_soli,
      usuSolicitante.nombre AS nombre_solicitante,
      usuSolicitante.apellido AS apellido_solicitante,
      soli.id_equipamiento AS id_equipamiento,
      maq.nombre AS nombre_equipamiento,
      sec.id AS id_sector,
      sec.nombre AS nombre_sector
    FROM solicitud soli
    JOIN equipamiento maq ON maq.id = soli.id_equipamiento
    JOIN sector sec ON sec.id = maq.id_sector
    LEFT JOIN usuario usuJuez ON soli.id_juez = usuJuez.id
    JOIN usuario usuSolicitante ON soli.id_usuario = usuSolicitante.id
    WHERE soli.estado = $1;
    `;
    const values = [estado];

    const resp = await this.client.query(text, values);
    return resp.rows;
  }

  async getTareaPorIdSolicitud(id_solicitud) {
    const text = "SELECT * FROM tarea WHERE id_solicitud = $1";
    const values = [id_solicitud];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  async crearSolicitud(descripcion, id_equipamiento, id_usuario) {
    const text =
      "INSERT INTO solicitud (estado, fecha, descripcion, id_equipamiento, id_usuario) VALUES ($1, LOCALTIMESTAMP, $2, $3, $4) RETURNING *";
    const values = ["pendiente", descripcion, id_equipamiento, id_usuario];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  async modificarEstadoSolicitud(id, estado) {
    const text = "UPDATE solicitud SET estado = $1 WHERE id = $2 RETURNING *";
    const values = [estado, id];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  async setJuezSolicitud(id, id_juez) {
    const text = "UPDATE solicitud SET id_juez = $1 WHERE id = $2 RETURNING *";
    const values = [id_juez, id];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  // ----------------- Querys de las tareas: -----------------

  async getTareas() {
    const text = "SELECT * FROM tarea";
    const resp = await this.client.query(text);
    return resp.rows;
  }

  async getTareasOrdenadas() {
    const text = `
    SELECT * FROM tarea
    WHERE fecha <= date(now())
    ORDER BY CASE
        WHEN estado = 'en curso' AND prioridad = 1 THEN 0
        ELSE CASE WHEN estado = 'en curso' AND prioridad = 2 THEN 1
        ELSE CASE WHEN estado = 'en curso' AND prioridad = 3 THEN 2
        ELSE CASE WHEN estado = 'en curso' THEN 3 ELSE 4
    END
    END
    END
    END,
    fecha DESC;
    `;
    const resp = await this.client.query(text);
    return resp.rows;
  }

  async getTareasPorIdMaquina(id) {
    const text =
      "SELECT t.id AS id_tarea, t.estado AS estado_tarea, t.fecha AS fecha_tarea, t.fechacumplimiento, t.descripcion AS descripcion_tarea, t.prioridad AS prioridad_tarea, t.id_solicitud, id_responsable FROM tarea AS t JOIN solicitud AS s ON t.id_solicitud = s.id WHERE t.fecha <= date(now()) AND s.id_equipamiento = $1 ORDER BY t.fecha Desc;";
    const values = [id];
    const resp = await this.client.query(text, values);
    return resp.rows;
  }

  async getTareasPorEstado(estado) {
    const text =
      "SELECT * FROM tarea WHERE estado = $1 AND fecha <= date(now())";
    const values = [estado];

    const resp = await this.client.query(text, values);
    return resp.rows;
  }

  async getTareasPorPrioridad(prioridad) {
    const text =
      "SELECT * FROM tarea WHERE prioridad = $1 AND fecha <= date(now())";
    const values = [prioridad];

    const resp = await this.client.query(text, values);
    return resp.rows;
  }

  async getTareasPorJuez(id_juez) {
    const text = `SELECT
            s.id_usuario AS usr_solicitante,
            s.id AS id_solicitud,
            s.estado AS estado_solicitud,
            s.fecha AS fecha_soli_realizada,
            s.descripcion AS desc_solicitud,
            s.id_equipamiento,
            tar.id AS id_tarea,
            tar.estado AS estado_tarea,
            tar.fecha AS fecha_tar_tratada,
            tar.fechaCumplimiento AS fecha_cumplimiento,
            tar.descripcion AS desc_tar,
            tar.prioridad AS priori_tar,
            tar.id_responsable AS responsable_tar
        FROM solicitud s
        JOIN tarea tar
        ON tar.id_solicitud = s.id
        WHERE id_juez = $1 AND tar.fecha <= date(now())`;
    const values = [id_juez];

    const resp = await this.client.query(text, values);
    return resp.rows;
  }

  async getTareasPorJuezOrdenada(id_juez) {
    const text = `SELECT
        s.id_usuario AS usr_solicitante,
        s.id AS id_solicitud,
        s.estado AS estado_solicitud,
        s.fecha AS fecha_soli_realizada,
        s.descripcion AS desc_solicitud,
        s.id_equipamiento,
        tar.id AS id_tarea,
        tar.estado AS estado_tarea,
        tar.fecha AS fecha_tar_tratada,
        tar.fechaCumplimiento AS fecha_cumplimiento,
        tar.descripcion AS desc_tar,
        tar.prioridad AS priori_tar,
        tar.id_responsable AS responsable_tar
    FROM solicitud s
    JOIN tarea tar
    ON tar.id_solicitud = s.id
    WHERE tar.fecha <= date(now()) AND id_juez = $1
    ORDER BY CASE
    WHEN tar.estado = 'en curso' AND tar.prioridad = 1 THEN 0
    ELSE CASE WHEN tar.estado = 'en curso' AND tar.prioridad = 2 THEN 1
    ELSE CASE WHEN tar.estado = 'en curso' AND tar.prioridad = 3 THEN 2
    ELSE CASE WHEN tar.estado = 'en curso' THEN 3 ELSE 4
    END
    END
    END
    END,
    tar.fecha DESC`;
    const values = [id_juez];

    const resp = await this.client.query(text, values);
    return resp.rows;
  }

  async getTareasPorMaquinaJuezOrdenada(id_juez, id) {
    const text = `SELECT
        s.id_usuario AS usr_solicitante,
        s.id AS id_solicitud,
        s.estado AS estado_solicitud,
        s.fecha AS fecha_soli_realizada,
        s.descripcion AS desc_solicitud,
        s.id_equipamiento,
        tar.id AS id_tarea,
        tar.estado AS estado_tarea,
        tar.fecha AS fecha_tar_tratada,
        tar.fechaCumplimiento AS fecha_cumplimiento,
        tar.descripcion AS desc_tar,
        tar.prioridad AS priori_tar,
        tar.id_responsable AS responsable_tar
    FROM solicitud s
    JOIN tarea tar
    ON tar.id_solicitud = s.id
    WHERE tar.fecha <= date(now()) AND id_juez = $1 AND id_equipamiento = $2
    ORDER BY CASE
    WHEN tar.estado = 'en curso' AND tar.prioridad = 1 THEN 0
    ELSE CASE WHEN tar.estado = 'en curso' AND tar.prioridad = 2 THEN 1
    ELSE CASE WHEN tar.estado = 'en curso' AND tar.prioridad = 3 THEN 2
    ELSE CASE WHEN tar.estado = 'en curso' THEN 3 ELSE 4
    END
    END
    END
    END,
    tar.fecha DESC`;
    const values = [id_juez, id];

    const resp = await this.client.query(text, values);
    return resp.rows;
  }

  async getJuezDeTarea(id) {
    const text = `
    SELECT
        tar.id AS id_tarea,
        tar.estado AS tarea_estado,
        s.id AS id_solicitud,
        s.id_juez AS id_juez
    FROM solicitud s
    JOIN tarea tar
    ON tar.id_solicitud = s.id
    JOIN usuario userJ
    ON s.id_juez = userJ.id
    WHERE
    tar.fecha <= date(now()) AND tar.id = $1
    `;
    const values = [id];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  async getJuezDeAlarma(id) {
    const text = `
    SELECT
        tar.id AS id_tarea,
        tar.estado AS tarea_estado,
        s.id AS id_solicitud,
        s.id_juez AS id_juez
    FROM solicitud s
    JOIN tarea tar
    ON tar.id_solicitud = s.id
    JOIN usuario userJ
    ON s.id_juez = userJ.id
    WHERE
    tar.fecha > date(now()) AND tar.id = $1
    `;
    const values = [id];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  async crearTarea(
    estado,
    fecha,
    descripcion,
    prioridad,
    id_solicitud,
    id_responsable
  ) {
    let text;
    let values;

    if (!fecha) {
      values = [estado, descripcion, prioridad, id_solicitud, id_responsable];

      text =
        "INSERT INTO tarea (estado, fecha, descripcion, prioridad, id_solicitud, id_responsable) VALUES ($1, LOCALTIMESTAMP, $2, $3, $4, $5) RETURNING *";
    } else {
      values = [
        estado,
        fecha,
        descripcion,
        prioridad,
        id_solicitud,
        id_responsable,
      ];
      text =
        "INSERT INTO tarea (estado, fecha, descripcion, prioridad, id_solicitud, id_responsable) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
    }

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  async getTareaPorId(id) {
    const text = "SELECT * FROM tarea WHERE id = $1 AND fecha <= date(now())";
    const values = [id];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  async actualizarTarea(id, { descripcion, prioridad, id_responsable }) {
    const setDescripcion = "UPDATE tarea SET descripcion = $1 WHERE id = $2";
    const setPrioridad = "UPDATE tarea SET prioridad = $1 WHERE id = $2";
    const setIdResponsable =
      "UPDATE tarea SET id_responsable = $1 WHERE id = $2";
    const text = "SELECT * FROM tarea WHERE id = $1";

    if (descripcion) {
      const values = [descripcion, id];
      await this.client.query(setDescripcion, values);
    }
    if (prioridad) {
      const values = [prioridad, id];
      await this.client.query(setPrioridad, values);
    }
    if (id_responsable) {
      const values = [id_responsable, id];
      await this.client.query(setIdResponsable, values);
    }

    const values = [id];
    const resp = await this.client.query(text, values);

    return resp.rows[0];
  }

  async modificarEstadoTarea(id, estado) {
    let text;
    const values = [estado, id];

    if (estado === "finalizada") {
      text =
        "UPDATE tarea SET estado = $1, fechaCumplimiento = LOCALTIMESTAMP WHERE id = $2 RETURNING *";
    } else text = "UPDATE tarea SET estado = $1 WHERE id = $2 RETURNING *";

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  async agregarInventarioATarea(id_tarea, id_inventario, cantidad) {
    const text =
      "INSERT INTO inv_tar (id_tarea, id_inventario, cantidad_usada) VALUES ($1, $2, $3) RETURNING *";
    const values = [id_tarea, id_inventario, cantidad];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  async getInventarioDeTarea(id_tarea) {
    const text = "SELECT * FROM inv_tar WHERE id_tarea = $1";
    const values = [id_tarea];

    const resp = await this.client.query(text, values);
    return resp.rows;
  }

  async getInventarioEnTarea(id_tarea, id_inventario) {
    const text =
      "SELECT * FROM inv_tar WHERE id_tarea = $1 AND id_inventario = $2";
    const values = [id_tarea, id_inventario];

    const resp = await this.client.query(text, values);
    return resp.rows[0];
  }

  //------------------------------------ Querys de los BACKUPS --------------------------------------------------

  async extraerFecha() {
    //extraigo el timestamp del momento en que se realiza el backup
    const query1 = await this.client
      .query(
        "SELECT to_char(LOCALTIMESTAMP, 'YYYY-MM-DD_HH24-MI-SS.US') AS fecha"
      )
      .catch((e) => {
        throw e;
      });

    const { fecha = "" } = query1.rows[0];
    return fecha;
  }
  //------------------------------------ informes --------------------------------------------------

  async generarReporte({ estado, intervalo, responsable, area, equipamiento }) {
    const text = `
        SELECT
            sec.nombre as sec_nombre,
            maq.nombre as maquinaria,
            concat(userS.nombre, ' ', userS.apellido) AS usr_solicitante,
            to_char(s.fecha,'DD/MM/YYYY') AS fecha_soli_realizada,
            s.descripcion AS desc_solicitud,
            COALESCE(tar.prioridad, 0) AS priori_tar,
            concat(userJ.nombre, ' ', userJ.apellido) AS usr_juez,
            COALESCE(userR.nombre, '') AS nom_responsable,
            COALESCE(to_char(tar.fechaCumplimiento,'DD/MM/YYYY'), '') AS fecha_cumplimiento,
            COALESCE(tar.descripcion, '') AS desc_tar
        FROM solicitud s
        JOIN tarea tar
        ON tar.id_solicitud = s.id
        JOIN usuario userS
        ON s.id_usuario = userS.id
        JOIN usuario userJ
        ON s.id_juez = userJ.id
        JOIN equipamiento maq
        ON s.id_equipamiento = maq.id
        JOIN sector sec
        ON maq.id_sector = sec.id
        JOIN area
        ON sec.id_area = area.id
        LEFT JOIN responsable userR
        ON tar.id_responsable = userR.id
        WHERE
        ${
          intervalo === "T"
            ? "tar.fecha = date(now())"
            : intervalo === "W"
            ? "tar.fecha BETWEEN DATE(NOW() - INTERVAL '1 week') AND NOW()"
            : intervalo === "M"
            ? "tar.fecha BETWEEN DATE(NOW() - INTERVAL '1 month') AND NOW()"
            : "tar.fecha <= date(now())"
        }
        ${estado ? "AND tar.estado = " + estado : ""}
        ${equipamiento ? "AND s.id_equipamiento = " + equipamiento : ""}
        ${responsable ? "AND userR.id = " + responsable : ""}
        ${area ? "AND area.id = " + area : ""}
        ORDER BY tar.id ASC
      `;

    const resp = await this.client.query(text);
    return resp.rows;
  }
  async cantidadTareasPorArea() {
    const text = `
        SELECT
            count(*) as tot_tareas,
            area.nombre as area_nombre
        FROM tarea tar
        JOIN solicitud s
        on tar.id_solicitud = s.id
        JOIN equipamiento maq
        ON maq.id = s.id_equipamiento
        JOIN sector sec
        ON sec.id = maq.id_sector
        FULL JOIN area
        ON area.id = sec.id_area
        WHERE tar.fecha <= date(now()) AND area.estado = true
        GROUP BY area.id;
    `;

    const resp = await this.client.query(text);
    return resp.rows;
  }
}

module.exports = DataBase;
