const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const checkAuth = require("../middlewares/checkAuth");

router.get("/", checkAuth, userController.getAllUsers);

router.get("/:id", checkAuth, userController.getUser);

router.put("/:id", checkAuth, userController.updateUser);

router.delete("/:id", checkAuth, userController.deleteUser);

module.exports = router;
