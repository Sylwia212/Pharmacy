const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Medication = sequelize.define("Medication", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  stock_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Medication;
