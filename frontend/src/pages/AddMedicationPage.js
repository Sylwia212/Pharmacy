import React, { useState } from "react";
import { addMedication } from "../api";

function AddMedicationPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
  });

  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
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
      await addMedication(formDataToSend);
      setMessage("Lek dodany pomyślnie!");
    } catch (error) {
      setMessage("Błąd podczas dodawania leku.");
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <h2>Dodaj nowy lek</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nazwa:</label>
          <input type="text" name="name" onChange={handleChange} required />
        </div>
        <div>
          <label>Opis:</label>
          <input
            type="text"
            name="description"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Cena:</label>
          <input type="number" name="price" onChange={handleChange} required />
        </div>
        <div>
          <label>Ilość:</label>
          <input
            type="number"
            name="stock_quantity"
            onChange={handleChange}
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
  );
}

export default AddMedicationPage;
