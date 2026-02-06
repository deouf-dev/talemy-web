"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Loader2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddAvailabilityDialog } from "@/components/dashboard/AddAvailabilityDialog";
import {
  useUpcomingLessons,
  useMyAvailability,
  useDeleteAvailabilitySlot,
} from "@/features/dashboard/hooks";
import { useAuth } from "@/features/auth/AuthContext";
import { getLessonStatusInfo } from "@/features/dashboard/lesson-status";

const DAYS_OF_WEEK = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

// Format time from HH:MM:SS to HH:MM
const formatTimeWithoutSeconds = (time: string) => {
  return time.split(":").slice(0, 2).join(":");
};

export default function SchedulePage() {
  const { user } = useAuth();
  const { data: lessonsData, isLoading: loadingLessons } = useUpcomingLessons();
  const { data: availabilityData, isLoading: loadingAvailability } =
    useMyAvailability();
  const deleteSlotMutation = useDeleteAvailabilitySlot();

  const lessons = lessonsData?.lessons || [];
  const availabilitySlots = availabilityData?.slots || [];
  const isTeacher = user?.role === "TEACHER";

  const availabilityByDay = availabilitySlots.reduce(
    (acc, slot) => {
      if (!acc[slot.dayOfWeek]) {
        acc[slot.dayOfWeek] = [];
      }
      acc[slot.dayOfWeek].push(slot);
      return acc;
    },
    {} as Record<number, typeof availabilitySlots>,
  );

  const handleDeleteSlot = async (slotId: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce créneau ?")) {
      try {
        await deleteSlotMutation.mutateAsync(slotId);
      } catch (error) {
        console.error("Failed to delete slot:", error);
      }
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Emploi du temps</h2>
          <p className="text-muted-foreground">
            {isTeacher
              ? "Gérez vos disponibilités et vos cours à venir"
              : "Consultez vos cours à venir"}
          </p>
        </div>
        {isTeacher && <AddAvailabilityDialog />}
      </div>

      {/* Cours à venir */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Cours à venir
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingLessons ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : lessons.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun cours à venir
            </div>
          ) : (
            <div className="space-y-3">
              {lessons.map((lesson) => {
                const startDate = new Date(lesson.startAt);
                const endDate = new Date(
                  startDate.getTime() + lesson.durationMin * 60000,
                );
                const statusInfo = getLessonStatusInfo(
                  lesson.statusForStudent,
                  lesson.statusForTeacher,
                  user?.role === "STUDENT",
                );
                return (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold">
                          {startDate.getDate()}
                        </p>
                        <p className="text-xs text-muted-foreground uppercase">
                          {startDate.toLocaleDateString("fr-FR", {
                            month: "short",
                          })}
                        </p>
                      </div>
                      <div className="h-12 w-px bg-border" />
                      <div>
                        <p className="font-semibold">
                          {user?.role === "TEACHER"
                            ? `${lesson.student.name} ${lesson.student.surname}`
                            : lesson.teacher
                              ? `${lesson.teacher.name} ${lesson.teacher.surname}`
                              : "N/A"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {lesson.subject.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {formatTime(lesson.startAt)} -{" "}
                          {formatTime(endDate.toISOString())}
                        </span>
                        <span className="text-muted-foreground">
                          ({lesson.durationMin} min)
                        </span>
                      </div>
                      <Badge variant={statusInfo.variant}>
                        {statusInfo.label}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Disponibilités hebdomadaires - Only for teachers */}
      {isTeacher && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Disponibilités hebdomadaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingAvailability ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : availabilitySlots.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucune disponibilité définie
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(availabilityByDay)
                  .sort(([a], [b]) => parseInt(a) - parseInt(b))
                  .map(([dayOfWeek, slots]) => (
                    <div
                      key={dayOfWeek}
                      className="flex items-start gap-4 p-4 rounded-lg border"
                    >
                      <div className="w-32 font-semibold">
                        {DAYS_OF_WEEK[parseInt(dayOfWeek)]}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2">
                          {slots.map((slot) => (
                            <Badge
                              key={slot.id}
                              variant="outline"
                              className="text-sm group relative pr-7"
                            >
                              {formatTimeWithoutSeconds(slot.startTime)} -{" "}
                              {formatTimeWithoutSeconds(slot.endTime)}
                              <button
                                onClick={() => handleDeleteSlot(slot.id)}
                                className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity"
                                disabled={deleteSlotMutation.isPending}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
