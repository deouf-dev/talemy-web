import { LessonStatus } from "./api";

export type LessonDisplayStatus =
  | "CONFIRMED" // Les deux ont confirmé
  | "WAITING_YOUR_CONFIRMATION" // L'autre a confirmé, mais pas nous
  | "WAITING_TEACHER_CONFIRMATION" // On a confirmé, mais pas le prof
  | "WAITING_STUDENT_CONFIRMATION" // On a confirmé, mais pas l'élève
  | "CANCELLED" // L'un des deux a annulé
  | "PENDING"; // Les deux sont en attente

export interface LessonStatusInfo {
  status: LessonDisplayStatus;
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
  canConfirm: boolean;
  canCancel: boolean;
}

/**
 * Détermine le statut d'affichage d'un cours en fonction des statuts étudiant et professeur
 * @param statusForStudent - Statut du cours pour l'étudiant
 * @param statusForTeacher - Statut du cours pour le professeur
 * @param isCurrentUserStudent - True si l'utilisateur courant est l'étudiant
 * @returns Informations sur le statut à afficher
 */
export function getLessonStatusInfo(
  statusForStudent: LessonStatus,
  statusForTeacher: LessonStatus,
  isCurrentUserStudent: boolean,
): LessonStatusInfo {
  // Si l'un des deux a annulé
  if (statusForStudent === "CANCELLED" || statusForTeacher === "CANCELLED") {
    return {
      status: "CANCELLED",
      label: "Annulé",
      variant: "destructive",
      canConfirm: false,
      canCancel: false,
    };
  }

  // Si les deux ont confirmé
  if (statusForStudent === "CONFIRMED" && statusForTeacher === "CONFIRMED") {
    return {
      status: "CONFIRMED",
      label: "Confirmé",
      variant: "default",
      canConfirm: false,
      canCancel: true,
    };
  }

  // Pour un étudiant
  if (isCurrentUserStudent) {
    // Le prof a confirmé mais pas l'étudiant
    if (statusForTeacher === "CONFIRMED" && statusForStudent === "PENDING") {
      return {
        status: "WAITING_YOUR_CONFIRMATION",
        label: "En attente de votre confirmation",
        variant: "secondary",
        canConfirm: true,
        canCancel: true,
      };
    }

    // L'étudiant a confirmé mais pas le prof
    if (statusForStudent === "CONFIRMED" && statusForTeacher === "PENDING") {
      return {
        status: "WAITING_TEACHER_CONFIRMATION",
        label: "En attente de la confirmation du professeur",
        variant: "outline",
        canConfirm: false,
        canCancel: true,
      };
    }
  }
  // Pour un professeur
  else {
    // L'étudiant a confirmé mais pas le prof
    if (statusForStudent === "CONFIRMED" && statusForTeacher === "PENDING") {
      return {
        status: "WAITING_YOUR_CONFIRMATION",
        label: "En attente de votre confirmation",
        variant: "secondary",
        canConfirm: true,
        canCancel: true,
      };
    }

    // Le prof a confirmé mais pas l'étudiant
    if (statusForTeacher === "CONFIRMED" && statusForStudent === "PENDING") {
      return {
        status: "WAITING_STUDENT_CONFIRMATION",
        label: "En attente de la confirmation de l'élève",
        variant: "outline",
        canConfirm: false,
        canCancel: true,
      };
    }
  }

  // Les deux sont en attente
  return {
    status: "PENDING",
    label: "En attente",
    variant: "secondary",
    canConfirm: true,
    canCancel: true,
  };
}
