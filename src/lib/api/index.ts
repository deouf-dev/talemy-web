import { apiFetch } from "./apiFetch";
import { User } from "../../features/profile/types";

/**
 * Fetch the current authenticated user's information.
 * @param token - Authentication token
 * @returns { {user: User} }
 */
export async function fetchMe(token: string): Promise<{ user: User }> {
  return await apiFetch("/auth/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

/**
 * Login a user with email and password.
 * @param email - User's email
 * @param password - User's password
 * @returns { {token: string, user: User} }
 */
export async function login(
  email: string,
  password: string,
): Promise<{ token: string; user: User }> {
  return await apiFetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: { email, password },
  });
}

/**
 * Register a new user.
 * @param email - User's email
 * @param password - User's password
 * @param name - User's first name
 * @param surname - User's last name
 * @param role - User's role (STUDENT or TEACHER)
 * @returns { {token: string, user: User} }
 */
export async function register(
  email: string,
  password: string,
  name: string,
  surname: string,
  role: "STUDENT" | "TEACHER",
): Promise<{ token: string; user: User }> {
  return await apiFetch("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: { email, password, name, surname, role },
  });
}
