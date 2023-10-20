const { DataBase } = require("../models");

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
}