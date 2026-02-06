import { apiFetch } from "@/lib/api/apiFetch";
import {
  StudentProfile,
  UpdateStudentProfilePayload,
  StudentProfileResponse,
} from "./student-types";

/**
 * Get the authenticated student's profile.
 */
export async function getStudentProfile(
  token: string,
): Promise<StudentProfileResponse> {
  return await apiFetch("/students/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * Update the authenticated student's profile.
 */
export async function updateStudentProfile(
  payload: UpdateStudentProfilePayload,
  token: string,
): Promise<StudentProfileResponse> {
  return await apiFetch("/students/me", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: payload,
  });
}
