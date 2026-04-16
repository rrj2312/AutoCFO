import axios from 'axios';
import { mockDashboard, mockRisks, mockActions, mockExplanations } from '../data/mockData';

const BASE_URL = '/api';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 3000,
});

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function getDashboard() {
  await delay(800);
  return mockDashboard;
}

export async function getRisks() {
  await delay(600);
  return mockRisks;
}

export async function getActions() {
  await delay(500);
  return mockActions;
}

export async function explainRisk(id: string): Promise<string> {
  await delay(1200);
  return mockExplanations[id] ?? 'AutoCFO detected an anomaly in your financial data that warrants attention based on historical patterns and industry benchmarks.';
}

export async function ingestData(_files: File[]) {
  await delay(3000);
  return { success: true, redirectTo: '/dashboard' };
}

export default client;
