const API_URL = "http://localhost:3000";

export async function registerUser(email, password) {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return await response.json();
}

export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  return await response.json();
}

export async function getSecretData(token) {
  const response = await fetch(`${API_URL}/api/secret`, {
    method: "GET",
    credentials: "include",
  });
  return await response.json();
}

export async function getAllUsers(token) {
  const response = await fetch(`${API_URL}/api/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Błąd pobierania użytkowników");
  }

  return await response.json();
}

export async function getUserById(userId, token) {
  const response = await fetch(`${API_URL}/api/users/${userId}`, {
    method: "GET",
    credentials: "include",
  });
  return await response.json();
}

export async function updateUser(userId, updates, token) {
  const response = await fetch(`${API_URL}/api/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(updates),
  });
  return await response.json();
}

export async function deleteUser(userId, token) {
  const response = await fetch(`${API_URL}/api/users/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Błąd podczas usuwania użytkownika");
  }

  return await response.json();
}

export async function getMedications() {
  const response = await fetch(`${API_URL}/api/medications`, {
    method: "GET",
    credentials: "include",
  });
  return await response.json();
}

export async function addMedication(formData) {
  const response = await fetch(`${API_URL}/api/medications`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  return await response.json();
}

export async function deleteMedication(id) {
  const response = await fetch(`${API_URL}/api/medications/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Błąd podczas usuwania leku");
  }
  return await response.json();
}

export async function addToCart(userId, medicationId, quantity) {
  try {
    const response = await fetch("http://localhost:3000/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        userId,
        medicationId,
        quantity,
      }),
    });

    if (!response.ok) {
      throw new Error("Błąd podczas dodawania do koszyka");
    }

    return await response.json();
  } catch (error) {
    console.error("Błąd dodawania do koszyka:", error);
    throw error;
  }
}

export async function getCart(userId) {
  const response = await fetch(`${API_URL}/api/cart/${userId}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Błąd pobierania koszyka");
  }
  return await response.json();
}

export async function removeFromCart(cartItemId) {
  const response = await fetch(`${API_URL}/api/cart/${cartItemId}`, {
    method: "DELETE",
    credentials: "include",
  });
  return await response.json();
}

export async function logoutUser() {
  await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) return value;
  }
  return null;
}

export async function clearCart(userId) {
  const response = await fetch(
    `http://localhost:3000/api/cart/clear/${userId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Błąd podczas czyszczenia koszyka.");
  }

  return await response.json();
}

export async function placeOrder(userId, address, cartItems) {
  if (!userId || !address || cartItems.length === 0) {
    throw new Error("Brak wymaganych danych do zamówienia.");
  }

  const orderData = {
    userId,
    address,
    medications: cartItems.map((item) => ({
      medicationId: item.Medication.id,
      quantity: item.quantity,
    })),
  };

  const response = await fetch("http://localhost:3000/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Błąd podczas składania zamówienia.");
  }

  return await response.json();
}

export async function getUserOrders(userId) {
  const response = await fetch(`http://localhost:3000/api/orders/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Nie udało się pobrać zamówień!");
  }

  return await response.json();
}

export async function getMedicationById(id) {
  const response = await fetch(`http://localhost:3000/api/medications/${id}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Nie znaleziono leku");
  }
  return await response.json();
}

export async function updateMedication(id, formData) {
  const response = await fetch(`http://localhost:3000/api/medications/${id}`, {
    method: "PUT",
    body: formData,
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Błąd podczas aktualizacji leku");
  }
  return await response.json();
}

export async function updateOrderStatus(orderId, status) {
  const response = await fetch("http://localhost:3000/api/orders/status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ orderId, status }),
  });

  if (!response.ok) {
    throw new Error("Błąd podczas aktualizacji statusu zamówienia.");
  }

  return await response.json();
}

export async function searchMedicationByName(name) {
  const response = await fetch(
    `http://localhost:3000/api/medications/search?name=${encodeURIComponent(
      name
    )}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Błąd podczas wyszukiwania leku.");
  }

  return await response.json();
}
