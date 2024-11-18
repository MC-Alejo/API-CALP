const { DataBase } = require("../models");

//obtener todos los equipamientos
const obtenerEquipamientos = async (req, res) => {
    try {
        const db = new DataBase();
        

        const equipamientos = await db.getEquipamientos();
        
        res.json({
            equipamientos
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [{
                msg: 'Error al obtener los equipamientos'
            }]
        });
    }
}

//obtener maquinaria por id
const obtenerEquipamientoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const db = new DataBase();
        

        const equipamiento = await db.getEquipamientoPorId(id);
        
        res.json({
            equipamiento: {
                id: equipamiento.id,
                nombre: equipamiento.nombre,
                id_sector: equipamiento.id_sector
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [{
                msg: 'Error al obtener el equipamiento'
            }]
        });
    }

}

//obtener la alarma de una maquinaria
const obtenerAlarmaDeEquipamiento = async (req, res) => {
    const { id } = req.params;
    try {
        const db = new DataBase();

        const alarma = await db.getAlarmasPorIdMaquina(id);
        
        res.json({
            alarma
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [{
                msg: 'Error al obtener la alarma de mantenimiento'
            }]
        });
    }
}

//obtener las alarmas que ha hecho un juez en una determinada maquinaria
const obtenerAlarmaDeJuezMaquinaria = async (req, res) => {
    const { id, id_juez } = req.params;
    try {
        const db = new DataBase();

        const alarma = await db.getAlarmasPorMaquinaJuez(id_juez, id);
        
        res.json({
            alarma
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [{
                msg: 'Error al obtener la alarma de mantenimiento'
            }]
        });
    }
}

//Actualizo nombre o sector al que pertenece el equipamiento o maquinaria
const actualizarEquipamiento = async (req, res) => {
    const { id } = req.params;
    const { nombre, id_sector } = req.body;
    if (!nombre && !id_sector) {
        return res.status(400).json({
            errors: [{
                msg: 'Debe ingresar un valor de lo que desea actualizar'
            }]
        });
    }

    if (nombre) {
        //validaciones para el nombre
        if (nombre.length < 2 || nombre.length > 46) {
            return res.status(400).json({
                errors: [{
                    msg: 'El nombre debe tener minimo 2 caracteres y no tener mas de 46'
                }]
            });
        }
    }

    try {
        const db = new DataBase();
        

        //validaciones para el id de sector
        if (id_sector) {
            if (isNaN(parseInt(id_sector))) {
                return res.status(400).json({
                    errors: [{
                        msg: 'El id del sector debe ser un numero entero'
                    }]
                });
            }

            const resp = await db.getSectorPorId(parseInt(id_sector));
            if (!resp || !resp.estado) {
                
                return res.status(400).json({
                    errors: [{
                        msg: 'No existe un sector con ese id'
                    }]
                });
            }
        }

        const equipamiento = await db.actualizarEquipamiento(id, { nombre, id_sector });
        
        res.json({
            msg: 'Equipamiento actualizado con exito!',
            equipamiento
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [{
                msg: 'Error al actualizar el equipamiento'
            }]
        });
    }
}

//Doy de baja un equipamiento o maquinaria en un sector
const bajaEquipamiento = async (req, res) => {
    const { id } = req.params;

    try {
        const db = new DataBase();
        

        //Ademas de dar de baja el equipamiento/maquinaria
        await db.eliminarEquipamiento(id);
        // Hay que eliminar la alarma de mantenimiento si es que existe
        const alarma = await db.getAlarmasPorIdMaquina(id);

        if (alarma) {
            await db.eliminarAlarmaMantenimiento(alarma.id);
        }

        
        res.json({
            msg: 'Equipamiento eliminado con exito!'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [{
                msg: 'Error al dar de baja el equipamiento'
            }]
        });
    }
}

module.exports = {
    actualizarEquipamiento,
    bajaEquipamiento,
    obtenerAlarmaDeEquipamiento,
    obtenerAlarmaDeJuezMaquinaria,
    obtenerEquipamientoPorId,
    obtenerEquipamientos,
}