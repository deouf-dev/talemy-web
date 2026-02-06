"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStudentProfile, updateStudentProfile } from "./student-api";
import { UpdateStudentProfilePayload } from "./student-types";

/**
 * Hook to get the student profile.
 */
export function useStudentProfile(token: string | null) {
  return useQuery({
    queryKey: ["student-profile"],
    queryFn: () => {
      if (!token) throw new Error("Non authentifié");
      return getStudentProfile(token);
    },
    enabled: !!token,
  });
}

/**
 * Hook to update the student profile.
 */
export function useUpdateStudentProfile(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateStudentProfilePayload) => {
      if (!token) throw new Error("Non authentifié");
      return updateStudentProfile(payload, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-profile"] });
    },
  });
}
