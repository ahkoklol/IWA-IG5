// src/api/httpClient.ts
import axios from "axios";

const GATEWAY_URL =
  process.env.EXPO_PUBLIC_URL_GATEWAY ?? "http://localhost:8080";

export const httpClient = axios.create({
  baseURL: GATEWAY_URL.replace(/\/$/, ""), // tout passe par la gateway
  headers: {
    "Content-Type": "application/json",
  },
});
