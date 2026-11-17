/**
 * Adaptador Serverless para despliegues en Vercel
 * Servicio Nacional de Aprendizaje - SENA ADSO
 * Empresa Llano Grande S.A.S.
 */
const server = require('../server.js');

module.exports = (req, res) => {
    server.emit('request', req, res);
};
