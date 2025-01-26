require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes"); 
const authenticateToken = require("./middlewares/authenticateToken");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.get("/api/secret", authenticateToken, (req, res) => {
  return res.json({
    message: `Tajne dane dla użytkownika: ${req.user.email}`,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
