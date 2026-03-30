/**
 * AI Chat Service — Frontend API layer
 * Proxies all AI chat requests through backend (never exposes Groq key)
 */

import axios from "axios";
import BASE_URL from "../config/baseUrl";

const API_URL = `${BASE_URL}/ai`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("ssms_token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export async function sendChatMessage({ message, history }) {
  const payload = { message, history };
  const res = await axios.post(`${API_URL}/chat`, payload, getAuthHeaders());
  return res.data;
}

export default { sendChatMessage };
