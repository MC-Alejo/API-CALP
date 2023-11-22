const { DataBase } = require("../models");

//todas las areas
const obtenerAreas = async (req, res) => {
    try {
        const db = new DataBase();
        await db.connect();
        const areas = await db.getAreas();
        await db.disconnect();
        res.json({
            areas
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [{
                msg: 'Error al obtener las areas'
            }]
        });
    }
}

//area por id
const obtenerArea = async (req, res) => {
    const { id } = req.params;
    try {
        const db = new DataBase();
        await db.connect();
        const area = await db.getAreaPorId(id);
        await db.disconnect();
        res.json({
            area: {
                id: area.id,
                nombre: area.nombre
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [{
                msg: 'Error al obtener el area'
            }]
        });
    }

}

// el area del EA
const obtenerAreaPorIdUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        const db = new DataBase();
        await db.connect();
        const areaEA = await db.getAreaDelUsuario(id);
        if (!areaEA || areaEA.estado === false) return res.status(404).json({});
        const { nombre } = await db.getAreaPorId(areaEA.id_area);
        await db.disconnect();
        res.json({
            area: {
                id: areaEA.id_area,
                nombre
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [{
                msg: 'Error al obtener el area'
            }]
        });
    }

}

//sectores de un area
const obtenerSectoresPorIdArea = async (req, res) => {
    const { id } = req.params;
    try {
        const db = new DataBase();
        await db.connect();
        const sectores = await db.getSectoresPorIdArea(id);
        await db.disconnect();
        res.json({
            sectores
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [{
                msg: 'Error al obtener los sectores'
            }]
        });
    }

}

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
    actualizarNombreArea,
    crearArea,
    crearSector,
    eliminarArea,
    obtenerArea,
    obtenerAreaPorIdUsuario,
    obtenerAreas,
    obtenerSectoresPorIdArea,
}