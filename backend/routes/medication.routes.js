const express = require("express");
const router = express.Router();
const medicationController = require("../controllers/medicationController");

router.post("/", medicationController.addMedication);

router.get("/", medicationController.getAllMedications);

router.put("/:id", medicationController.updateMedication);

router.delete("/:id", medicationController.deleteMedication);

module.exports = router;
