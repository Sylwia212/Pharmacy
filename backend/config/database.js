const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,      
  process.env.DB_USER,      
  process.env.DB_PASSWORD,  
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    port: process.env.DB_PORT || 5432,
    logging: false,  
  }
);


sequelize
  .authenticate()
  .then(() => console.log("Połączenie z bazą danych działa poprawnie"))
  .catch((err) => console.error("Błąd połączenia z bazą danych:", err));

module.exports = sequelize;
