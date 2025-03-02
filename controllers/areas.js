const { DataBase } = require("../models");

//todas las areas
const obtenerAreas = async (req, res) => {
    try {
        const { encargados } = req.query;

        const db = new DataBase();

        if(encargados){
            const areas = await db.getAreasYEncargados();

            return res.json({
                areas
            })
        }
       
        const areas = await db.getAreas();
        
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
        
        const area = await db.getAreaPorId(id);
        
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
        
        const areaEA = await db.getAreaDelUsuario(id);
        if (!areaEA.id_area) return res.status(404).json({});
        const { nombre } = await db.getAreaPorId(areaEA.id_area);
        
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
        
        const sectores = await db.getSectoresPorIdArea(id);
        
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
        
        const area = await db.crearArea(nombre);
        
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
        
        await db.actualizarNombreArea(id, nombre);
        
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
        
        const sector = await db.crearSector(id, nombre);
        
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