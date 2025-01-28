import React, { useState, useEffect } from "react";
import { getMedications, addMedication, deleteMedication } from "../api";
import { useNavigate } from "react-router-dom";

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
    <div>
      <h2>Lista Leków</h2>

      <div style={{ marginBottom: "20px" }}>
        <h3>Dodaj nowy lek</h3>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nazwa:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              required
            />
          </div>
          <div>
            <label>Opis:</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              required
            />
          </div>
          <div>
            <label>Cena:</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleFormChange}
              required
            />
          </div>
          <div>
            <label>Ilość:</label>
            <input
              type="number"
              name="stock_quantity"
              value={formData.stock_quantity}
              onChange={handleFormChange}
              required
            />
          </div>
          <div>
            <label>Zdjęcie:</label>
            <input type="file" onChange={handleImageChange} />
          </div>
          <button type="submit">Dodaj lek</button>
        </form>
      </div>

      <ul>
        {medications.map((med) => (
          <li key={med.id}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {med.imageUrl && (
                <img
                  src={`http://localhost:3000${med.imageUrl}`}
                  alt={med.name}
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                />
              )}
              <span>
                {med.name} - {med.price} PLN
              </span>
              <button onClick={() => navigate(`/medications/edit/${med.id}`)}>
                ✏️ Edytuj
              </button>
              <button onClick={() => handleDelete(med.id)}>❌ Usuń</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MedicationsListPage;
