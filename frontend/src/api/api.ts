import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const BUSINESS_ID = "demo_001";

// Dashboard
export const getDashboard = () =>
  axios.get(`${BASE_URL}/dashboard/${BUSINESS_ID}`);

// Risks
export const getRisks = () =>
  axios.get(`${BASE_URL}/risks/${BUSINESS_ID}`);

// Explain a single risk (used in Risks.tsx)
export const explainRisk = (riskId: string) =>
  axios.get(`${BASE_URL}/explain/${riskId}`);

// Activity log
export const getActions = () =>
  axios.get(`${BASE_URL}/actions/${BUSINESS_ID}`);

// Upload CSVs (used in Upload.tsx)
export const uploadData = (formData: FormData) =>
  axios.post(`${BASE_URL}/ingest`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Auth
export const loginWithEmail = (email: string, password: string) =>
  axios.post(`${BASE_URL}/auth/login`, { email, password });

export const signupWithEmail = (email: string, password: string) =>
  axios.post(`${BASE_URL}/auth/signup`, { email, password });

export const ingestData = (formData: FormData) =>
  axios.post(`${BASE_URL}/ingest`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });