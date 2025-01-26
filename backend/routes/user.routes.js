const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authenticateToken");

const userController = require("../controllers/userController");

router.get("/", authenticateToken, userController.getAllUsers);

router.get("/:id", authenticateToken, userController.getUser);

router.put("/:id", authenticateToken, userController.updateUser);

router.delete("/:id", authenticateToken, userController.deleteUser);

module.exports = router;
