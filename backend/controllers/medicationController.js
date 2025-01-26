const Medication = require("../models/Medication");

exports.getAllMedications = async (req, res) => {
  try {
    const medications = await Medication.findAll();
    res.json(medications);
  } catch (error) {
    res.status(500).json({ error: "Błąd serwera" });
  }
};

exports.addMedication = async (req, res) => {
  try {
    const { name, description, price, stock_quantity } = req.body;
    const newMedication = await Medication.create({
      name,
      description,
      price,
      stock_quantity,
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
    await Medication.update(
      { name, description, price, stock_quantity },
      { where: { id } }
    );
    res.json({ message: "Lek zaktualizowany" });
  } catch (error) {
    res.status(500).json({ error: "Błąd podczas aktualizacji leku" });
  }
};

exports.deleteMedication = async (req, res) => {
  try {
    const { id } = req.params;
    await Medication.destroy({ where: { id } });
    res.json({ message: "Lek usunięty" });
  } catch (error) {
    res.status(500).json({ error: "Błąd podczas usuwania leku" });
  }
};
