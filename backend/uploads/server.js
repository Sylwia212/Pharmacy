const express = require("express");
const app = express();

app.use("/uploads", express.static("uploads"));
