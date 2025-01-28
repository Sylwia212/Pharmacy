const Medication = require("../models/Medication");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

exports.uploadImage = upload.single("image");

exports.getAllMedications = async (req, res) => {
  try {
    const medications = await Medication.findAll();
    res.json(medications);
  } catch (error) {
    res.status(500).json({ error: "Błąd serwera" });
  }
};

exports.getMedicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const medication = await Medication.findByPk(id);

    if (!medication) {
      return res.status(404).json({ error: "Lek nie został znaleziony." });
    }

    res.json(medication);
  } catch (error) {
    console.error("Błąd podczas pobierania leku:", error);
    res.status(500).json({ error: "Błąd serwera" });
  }
};

exports.addMedication = async (req, res) => {
  try {
    const { name, description, price, stock_quantity } = req.body;
    const fileName = req.file ? req.file.filename : null;

    const newMedication = await Medication.create({
      name,
      description,
      price,
      stock_quantity,
      imageUrl: fileName ? `/uploads/${fileName}` : null,
    });

    res.status(201).json(newMedication);
  } catch (error) {
    res.status(500).json({ error: "Błąd podczas dodawania leku" });
  }
};

exports.updateMedication = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock_quantity } = req.body;
    const fileName = req.file ? req.file.filename : null;

    const updates = {
      name,
      description,
      price,
      stock_quantity,
    };

    if (fileName) {
      updates.imageUrl = `/uploads/${fileName}`; 
    }

    const medication = await Medication.findByPk(id);

    if (!medication) {
      return res.status(404).json({ error: "Lek nie został znaleziony." });
    }

    await Medication.update(updates, { where: { id } });

    res.json({ message: "Lek zaktualizowany" });
  } catch (error) {
    res.status(500).json({ error: "Błąd podczas aktualizacji leku" });
  }
};

exports.deleteMedication = async (req, res) => {
  try {
    const { id } = req.params;
    const medication = await Medication.findByPk(id);

    if (!medication) {
      return res.status(404).json({ error: "Lek nie został znaleziony." });
    }

    await Medication.destroy({ where: { id } });

    res.json({ message: "Lek usunięty" });
  } catch (error) {
    console.error("Błąd podczas usuwania leku:", error);
    res.status(500).json({ error: "Błąd podczas usuwania leku" });
  }
};
