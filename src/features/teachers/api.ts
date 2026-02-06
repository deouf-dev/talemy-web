import { apiFetch } from "@/lib/api/apiFetch";
import {
  TeacherProfile,
  TeacherSearchFilters,
  TeachersSearchResponse,
  Subject,
  CreateContactRequestPayload,
  CreateContactRequestResponse,
  TeacherAvailabilityResponse,
} from "./types";

/**
 * Search for teachers based on filters.
 */
export async function searchTeachers(
  filters: TeacherSearchFilters = {},
): Promise<TeachersSearchResponse> {
  const queryParams = new URLSearchParams();
  if (filters.city) queryParams.append("city", filters.city);
  if (filters.subjectId) queryParams.append("subjectId", filters.subjectId);
  if (filters.page !== undefined)
    queryParams.append("page", filters.page.toString());
  if (filters.pageSize !== undefined)
    queryParams.append("pageSize", filters.pageSize.toString());

  const queryString = queryParams.toString()
    ? `?${queryParams.toString()}`
    : "";

  return await apiFetch(`/teachers${queryString}`, {
    method: "GET",
  });
}

/**
 * Get a single teacher by ID.
 */
export async function getTeacherById(id: number): Promise<TeacherProfile> {
  return await apiFetch(`/teachers/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Get all available subjects.
 */
export async function getSubjects(): Promise<{ subjects: Subject[] }> {
  return await apiFetch("/subjects", {
    method: "GET",
  });
}

/**
 * Create a contact request to a teacher.
 */
export async function createContactRequest(
  payload: CreateContactRequestPayload,
  token: string,
): Promise<CreateContactRequestResponse> {
  return await apiFetch("/requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: payload,
  });
}

/**
 * Get teacher availability slots.
 */
export async function getTeacherAvailability(
  teacherId: number,
): Promise<TeacherAvailabilityResponse> {
  return await apiFetch(`/availability/teacher/${teacherId}`, {
    method: "GET",
  });
}
