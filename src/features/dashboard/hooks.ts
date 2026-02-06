import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/AuthContext";
import {
  getMyLessons,
  getUpcomingLessons,
  updateLessonStatus,
  getTeacherReviews,
  getMyConversations,
  getConversationMessages,
  sendMessage,
  getMyContactRequests,
  updateContactRequestStatus,
  deleteContactRequest,
  getMyAvailability,
  createAvailabilitySlot,
  updateAvailabilitySlot,
  deleteAvailabilitySlot,
  getMyTeacherProfile,
  updateMyTeacherProfile,
  updateMyTeacherSubjects,
  getAllSubjects,
  createLesson,
  LessonStatus,
  ContactRequestStatus,
} from "./api";
import { getLessonStatusInfo } from "./lesson-status";

// Lessons hooks

export function useMyLessons(params?: {
  status?: LessonStatus;
  page?: number;
  pageSize?: number;
}) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["lessons", "me", params],
    queryFn: () => getMyLessons(token!, params),
    enabled: !!token,
  });
}

export function useUpcomingLessons() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["lessons", "upcoming"],
    queryFn: () => getUpcomingLessons(token!),
    enabled: !!token,
  });
}

export function useUpdateLessonStatus() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      lessonId,
      status,
    }: {
      lessonId: number;
      status: LessonStatus;
    }) => updateLessonStatus(token!, lessonId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });
}

export function useCreateLesson() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      teacherUserId: number;
      studentUserId: number;
      subjectId: number;
      startAt: string;
      durationMin: number;
    }) => createLesson(token!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });
}

// Reviews hooks

export function useTeacherReviews(
  teacherUserId: number,
  params?: {
    page?: number;
    pageSize?: number;
  },
) {
  return useQuery({
    queryKey: ["reviews", "teacher", teacherUserId, params],
    queryFn: () => getTeacherReviews(teacherUserId, params),
    enabled: !!teacherUserId,
  });
}

// Conversations hooks

export function useMyConversations(params?: {
  limit?: number;
  offset?: number;
}) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["conversations", params],
    queryFn: () => getMyConversations(token!, params),
    enabled: !!token,
  });
}

export function useConversationMessages(
  conversationId: number | null,
  params?: {
    page?: number;
    pageSize?: number;
  },
) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["conversations", conversationId, "messages", params],
    queryFn: () => getConversationMessages(token!, conversationId!, params),
    enabled: !!token && conversationId !== null,
  });
}

export function useSendMessage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      content,
    }: {
      conversationId: number;
      content: string;
    }) => sendMessage(token!, conversationId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["conversations", variables.conversationId, "messages"],
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

// Contact requests hooks

export function useMyContactRequests(status?: ContactRequestStatus) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["requests", "me", status],
    queryFn: () => getMyContactRequests(token!, status),
    enabled: !!token,
  });
}

export function useUpdateContactRequestStatus() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      status,
    }: {
      requestId: number;
      status: ContactRequestStatus;
    }) => updateContactRequestStatus(token!, requestId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useDeleteContactRequest() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: number) => deleteContactRequest(token!, requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}

// Availability hooks

export function useMyAvailability() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["availability", "me"],
    queryFn: () => getMyAvailability(token!),
    enabled: !!token,
  });
}

export function useCreateAvailabilitySlot() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      dayOfWeek: number;
      startTime: string;
      endTime: string;
    }) => createAvailabilitySlot(token!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
  });
}

export function useUpdateAvailabilitySlot() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      slotId,
      data,
    }: {
      slotId: number;
      data: Partial<{
        dayOfWeek: number;
        startTime: string;
        endTime: string;
      }>;
    }) => updateAvailabilitySlot(token!, slotId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
  });
}

export function useDeleteAvailabilitySlot() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slotId: number) => deleteAvailabilitySlot(token!, slotId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
  });
}

// Teacher profile hooks

export function useMyTeacherProfile() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["teachers", "me"],
    queryFn: () => getMyTeacherProfile(token!),
    enabled: !!token,
  });
}

export function useUpdateMyTeacherProfile() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: Partial<{
        bio: string;
        city: string;
        hourlyRate: number;
        phone: string;
      }>,
    ) => updateMyTeacherProfile(token!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers", "me"] });
    },
  });
}

export function useUpdateMyTeacherSubjects() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subjectIds: number[]) =>
      updateMyTeacherSubjects(token!, subjectIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers", "me"] });
    },
  });
}

// Subjects hooks

export function useAllSubjects() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["subjects"],
    queryFn: () => getAllSubjects(token!),
    enabled: !!token,
  });
}

// Dashboard stats hook (computed from lessons and reviews)
export function useDashboardStats() {
  const { user } = useAuth();
  const { data: lessonsData } = useMyLessons({ pageSize: 100 });
  const { data: reviewsData } = useTeacherReviews(user?.id || 0, {
    pageSize: 100,
  });

  const lessons = lessonsData?.items || [];
  const reviews = reviewsData?.items || [];

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const isStudent = user?.role === "STUDENT";

  const coursesThisWeek = lessons.filter((lesson) => {
    const lessonDate = new Date(lesson.startAt);
    const statusInfo = getLessonStatusInfo(
      lesson.statusForStudent,
      lesson.statusForTeacher,
      isStudent,
    );
    return lessonDate >= startOfWeek && statusInfo.status === "CONFIRMED";
  }).length;

  const coursesThisMonth = lessons.filter((lesson) => {
    const lessonDate = new Date(lesson.startAt);
    const statusInfo = getLessonStatusInfo(
      lesson.statusForStudent,
      lesson.statusForTeacher,
      isStudent,
    );
    return lessonDate >= startOfMonth && statusInfo.status === "CONFIRMED";
  }).length;

  const totalHours = lessons
    .filter((lesson) => {
      const statusInfo = getLessonStatusInfo(
        lesson.statusForStudent,
        lesson.statusForTeacher,
        isStudent,
      );
      return statusInfo.status === "CONFIRMED";
    })
    .reduce((sum, lesson) => sum + lesson.durationMin / 60, 0);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return {
    coursesThisWeek,
    coursesThisMonth,
    totalHours,
    averageRating,
  };
}
