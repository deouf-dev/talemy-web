"use client";
import { useQuery } from "@tanstack/react-query";
import {
  searchTeachers,
  getTeacherById,
  getSubjects,
  getTeacherAvailability,
} from "./api";
import { TeacherSearchFilters } from "./types";

/**
 * Hook to search for teachers.
 */
export function useTeachersSearch(filters: TeacherSearchFilters) {
  return useQuery({
    queryKey: ["teachers", filters],
    queryFn: () => searchTeachers(filters),
  });
}

/**
 * Hook to get a single teacher by ID.
 */
export function useTeacher(id: number) {
  return useQuery({
    queryKey: ["teacher", id],
    queryFn: () => getTeacherById(id),
    enabled: !!id,
  });
}

/**
 * Hook to get all subjects.
 */
export function useSubjects() {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: () => getSubjects(),
  });
}

/**
 * Hook to get teacher availability.
 */
export function useTeacherAvailability(teacherId: number) {
  return useQuery({
    queryKey: ["teacher-availability", teacherId],
    queryFn: () => getTeacherAvailability(teacherId),
    enabled: !!teacherId,
  });
}
