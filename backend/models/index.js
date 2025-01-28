const sequelize = require("../config/database");

const User = require("./User");
const Order = require("./Order");
const Medication = require("./Medication");

Order.belongsTo(Medication, { foreignKey: "MedicationId" });
Medication.hasMany(Order, { foreignKey: "MedicationId" });

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Baza danych została zsynchronizowana.");
  } catch (error) {
    console.error("Błąd synchronizacji bazy danych:", error);
  }
};

syncDatabase();

module.exports = { User, Order, Medication };
