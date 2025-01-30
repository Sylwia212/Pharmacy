const express = require("express");
const router = express.Router();
const medicationController = require("../controllers/medicationController");

router.post("/", medicationController.uploadImage, medicationController.addMedication);

router.get("/", medicationController.getAllMedications);

router.get("/low-stock", medicationController.getLowStockMedications); 

router.get("/search", medicationController.searchMedicationByName);

router.get("/:id", medicationController.getMedicationById);


router.put("/:id", medicationController.uploadImage, medicationController.updateMedication);

router.delete("/:id", medicationController.deleteMedication);

module.exports = router;
