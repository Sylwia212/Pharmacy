const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Cart = sequelize.define("Cart", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  medicationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
});

const Medication = require("./Medication");
Cart.belongsTo(Medication, { foreignKey: "medicationId" });

module.exports = Cart;
