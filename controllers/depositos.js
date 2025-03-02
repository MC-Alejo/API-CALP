const { DataBase } = require("../models");

const obtenerDepositos = async (req, res = response) => {
    try {
        const db = new DataBase();

        const depositos = await db.obtenerDepositos();

        res.json({
            depositos
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            errors: [{
                msg: 'Error en el servidor. Hable con el administrador'
            }]
        });
    }
}

const obtenerDepositosPorId = async (req, res = response) => {
    const { id } = req.params;
    try {
        const db = new DataBase();

        const deposito = await db.getDepositoPorId(id);

        res.json({
            deposito
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            errors: [{
                msg: 'Error en el servidor. Hable con el administrador'
            }]
        });
    }
}

const obtenerInventarioDeposito = async (req, res = response) => {
    const { id } = req.params;
    try {
        const db = new DataBase();

        const inventario = await db.getInventarioDeposito(id);

        res.json({
            inventario
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            errors: [{
                msg: 'Error en el servidor. Hable con el administrador'
            }]
        });
    }
}

const obtenerDepositoDeJefe = async (req, res = response) => {
    const { id } = req.params;
    try {
        const db = new DataBase();

        const deposito = await db.getDepositoDeJefe(id);

        res.json({
            deposito
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            errors: [{
                msg: 'Error en el servidor. Hable con el administrador'
            }]
        });
    }

}

const crearDeposito = async (req, res = response) => {
    const { nombre } = req.body;
    try {
        const db = new DataBase();

        const deposito = await db.crearDeposito(nombre);

        res.status(201).json({
            deposito
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            errors: [{
                msg: 'Error en el servidor. Hable con el administrador'
            }]
        });
    }
}

const actualizarDeposito = async (req, res = response) => {
    const { id } = req.params;
    const { nombre } = req.body;
    try {
        const db = new DataBase();

        const deposito = await db.actualizarDeposito(id, nombre);

        res.json({
            msg: 'Deposito actualizado correctamente',
            deposito
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            errors: [{
                msg: 'Error en el servidor. Hable con el administrador'
            }]
        });
    }
}

const agregarAInventario = async (req, res = response) => {
    const { id } = req.params;
    const { nombre, stock } = req.body;
    try {
        const db = new DataBase();

        const { estado, ...inventario } = await db.agregarAInventario(nombre, stock, id);

        res.status(201).json({
            inventario
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            errors: [{
                msg: 'Error en el servidor. Hable con el administrador'
            }]
        });
    }
}

// Baja de deposito
const bajaDeposito = async (req, res = response) => {
    const { id } = req.params;
    try {
        const db = new DataBase();

        const deposito = await db.eliminarDeposito(id);

        res.json({
            msg: 'Deposito dado de baja correctamente',
            deposito
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            errors: [{
                msg: 'Error en el servidor. Hable con el administrador'
            }]
        });
    }
}

module.exports = {
    actualizarDeposito,
    agregarAInventario,
    bajaDeposito,
    crearDeposito,
    obtenerDepositoDeJefe,
    obtenerDepositos,
    obtenerDepositosPorId,
    obtenerInventarioDeposito,
}