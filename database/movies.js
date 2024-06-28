const sequelize = require('sequelize');
const db = require('./forDB');

/* ORM (Object Relational Mapping) */
const movies = db.define('movies', {
  title : {
    type : sequelize.DataTypes.STRING,
    allowNull : false
  },
  genres : {
    type : sequelize.DataTypes.STRING,
    allowNull : false
  },
  year : {
    type : sequelize.DataTypes.INTEGER,
    allowNull : false
  }
}, 
{
  timestamps : false
})

module.exports = movies;