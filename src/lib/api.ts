import axios from "axios";

const DEFAULT_API_BASE_URL = "https://luckywdata-production.up.railway.app";

const normalizeBaseUrl = (value: string | undefined) =>
	value?.trim().replace(/\/+$/, "");

export const API_BASE_URL =
	normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL) ?? DEFAULT_API_BASE_URL;

export const buildApiUrl = (path: string) =>
	`${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

const api = axios.create({
	baseURL: API_BASE_URL,
});

export default api;
