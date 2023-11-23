const { DataBase } = require("../models");

const obtenerInventario = async (req, res = response) => {

    try {
        const db = new DataBase();
        await db.connect();

        const inventario = await db.getInventario();

        await db.disconnect();

        res.json({
            inventario
        })
    } catch (error) {

    }
}

const obtenerInventarioPorId = async (req, res = response) => {
    const { id } = req.params;

    try {
        const db = new DataBase();
        await db.connect();

        const inventario = await db.getInventarioPorId(id);

        await db.disconnect();

        res.json({
            inventario: {
                id: inventario.id,
                nombre: inventario.nombre,
                stock: inventario.stock,
                id_deposito: inventario.id_deposito,
            }
        })
    } catch (error) {

    }
}

const actualizarInventario = async (req, res = response) => {
    const { id } = req.params;
    const { nombre, stock } = req.body;

    if (nombre) {
        if (nombre.length < 3) {
            return res.status(400).json({
                errors: [{
                    msg: 'El nombre debe tener al menos 3 caracteres'
                }]
            })
        }

        if (nombre.length > 65) {
            return res.status(400).json({ errors: [{ msg: 'El nombre no debe tener mas de 65 caracteres' }] })
        }

        if (!/^[a-zA-Z0-9 ]*$/.test(nombre)) {
            return res.status(400).json({ errors: [{ msg: 'El nombre solo puede contener letras, numeros y espacios' }] })
        }
    }

    if (stock) {

        if (isNaN(parseInt(stock))) {
            return res.status(400).json({ errors: [{ msg: 'El stock debe ser un numero' }] })
        }
        console.log(stock)
        if (parseInt(stock) < 0) {
            return res.status(400).json({ errors: [{ msg: 'El stock no puede ser negativo' }] })
        }

        if (parseInt(stock) > 1000000) {
            return res.status(400).json({ errors: [{ msg: 'El stock no puede ser mayor a 1 millon' }] })
        }

        if (!/^[0-9]*$/.test(parseInt(stock))) {
            return res.status(400).json({ errors: [{ msg: 'El stock solo puede contener numeros' }] })
        }
    }

    try {
        const db = new DataBase();
        await db.connect();

        if (nombre) {
            const resp = await db.getInventarioPorNombre(nombre);

            if (resp && resp.estado) {
                await db.disconnect();
                return res.status(400).json({ errors: [{ msg: 'Ya existe un inventario con ese nombre' }] })
            }

        }

        const { estado, ...inventario } = await db.modificarInventario(id, { nombre, stock: parseInt(stock) });

        await db.disconnect();

        res.json({
            msg: 'El inventario ha sido actualizado',
            inventario
        })
    } catch (error) {

    }


}

const eliminarInventario = async (req, res = response) => {
    const { id } = req.params;

    try {
        const db = new DataBase();
        await db.connect();

        const { estado, ...inventario } = await db.eliminarInventario(id);

        await db.disconnect();

        res.json({
            msg: 'El inventario ha sido eliminado'
        })
    } catch (error) {

    }
}

module.exports = {
    actualizarInventario,
    eliminarInventario,
    obtenerInventario,
    obtenerInventarioPorId,
}
