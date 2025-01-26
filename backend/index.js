require("dotenv").config();
const express = require("express");
const cors = require("cors");

const sequelize = require("./config/database");
const Medication = require("./models/Medication");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const authenticateToken = require("./middlewares/authenticateToken");
const medicationRoutes = require("./routes/medication.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/medications", medicationRoutes);

app.get("/api/secret", authenticateToken, (req, res) => {
  return res.json({
    message: `Tajne dane dla użytkownika: ${req.user.email}`,
  });
});

app.get("/", (req, res) => {
  res.send("Serwer działa poprawnie!");
});


sequelize.sync({ force: false })  
  .then(() => {
    console.log("Baza danych zsynchronizowana");
  })
  .catch((err) => {
    console.error("Błąd synchronizacji bazy danych:", err);
  });


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
