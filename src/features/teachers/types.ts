export type Subject = {
  id: number;
  name: string;
  category?: string;
};

export type TeacherProfile = {
  userId: number;
  id: number;
  name: string;
  surname: string;
  email: string;
  role: "TEACHER";
  bio?: string;
  city?: string;
  hourlyRate?: number;
  subjects?: Subject[];
  ratingAvg?: string;
  reviewsCount?: number;
};

export type TeacherSearchFilters = {
  city?: string;
  subjectId?: string;
  page?: number;
  pageSize?: number;
};

export type TeachersSearchResponse = {
  items: TeacherProfile[];
  total: number;
  page: number;
  pageSize: number;
  totalPages?: number;
};

export type ContactRequest = {
  id: number;
  studentUserId: number;
  teacherUserId: number;
  message: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
};

export type CreateContactRequestPayload = {
  teacherUserId: number;
  message: string;
};

export type CreateContactRequestResponse = {
  contactRequest: ContactRequest;
};

export type AvailabilitySlot = {
  id: number;
  teacherUserId: number;
  dayOfWeek: number; // 0-6 (0 = Dimanche)
  startAt: string;
  endAt: string;
  createdAt: string;
  updatedAt: string;
};

export type TeacherAvailabilityResponse = {
  slots: AvailabilitySlot[];
};
