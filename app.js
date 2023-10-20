// los paquetes de terceros se importan primero
require('dotenv').config()
//el codigo que nosotros hacemos tiene menos importancia que los paquetes
const { Server } = require('./models');

const server = new Server();

server.listen();
