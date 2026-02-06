import { ApiError } from "next/dist/server/api-utils";
import { env } from "../config/env";

type ApiFetchOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
};

export function apiFetch(endpoint: string, options: ApiFetchOptions = {}) {
  const url = `${env.apiBaseUrl}${endpoint}`;
  const { method = "GET", headers = {}, body } = options;

  const fetchOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = fetch(url, fetchOptions);

  return response.then(async (res) => {
    if (!res.ok) {
      const error = new ApiError(res.status, res.statusText);
      throw error;
    }
    return res.json();
  });
}
