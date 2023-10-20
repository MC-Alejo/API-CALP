const { DataBase } = require("../models");

//Creo un area en la bd
const crearArea = async (req, res) => {
    const { nombre } = req.body;
    try {
        const db = new DataBase();
        await db.connect();
        const area = await db.crearArea(nombre);
        await db.disconnect();
        res.status(201).json({
            area
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [{
                msg: 'Error al crear el area'
            }]
        });
    }
}

//Actualizo (el nombre) un area en la bd
const actualizarNombreArea = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    try {
        const db = new DataBase();
        await db.connect();
        await db.actualizarNombreArea(id, nombre);
        await db.disconnect();
        res.json({
            msg: 'Nombre de área actualizado con exito'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [{
                msg: 'Error al actualizar el área'
            }]
        });
    }
}

//Baja de un area en la bd
const eliminarArea = async (req, res) => {
    const { id } = req.params;
    try {

        const db = new DataBase();
        await db.connect();

        //const resp = await db.getSectoresPorIdArea(id)

        const encargado = await db.validarAreaDefinida(id)
        //Eliminar el area implica no solo cambiar el estado de true a false sino que:

        //demitir area al encargado (ya que el area ""dejaria de existir"" en la bd)
        if (encargado) {
            await db.demitirAreaAEncargado(encargado.id_usuario);
        }

        //Los sectores de dicha area pasarian a tener el estado en false tambien
        await db.darBajaSectoresArea(id)

        //la maquinaria de los sectores dejarian de estar disponibles al no tener un sector valido (en este caso podriamos poner en null el sector de la maquinaria)


        //finalmente se elimina logicamente el area
        await db.eliminarArea(id);
        await db.disconnect();

        res.json({
            msg: 'El área se eliminó con exito'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [{
                msg: 'Error al eliminar el area'
            }]
        });
    }
}

const crearSector = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;

    try {
        const db = new DataBase();
        await db.connect();
        const sector = await db.crearSector(id, nombre);
        await db.disconnect();
        res.status(201).json({
            sector
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [{
                msg: 'Error al crear el sector'
            }]
        });
    }
}


module.exports = {
    crearArea,
    actualizarNombreArea,
    eliminarArea,
    crearSector,
}