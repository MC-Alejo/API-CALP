const { DataBase } = require("../models");

const obtenerDepositos = async (req, res = response) => {
    try {
        const db = new DataBase();
        await db.connect();
        const depositos = await db.obtenerDepositos();
        await db.disconnect();
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
        await db.connect();
        const deposito = await db.getDepositoPorId(id);
        await db.disconnect();
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
        await db.connect();
        const inventario = await db.getInventarioDeposito(id);
        await db.disconnect();
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
        await db.connect();
        const deposito = await db.getDepositoDeJefe(id);
        await db.disconnect();
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
        await db.connect();
        const deposito = await db.crearDeposito(nombre);
        await db.disconnect();
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
        await db.connect();
        const deposito = await db.actualizarDeposito(id, nombre);
        await db.disconnect();
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
        await db.connect();
        const { estado, ...inventario } = await db.agregarAInventario(nombre, stock, id);
        await db.disconnect();
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


module.exports = {
    actualizarDeposito,
    agregarAInventario,
    crearDeposito,
    obtenerDepositoDeJefe,
    obtenerDepositos,
    obtenerDepositosPorId,
    obtenerInventarioDeposito,
}