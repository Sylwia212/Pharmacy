import React, { useState, useEffect } from "react";
import { getMedicationById, updateMedication } from "../api";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/EditMedication.css";

function EditMedicationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    image: null,
  });

  useEffect(() => {
    async function fetchMedication() {
      try {
        const medication = await getMedicationById(id);
        setFormData({
          name: medication.name,
          description: medication.description,
          price: medication.price,
          stock_quantity: medication.stock_quantity,
          image: null,
        });
      } catch (error) {
        console.error("Błąd pobierania leku:", error);
        alert("Nie udało się pobrać danych leku.");
      }
    }
    fetchMedication();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("stock_quantity", formData.stock_quantity);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      await updateMedication(id, formDataToSend);
      alert("Lek zaktualizowany!");
      navigate("/medications");
    } catch (error) {
      console.error("Błąd aktualizacji leku:", error);
      alert("Nie udało się zaktualizować leku.");
    }
  };

  return (
    <div className="edit-medication-container">
      <h2>Edytuj lek</h2>
      <form onSubmit={handleSubmit} className="edit-medication-form">
        <label>Nazwa:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Opis:</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <label>Cena:</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <label>Ilość:</label>
        <input
          type="number"
          name="stock_quantity"
          value={formData.stock_quantity}
          onChange={handleChange}
          required
        />

        <label>Zdjęcie:</label>
        <input type="file" name="image" onChange={handleImageChange} />

        <button type="submit" className="submit-btn">
          Zapisz zmiany
        </button>
      </form>
    </div>
  );
}

export default EditMedicationPage;
