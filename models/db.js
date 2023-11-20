const { Client } = require('pg');

class DataBase {
    constructor() {
        //a q bd? le tengo que decir a donde conectarse
        // Client busca en las variables de entorno por eso es que le tengo que decir a q bd conectar
        // - a que servidor conectar o host en el que se encuentra
        // - nombre de la bd
        // - necesitamos saber el puerto en el que corre la bd, esto basicamente es por si tenemos muchas bd (postgres por defecto en 5432)
        // - necesitamos el usuario y la contraseña
        this.client = new Client({
            host: process.env.PGHOST,
            database: process.env.PGDATABASE,
            port: process.env.PGPORT,
            user: process.env.PGUSER,
            password: process.env.PGPASSWORD,
        });
    }


    //Conectar a la DB
    async connect() {
        await this.client.connect()
            .then(() => console.log('db connect'))
            .catch((err) => {
                console.log(err)
                return new Error('Error a la hora de iniciar la BD (ver logs)');
            })
    }

    //Desconectar la DB
    async disconnect() {
        await this.client.end()
            .then(() => console.log('db disconnect'))
            .catch((err) => {
                console.log(err)
                return new Error('Error a la hora de desconectar la BD (ver logs)');
            })
    }


    //Querys de los usuarios:

    async getUsuarioPorCorreo(email = '') {
        const text = 'SELECT * FROM usuario WHERE email = $1';
        const values = [email];

        const resp = await this.client.query(text, values);
        return resp.rows[0];
    }

    async getUsuarioPorId(id) {
        const text = 'SELECT * FROM usuario WHERE id = $1';
        const values = [id];

        const resp = await this.client.query(text, values);
        return resp.rows[0];
    }

    async crearUsuario({ id, nombre, apellido, email, password }) {

        const text = 'INSERT INTO usuario (id, nombre, apellido, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *'; // el RETURNING * es para que me devuelva el objeto que se inserto
        const values = [id, nombre, apellido, email, password];

        const resp = await this.client.query(text, values);

        return resp.rows[0];
    }

    async actualizarUsuario(id, { nombre, apellido, email, password }) {
        const setNombre = 'UPDATE usuario SET nombre = $1 WHERE id = $2';
        const setApellido = 'UPDATE usuario SET apellido = $1 WHERE id = $2';
        const setEmail = 'UPDATE usuario SET email = $1 WHERE id = $2';
        const setPassword = 'UPDATE usuario SET password = $1 WHERE id = $2';
        const text = 'SELECT * FROM usuario WHERE id = $1';


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
        const text = 'UPDATE usuario SET estado = false WHERE id = $1 RETURNING *';
        const values = [id];

        const resp = await this.client.query(text, values);
        return resp;
    }

    async validarEmailExiste(correo = '') {
        this.connect();

        const text = 'SELECT * FROM usuario WHERE email = $1';
        const values = [correo];

        const resp = await this.client.query(text, values);
        this.disconnect();

        return resp.rowCount;
    }

    async asignarRol(id, rol, idArea, idDeposito) {

        let text;
        let values;

        if (rol === 'GO') {
            text = 'INSERT INTO gerente(id_usuario) VALUES ($1) RETURNING *';
            values = [id]
        }
        else if (rol === 'JM') {
            text = 'INSERT INTO jefe_mantenimiento(id_usuario, id_deposito) VALUES ($1, $2) RETURNING *';
            values = [id, idDeposito];
        }
        else if (rol === 'EA') {
            text = 'INSERT INTO encargado_area(id_usuario, id_area) VALUES ($1, $2) RETURNING *';
            values = [id, idArea];
        }
        else {
            this.disconnect();
            return new Error('Error al asignar rol');
        }

        const resp = await this.client.query(text, values);

        return resp.rows[0];
    }

    async getRol(id) {
        const buscarGerente = 'SELECT * FROM gerente WHERE id_usuario = $1';
        const values = [id];

        const resp = await this.client.query(buscarGerente, values);
        if (resp.rowCount > 0) {
            return 'GO';
        }

        const buscarJefe = 'SELECT * FROM jefe_mantenimiento WHERE id_usuario = $1';
        const resp2 = await this.client.query(buscarJefe, values);
        if (resp2.rowCount > 0) {
            return 'JM';
        }

        const buscarEncargado = 'SELECT * FROM encargado_area WHERE id_usuario = $1';
        const resp3 = await this.client.query(buscarEncargado, values);
        if (resp3.rowCount > 0) {
            return 'EA';
        }

        return null;
    }

    async validarAreaDefinida(id_area) {
        const text = 'SELECT id_usuario FROM encargado_area WHERE id_area = $1';
        const values = [id_area];

        const resp = await this.client.query(text, values);
        return resp.rows[0];
    }

    async demitirAreaAEncargado(id) {
        const text = 'UPDATE encargado_area SET id_area = NULL WHERE id_usuario = $1';
        const values = [id];

        const resp = await this.client.query(text, values);
        return resp.rows[0];
    }

    async updateAreaDeEncargado(id, id_area) {
        const text = 'UPDATE encargado_area SET id_area = $2 WHERE id_usuario = $1';
        const values = [id, id_area];

        const resp = await this.client.query(text, values);
        return resp.rows[0];
    }

    async getAreaDelUsuario(id) {
        const text = 'SELECT id_area FROM encargado_area WHERE id_usuario = $1';
        const values = [id];

        const resp = await this.client.query(text, values);
        return resp.rows[0];
    }

    async validarJefeDefinido(id) {
        const text = 'SELECT id_usuario FROM jefe_mantenimiento WHERE id_deposito = $1';
        const values = [id];

        const resp = await this.client.query(text, values);
        return resp.rows[0];
    }



    //Querys de las areas:

    async getAreas() {
        const text = 'SELECT * FROM area';
        const resp = await this.client.query(text);
        return resp.rows;
    }

    async getAreaPorId(id) {
        const text = 'SELECT * FROM area WHERE id = $1';
        const values = [id];

        const resp = await this.client.query(text, values);
        return resp.rows[0];
    }

    async getAreaPorNombre(nombre) {
        const text = 'SELECT * FROM area WHERE nombre = $1';
        const values = [nombre];

        const resp = await this.client.query(text, values);
        return resp.rows[0];
    }

    async crearArea(nombre) {
        const text = 'INSERT INTO area (nombre) VALUES ($1) RETURNING *';
        const values = [nombre];

        const resp = await this.client.query(text, values);
        return resp.rows[0];
    }

    async actualizarNombreArea(id, nombre) {
        const text = 'UPDATE area SET nombre = $2 WHERE id = $1';
        const values = [id, nombre];

        const resp = await this.client.query(text, values);
        return resp.rows[0];
    }

    async eliminarArea(id) {
        const text = 'UPDATE area SET estado = false WHERE id = $1';
        const values = [id];

        const resp = await this.client.query(text, values);
        return resp.rows[0];
    }

    async darBajaSectoresArea(id_area) {
        const text = 'UPDATE sector SET estado = false WHERE id_area = $1';
        const values = [id_area];

        const resp = await this.client.query(text, values);
        return resp.rows[0];
    }

    // Querys de los depositos:
    async getDepositoPorId(id) {
        const text = 'SELECT * FROM deposito WHERE id = $1';
        const values = [id];

        const resp = await this.client.query(text, values);
        return resp.rows[0];
    }

    async getDepositoPorNombre(nombre) {
        const text = 'SELECT * FROM deposito WHERE nombre = $1';
        const values = [nombre];

        const resp = await this.client.query(text, values);
        return resp.rows[0];
    }

    async crearDeposito(nombre) {
        const text = 'INSERT INTO deposito (nombre) VALUES ($1) RETURNING *';
        const values = [nombre];

        const resp = await this.client.query(text, values);
        return resp.rows[0];
    }

    async actualizarDeposito(id, nombre) {
        const text = 'UPDATE deposito SET nombre = $2 WHERE id = $1 RETURNING *';
        const values = [id, nombre];

        const resp = await this.client.query(text, values);
        return resp.rows[0];
    }

    // Querys del inventario:

    async getInventarioPorId(id) {
        const text = 'SELECT * FROM inventario WHERE id = $1';
        const values = [id];

        const resp = await this.client.query(text, values);
        return resp.rows[0];
    }

    async getInventarioPorNombre(nombre) {
        const text = 'SELECT * FROM inventario WHERE nombre = $1';
        const values = [nombre];

        const resp = await this.client.query(text, values);
        return resp.rows[0];
    }

    async agregarAInventario(nombre, stock, id_deposito) {
        const text = 'INSERT INTO inventario (nombre, stock, id_deposito) VALUES ($1, $2, $3) RETURNING *';
        const values = [nombre, stock, id_deposito];

        const resp = await this.client.query(text, values);
        return resp.rows[0];
    }

    async modificarInventario(id, { nombre, stock }) {
        const setNombre = 'UPDATE inventario SET nombre = $1 WHERE id = $2';
        const setStock = 'UPDATE inventario SET stock = $1 WHERE id = $2';
        const text = 'SELECT * FROM inventario WHERE id = $1';

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
        const text = 'UPDATE inventario SET estado = false WHERE id = $1 RETURNING *';
        const values = [id];

        const resp = await this.client.query(text, values);
        return resp;
    }

    // Query de los sectores:
    async crearSector(id_area, nombre) {
        const text = 'INSERT INTO sector (id_area, nombre) VALUES ($1, $2) RETURNING *';
        const values = [id_area, nombre];

        const resp = await this.client.query(text, values);
        return resp.rows[0];
    }

    async actualizarSector(id, { nombre, id_area }) {
        const setNombre = 'UPDATE sector SET nombre = $1 WHERE id = $2';
        const setIdArea = 'UPDATE sector SET id_area = $1 WHERE id = $2';
        const text = 'SELECT * FROM sector WHERE id = $1';


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
        const text = 'UPDATE sector SET estado = false WHERE id = $1';
        const values = [id];

        const resp = await this.client.query(text, values);

        return resp.rows[0];
    }

    async getSectorPorId(id) {
        const text = 'SELECT * FROM sector WHERE id = $1';
        const values = [id];

        const resp = await this.client.query(text, values);
        return resp.rows[0];
    }

    async getSectoresPorIdArea(id_area) {
        const text = 'SELECT * from sector where id_area = $1 AND estado = true';
        const values = [id_area];

        const resp = await this.client.query(text, values);
        return resp.rows;
    }


    // Querys de los responsables/empleados:
    async getEmpleadoByID(id) {
        const text = 'SELECT * FROM responsable WHERE id = $1';
        const values = [id];

        const resp = await this.client.query(text, values);
        return resp.rows[0];
    }

    async getEmpleadoByCorreo(email) {
        const text = 'SELECT * FROM responsable WHERE email = $1';
        const values = [email];

        const resp = await this.client.query(text, values);
        return resp.rows[0];
    }

    async crearEmpleado(nombre, email) {
        const text = 'INSERT INTO responsable (nombre, email) VALUES ($1, $2) RETURNING *';
        const values = [nombre, email];

        const resp = await this.client.query(text, values);
        return resp.rows[0];
    }

    async actualizarEmpleado(id, { nombre, email }) {
        const setNombre = 'UPDATE responsable SET nombre = $1 WHERE id = $2';
        const setEmail = 'UPDATE responsable SET email = $1 WHERE id = $2';
        const text = 'SELECT * FROM responsable WHERE id = $1';

        if (nombre) {
            const values = [nombre, id];
            await this.client.query(setNombre, values);
        }

        if (email) {
            const values = [email, id];
            await this.client.query(setEmail, values);
        }

        const values = [id];
        const resp = await this.client.query(text, values);

        return resp.rows[0];
    }

    async eliminarEmpleado(id) {
        const text = 'UPDATE responsable SET estado = false WHERE id = $1';
        const values = [id];

        const resp = await this.client.query(text, values);

        return resp.rows[0];
    }

    // Querys del equipamiento:

    async getEquipamientoPorId(id) {
        const text = 'SELECT * FROM equipamiento WHERE id = $1';
        const values = [id];

        const resp = await this.client.query(text, values);
        return resp.rows[0];
    }

    async crearEquipamiento(nombre, id_sector) {
        const text = 'INSERT INTO equipamiento (nombre, id_sector) VALUES ($1, $2) RETURNING *';
        const values = [nombre, id_sector];

        const resp = await this.client.query(text, values);
        return resp.rows[0];
    }

    async actualizarEquipamiento(id, { nombre, id_sector }) {
        const setNombre = 'UPDATE equipamiento SET nombre = $1 WHERE id = $2';
        const setIdArea = 'UPDATE equipamiento SET id_sector = $1 WHERE id = $2';
        const text = 'SELECT * FROM equipamiento WHERE id = $1';


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
        const text = 'UPDATE equipamiento SET estado = false WHERE id = $1';
        const values = [id];

        const resp = await this.client.query(text, values);

        return resp.rows[0];
    }

    // Querys de las alarma:

    async getAlarma(id) {
        const text = 'SELECT * FROM alarma WHERE id = $1';
        const values = [id];

        const resp = await this.client.query(text, values);
        return resp.rows[0];
    }

    async getAlarmaDeEquipamiento(id) {
        const text = 'SELECT * FROM alarma WHERE id_equipamiento = $1';
        const values = [id];

        const resp = await this.client.query(text, values);
        return resp.rows[0];
    }

    async crearAlarmaMantenimiento(fecha, hora, id_equipamiento) {
        const text = 'INSERT INTO alarma (fecha, hora, id_equipamiento) VALUES ($1, $2, $3) RETURNING *';
        const values = [fecha, hora, id_equipamiento];

        const resp = await this.client.query(text, values);
        return resp.rows[0];
    }

    async actualizarAlarmaMantenimiento(id, { fecha, hora }) {
        const setFecha = 'UPDATE alarma SET fecha = $1 WHERE id = $2';
        const setHora = 'UPDATE alarma SET hora = $1 WHERE id = $2';
        const text = 'SELECT * FROM alarma WHERE id = $1';


        if (fecha) {
            const values = [fecha, id];
            await this.client.query(setFecha, values);
        }
        if (hora) {
            const values = [hora, id];
            await this.client.query(setHora, values);
        }

        const values = [id];
        const resp = await this.client.query(text, values);

        return resp.rows[0];
    }

    async eliminarAlarmaMantenimiento(id) {
        const text = 'DELETE FROM alarma WHERE id = $1';
        const values = [id];

        const resp = await this.client.query(text, values);

        return resp.rows[0];
    }

    // Querys de las solicitudes:
    async getSolicitudPorId(id) {
        const text = 'SELECT * FROM solicitud WHERE id = $1';
        const values = [id];

        const resp = await this.client.query(text, values);
        return resp.rows[0];
    }

    async crearSolicitud(descripcion, id_equipamiento, id_usuario) {
        const text = 'INSERT INTO solicitud (estado, fecha, descripcion, id_equipamiento, id_usuario) VALUES ($1, CURRENT_DATE, $2, $3, $4) RETURNING *';
        const values = ['pendiente', descripcion, id_equipamiento, id_usuario];

        const resp = await this.client.query(text, values);
        return resp.rows[0];
    }

    async modificarEstadoSolicitud(id, estado) {
        const text = 'UPDATE solicitud SET estado = $1 WHERE id = $2 RETURNING *';
        const values = [estado, id];

        const resp = await this.client.query(text, values);
        return resp.rows[0];
    }

    async setJuezSolicitud(id, id_juez) {
        const text = 'UPDATE solicitud SET id_juez = $1 WHERE id = $2 RETURNING *';
        const values = [id_juez, id];

        const resp = await this.client.query(text, values);
        return resp.rows[0];
    }

    // Querys de las tareas:
    /*
    CREATE TABLE tarea (

    estado character varying(15) NOT NULL,
    fecha date NOT NULL,
    descripcion character varying(250) NOT NULL,
    prioridad integer NOT NULL,
    id_solicitud integer NOT NULL,
    id_responsable integer NOT NULL,
--
    FOREIGN KEY (id_solicitud) REFERENCES solicitud(id),
    FOREIGN KEY (id_responsable) REFERENCES responsable(id)
);
    */
    async crearTarea(estado, descripcion, prioridad, id_solicitud, id_responsable) {
        const text = 'INSERT INTO tarea (estado, fecha, descripcion, prioridad, id_solicitud, id_responsable) VALUES ($1, CURRENT_DATE, $2, $3, $4, $5) RETURNING *';
        const values = [estado, descripcion, prioridad, id_solicitud, id_responsable];

        const resp = await this.client.query(text, values);
        return resp.rows[0];
    }

}

module.exports = DataBase;