const sequelize = require('sequelize');

const db = new sequelize('Movies', 'postgres', 'Ccdn0koment', {
    host : 'localhost',
    dialect : 'postgres'
})

module.exports = db;




