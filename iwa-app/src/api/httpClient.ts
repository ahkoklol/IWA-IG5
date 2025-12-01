// src/api/httpClient.ts
import axios from "axios";

export const httpClient = axios.create({
  // No global baseURL here because you already have per-microservice BASE_URL constants.
  headers: {
    "Content-Type": "application/json",
  },
  // Axios already rejects promise for status < 200 or >= 300 by default
});
