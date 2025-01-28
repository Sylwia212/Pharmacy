const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Order = require("./Order");
const Medication = require("./Medication");

const OrderItem = sequelize.define("OrderItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Order,
      key: "id",
    },
  },
  medicationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Medication,
      key: "id",
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Order.hasMany(OrderItem, { foreignKey: "orderId", onDelete: "CASCADE" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

Medication.hasMany(OrderItem, { foreignKey: "medicationId" });
OrderItem.belongsTo(Medication, { foreignKey: "medicationId" });

module.exports = OrderItem;
