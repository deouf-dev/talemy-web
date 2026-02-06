"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Filter, Check, X } from "lucide-react";
import { LessonStatus } from "@/features/dashboard/types";
import {
  useUpcomingLessons,
  useUpdateLessonStatus,
} from "@/features/dashboard/hooks";
import { useAuth } from "@/features/auth/AuthContext";
import { getLessonStatusInfo } from "@/features/dashboard/lesson-status";
import { ApiLesson } from "@/features/dashboard/api";

export default function LessonsPage() {
  const { user } = useAuth();
  const { data: upcomingLessons } = useUpcomingLessons();
  const updateStatusMutation = useUpdateLessonStatus();
  const [statusFilter, setStatusFilter] = useState<LessonStatus | "ALL">("ALL");

  const isStudent = user?.role === "STUDENT";

  const handleConfirm = async (lessonId: number) => {
    await updateStatusMutation.mutateAsync({
      lessonId,
      status: "CONFIRMED",
    });
  };

  const handleCancel = async (lessonId: number) => {
    await updateStatusMutation.mutateAsync({
      lessonId,
      status: "CANCELLED",
    });
  };

  const filteredLessons =
    statusFilter === "ALL"
      ? upcomingLessons?.lessons
      : upcomingLessons?.lessons.filter((l) => {
          const statusInfo = getLessonStatusInfo(
            l.statusForStudent,
            l.statusForTeacher,
            isStudent,
          );
          // Pour les filtres, on utilise le statut "global"
          if (statusFilter === "CANCELLED") {
            return statusInfo.status === "CANCELLED";
          } else if (statusFilter === "CONFIRMED") {
            return statusInfo.status === "CONFIRMED";
          } else if (statusFilter === "PENDING") {
            // En attente = tous les statuts sauf confirmé et annulé
            return (
              statusInfo.status !== "CANCELLED" &&
              statusInfo.status !== "CONFIRMED"
            );
          }
          return true;
        });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Mes cours</h2>
          <p className="text-muted-foreground">
            Gérez tous vos cours et leurs statuts
          </p>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="h-4 w-4" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={statusFilter === "ALL" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("ALL")}
            >
              Tous ({upcomingLessons?.lessons.length})
            </Button>
            <Button
              variant={statusFilter === "CONFIRMED" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("CONFIRMED")}
            >
              Confirmés (
              {
                upcomingLessons?.lessons.filter((l) => {
                  const statusInfo = getLessonStatusInfo(
                    l.statusForStudent,
                    l.statusForTeacher,
                    isStudent,
                  );
                  return statusInfo.status === "CONFIRMED";
                }).length
              }
              )
            </Button>
            <Button
              variant={statusFilter === "PENDING" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("PENDING")}
            >
              En attente (
              {
                upcomingLessons?.lessons.filter((l) => {
                  const statusInfo = getLessonStatusInfo(
                    l.statusForStudent,
                    l.statusForTeacher,
                    isStudent,
                  );
                  return (
                    statusInfo.status !== "CANCELLED" &&
                    statusInfo.status !== "CONFIRMED"
                  );
                }).length
              }
              )
            </Button>
            <Button
              variant={statusFilter === "CANCELLED" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("CANCELLED")}
            >
              Annulés (
              {
                upcomingLessons?.lessons.filter((l) => {
                  const statusInfo = getLessonStatusInfo(
                    l.statusForStudent,
                    l.statusForTeacher,
                    isStudent,
                  );
                  return statusInfo.status === "CANCELLED";
                }).length
              }
              )
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des cours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Liste des cours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">
                    {isStudent ? "Professeur" : "Élève"}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">Matière</th>
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Horaire</th>
                  <th className="text-left py-3 px-4 font-semibold">Durée</th>
                  <th className="text-left py-3 px-4 font-semibold">Statut</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLessons?.map((lesson) => {
                  const statusInfo = getLessonStatusInfo(
                    lesson.statusForStudent,
                    lesson.statusForTeacher,
                    isStudent,
                  );

                  return (
                    <tr
                      key={lesson.id}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <p className="font-medium">
                          {isStudent
                            ? lesson.teacher
                              ? `${lesson.teacher.name} ${lesson.teacher.surname}`
                              : "N/A"
                            : `${lesson.student.name} ${lesson.student.surname}`}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm">{lesson.subject.name}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm">
                          {new Date(lesson.startAt).toLocaleDateString(
                            "fr-FR",
                            {
                              weekday: "short",
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm">
                          {new Date(lesson.startAt).toLocaleTimeString(
                            "fr-FR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            },
                          )}{" "}
                          -{" "}
                          {new Date(
                            new Date(lesson.startAt).getTime() +
                              lesson.durationMin * 60000,
                          ).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm">{lesson.durationMin} min</p>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={statusInfo.variant}>
                          {statusInfo.label}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          {statusInfo.canConfirm && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleConfirm(lesson.id)}
                              disabled={updateStatusMutation.isPending}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Confirmer
                            </Button>
                          )}
                          {statusInfo.canCancel && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleCancel(lesson.id)}
                              disabled={updateStatusMutation.isPending}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Annuler
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredLessons?.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Aucun cours trouvé avec ce filtre
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
