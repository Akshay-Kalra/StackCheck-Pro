import axios from "axios";

export async function submitAudit(formData) {
  const { data } = await axios.post("/api/audit", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function getAudit(id) {
  const { data } = await axios.get(`/api/audit/${id}`);
  return data;
}
