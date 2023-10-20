const { DataBase } = require("../models");

// Actualizar sector (nombre o area a la que pertenece)
const actualizarSector = async (req, res) => {
    const { id } = req.params;
    const { nombre, id_area } = req.body;

    if (!nombre && !id_area) {
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
        await db.connect();

        if (id_area) {
            if (isNaN(parseInt(id_area))) {
                await db.disconnect();
                return res.status(400).json({
                    errors: [{
                        msg: 'El area debe ser un numero entero'
                    }]
                });
            }
            //validaciones para el id de area
            const resp = await db.getAreaPorId(parseInt(id_area));
            if (!resp || !resp.estado) {
                await db.disconnect();
                return res.status(400).json({
                    errors: [{
                        msg: 'No existe un area con ese id'
                    }]
                });
            }
        }

        const sector = await db.actualizarSector(id, { nombre, id_area });
        await db.disconnect();
        res.json({
            msg: 'Sector actualizado con exito!',
            sector
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [{
                msg: 'Error al actualizar el sector'
            }]
        });
    }
}

// dar de baja el sector (pasar el estado a false)
const bajaSector = async (req, res) => {
    const { id } = req.params;

    try {
        const db = new DataBase();
        await db.connect();

        //Ademas de dar de baja el sector deberia de dar de baja las maquinarias pertenecientes al mismo?
        await db.eliminarSector(id);

        await db.disconnect();
        res.json({
            msg: 'Sector eliminado con exito!'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [{
                msg: 'Error al eliminar el sector'
            }]
        });
    }
}

//Creo un equipamiento o maquinaria en ese sector
const crearEquipamientoSector = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;

    try {
        const db = new DataBase();
        await db.connect();
        const equipamiento = await db.crearEquipamiento(nombre, id);
        await db.disconnect();
        res.status(201).json({
            equipamiento
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [{
                msg: 'Error al crear el equipamiento'
            }]
        });
    }
}



module.exports = {
    actualizarSector,
    bajaSector,
    crearEquipamientoSector,
}