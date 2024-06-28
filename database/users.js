const sequelize = require('sequelize');
const db = require('./forDB');


// ORM for Users Table 
const users = db.define('users', {
    email : {
      type : sequelize.DataTypes.STRING,
      allowNull : false,
    },
    gender : {
      type : sequelize.DataTypes.STRING,
      allowNull : false
    },
    password : {
      type : sequelize.DataTypes.STRING,
      allowNull : false
    },
    role : {
      type : sequelize.DataTypes.STRING,
      allowNull : false
    }
  }, 
  {
    timestamps : false,
  })

  module.exports = users;