import { apiFetch } from "@/lib/api/apiFetch";

// Types pour l'API
export type LessonStatus = "PENDING" | "CONFIRMED" | "CANCELLED";
export type ContactRequestStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface ApiLesson {
  id: number;
  teacherUserId: number;
  studentUserId: number;
  subjectId: number;
  startAt: string;
  durationMin: number;
  statusForStudent: LessonStatus;
  statusForTeacher: LessonStatus;
  teacher: {
    id: number;
    name: string;
    surname: string;
    email: string;
  };
  student: {
    id: number;
    name: string;
    surname: string;
    email: string;
  };
  subject: {
    id: number;
    name: string;
  };
}

export interface ApiReview {
  id: number;
  teacherUserId: number;
  studentUserId: number;
  rating: number;
  comment: string;
  createdAt: string;
  student: {
    id: number;
    name: string;
    surname: string;
  };
}

export interface ApiConversation {
  id: number;
  partner: {
    id: number;
    name: string;
    surname: string;
    email: string;
  };
  lastMessage?: {
    id: number;
    senderUserId: number;
    content: string;
    createdAt: string;
  };
  contactRequest: {
    id: number;
    status: ContactRequestStatus;
    message: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApiMessage {
  id: number;
  conversationId: number;
  senderUserId: number;
  content: string;
  createdAt: string;
}

export interface ApiAvailabilitySlot {
  id: number;
  teacherUserId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiTeacherProfile {
  id: number;
  userId: number;
  bio: string;
  city: string;
  hourlyRate: number;
  ratingAvg: string;
  reviewsCount: number;
  user: {
    id: number;
    name: string;
    surname: string;
    email: string;
  };
  subjects: Array<{
    id: number;
    name: string;
  }>;
}

// API Functions

/**
 * Get my lessons with pagination and optional status filter
 */
export async function getMyLessons(
  token: string,
  params?: {
    status?: LessonStatus;
    page?: number;
    pageSize?: number;
  },
): Promise<{
  items: ApiLesson[];
  page: number;
  pageSize: number;
  total: number;
}> {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.append("status", params.status);
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.pageSize)
    queryParams.append("pageSize", params.pageSize.toString());

  return await apiFetch(`/lessons/me?${queryParams.toString()}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

/**
 * Get upcoming lessons
 */
export async function getUpcomingLessons(
  token: string,
): Promise<{ lessons: ApiLesson[] }> {
  return await apiFetch("/lessons/upcoming", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

/**
 * Update lesson status
 */
export async function updateLessonStatus(
  token: string,
  lessonId: number,
  status: LessonStatus,
): Promise<{ lesson: ApiLesson }> {
  return await apiFetch(`/lessons/${lessonId}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: { status },
  });
}

/**
 * Get teacher reviews (for viewing own reviews as teacher)
 */
export async function getTeacherReviews(
  teacherUserId: number,
  params?: {
    page?: number;
    pageSize?: number;
  },
): Promise<{
  items: ApiReview[];
  page: number;
  pageSize: number;
  total: number;
}> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.pageSize)
    queryParams.append("pageSize", params.pageSize.toString());

  return await apiFetch(
    `/reviews/teacher/${teacherUserId}?${queryParams.toString()}`,
    {
      method: "GET",
    },
  );
}

/**
 * Get my conversations
 */
export async function getMyConversations(
  token: string,
  params?: {
    limit?: number;
    offset?: number;
  },
): Promise<{ conversations: ApiConversation[] }> {
  const queryParams = new URLSearchParams();
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.offset) queryParams.append("offset", params.offset.toString());

  return await apiFetch(`/conversations?${queryParams.toString()}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

/**
 * Get conversation messages
 */
export async function getConversationMessages(
  token: string,
  conversationId: number,
  params?: {
    page?: number;
    pageSize?: number;
  },
): Promise<{
  messages: ApiMessage[];
  page: number;
  pageSize: number;
  total: number;
}> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.pageSize)
    queryParams.append("pageSize", params.pageSize.toString());

  return await apiFetch(
    `/conversations/${conversationId}/messages?${queryParams.toString()}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    },
  );
}

/**
 * Send a message
 */
export async function sendMessage(
  token: string,
  conversationId: number,
  content: string,
): Promise<ApiMessage> {
  return await apiFetch(`/conversations/${conversationId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: { content },
  });
}

/**
 * Get my contact requests (for teachers, these are received requests)
 */
export async function getMyContactRequests(
  token: string,
  status?: ContactRequestStatus,
): Promise<{
  contactRequests: Array<{
    id: number;
    studentUserId: number;
    teacherUserId: number;
    message: string;
    status: ContactRequestStatus;
    student?: {
      id: number;
      name: string;
      surname: string;
    };
    teacher?: {
      id: number;
      name: string;
      surname: string;
    };
  }>;
}> {
  const queryParams = new URLSearchParams();
  if (status) queryParams.append("status", status);

  return await apiFetch(`/requests/me?${queryParams.toString()}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

/**
 * Update contact request status
 */
export async function updateContactRequestStatus(
  token: string,
  requestId: number,
  status: ContactRequestStatus,
): Promise<{
  id: number;
  status: ContactRequestStatus;
}> {
  return await apiFetch(`/requests/${requestId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: { status },
  });
}

/**
 * Delete (cancel) contact request
 */
export async function deleteContactRequest(
  token: string,
  requestId: number,
): Promise<void> {
  return await apiFetch(`/requests/${requestId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * Get my availability slots
 */
export async function getMyAvailability(
  token: string,
): Promise<{ slots: ApiAvailabilitySlot[] }> {
  return await apiFetch("/availability/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

/**
 * Create availability slot
 */
export async function createAvailabilitySlot(
  token: string,
  data: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  },
): Promise<{ slot: ApiAvailabilitySlot }> {
  return await apiFetch("/availability", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: data,
  });
}

/**
 * Update availability slot
 */
export async function updateAvailabilitySlot(
  token: string,
  slotId: number,
  data: Partial<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }>,
): Promise<{ slot: ApiAvailabilitySlot }> {
  return await apiFetch(`/availability/${slotId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: data,
  });
}

/**
 * Delete availability slot
 */
export async function deleteAvailabilitySlot(
  token: string,
  slotId: number,
): Promise<void> {
  return await apiFetch(`/availability/${slotId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

/**
 * Get my teacher profile
 */
export async function getMyTeacherProfile(
  token: string,
): Promise<{ profile: ApiTeacherProfile }> {
  return await apiFetch("/teachers/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

/**
 * Update my teacher profile
 */
export async function updateMyTeacherProfile(
  token: string,
  data: Partial<{
    bio: string;
    city: string;
    hourlyRate: number;
    phone: string;
  }>,
): Promise<{ profile: ApiTeacherProfile }> {
  return await apiFetch("/teachers/me", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: data,
  });
}

/**
 * Update my teacher subjects
 */
export async function updateMyTeacherSubjects(
  token: string,
  subjectIds: number[],
): Promise<{ profile: ApiTeacherProfile }> {
  return await apiFetch("/teachers/me/subjects", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: { subjectIds },
  });
}

/**
 * Get all subjects
 */
export async function getAllSubjects(token: string): Promise<{
  subjects: Array<{ id: number; name: string }>;
}> {
  return await apiFetch("/subjects", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * Create a new lesson
 */
export async function createLesson(
  token: string,
  data: {
    teacherUserId: number;
    studentUserId: number;
    subjectId: number;
    startAt: string;
    durationMin: number;
  },
): Promise<{ lesson: ApiLesson }> {
  return await apiFetch("/lessons", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: data,
  });
}
