import React, { useState, useEffect } from "react";
import { getMedications, addMedication, deleteMedication } from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/MedicationsList.css";

function MedicationsListPage() {
  const [medications, setMedications] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
  });
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMedications() {
      try {
        const meds = await getMedications();
        setMedications(meds);
      } catch (error) {
        console.error("Błąd pobierania leków:", error);
      }
    }
    fetchMedications();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Czy na pewno chcesz usunąć ten lek?")) {
      try {
        await deleteMedication(id);
        setMedications(medications.filter((med) => med.id !== id));
      } catch (error) {
        console.error("Błąd podczas usuwania leku:", error);
        alert("Nie udało się usunąć leku.");
      }
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("stock_quantity", formData.stock_quantity);
    if (image) {
      formDataToSend.append("image", image);
    }

    try {
      const newMedication = await addMedication(formDataToSend);
      setMedications([...medications, newMedication]);
      setMessage("Lek dodany pomyślnie!");
      setFormData({ name: "", description: "", price: "", stock_quantity: "" });
      setImage(null);
    } catch (error) {
      console.error("Błąd podczas dodawania leku:", error);
      setMessage("Błąd podczas dodawania leku.");
    }
  };

  return (
    <div className="medications-container">
      <h2 className="medications-header">Lista Leków</h2>

      <div className="form-container">
        <h3 className="form-header">Dodaj nowy lek</h3>
        {message && <p className="form-message">{message}</p>}
        <form onSubmit={handleSubmit} className="medication-form">
          <div className="form-group">
            <label>Nazwa:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Opis:</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Cena:</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Ilość:</label>
            <input
              type="number"
              name="stock_quantity"
              value={formData.stock_quantity}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Zdjęcie:</label>
            <input type="file" onChange={handleImageChange} />
          </div>
          <button type="submit" className="submit-btn">
            Dodaj lek
          </button>
        </form>
      </div>

      <ul className="medications-list">
        {medications.map((med) => (
          <li key={med.id} className="medication-item">
            <div className="medication-info">
              {med.imageUrl && (
                <img
                  src={`http://localhost:3000${med.imageUrl}`}
                  alt={med.name}
                  className="medication-img"
                />
              )}
              <span>
                {med.name} - {med.price} PLN
              </span>
              <button
                onClick={() => navigate(`/medications/edit/${med.id}`)}
                className="edit-btn"
              >
                Edytuj
              </button>
              <button
                onClick={() => handleDelete(med.id)}
                className="delete-btn"
              >
                Usuń
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MedicationsListPage;
