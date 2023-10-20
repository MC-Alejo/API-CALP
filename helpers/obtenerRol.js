const { DataBase } = require("../models");


const obtenerRol = async (id) => {
    const db = new DataBase();
    await db.connect();
    const rol = await db.getRol(id);
    await db.disconnect();
    
    return rol;
}


module.exports = {
    obtenerRol
}