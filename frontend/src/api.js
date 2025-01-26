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
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return await response.json();
}

export async function getSecretData(token) {
  const response = await fetch(`${API_URL}/api/secret`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
}

export async function getAllUsers(token) {
  const response = await fetch(`${API_URL}/api/users`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
}

export async function getUserById(userId, token) {
  const response = await fetch(`${API_URL}/api/users/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
}

export async function updateUser(userId, updates, token) {
  const response = await fetch(`${API_URL}/api/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
  return await response.json();
}

export async function deleteUser(userId, token) {
  const response = await fetch(`${API_URL}/api/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
}

export async function getMedications() {
  const response = await fetch(`${API_URL}/api/medications`);
  return await response.json();
}

export async function addMedication(formData) {
  const response = await fetch(`${API_URL}/api/medications`, {
    method: "POST",
    body: formData,
  });
  return await response.json();
}


export async function updateMedication(id, medicationData) {
  const response = await fetch(`${API_URL}/api/medications/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(medicationData),
  });
  return await response.json();
}


export async function deleteMedication(id) {
  const response = await fetch(`${API_URL}/api/medications/${id}`, {
    method: "DELETE",
  });
  return await response.json();
}
