"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUpcomingLessons } from "@/features/dashboard/hooks";
import { getLessonStatusInfo } from "@/features/dashboard/lesson-status";
import { useAuth } from "@/features/auth/AuthContext";

export function StudentUpcomingLessons() {
  const { user } = useAuth();
  const { data, isLoading } = useUpcomingLessons();
  const lessons = data?.lessons?.slice(0, 5) || [];

  const isStudent = user?.role === "STUDENT";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Prochains Cours
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : lessons.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Aucun cours à venir
          </p>
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
                isStudent,
              );

              return (
                <div
                  key={lesson.id}
                  className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-semibold mb-1">
                      {lesson.subject.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Avec {lesson.teacher?.name} {lesson.teacher?.surname}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        {startDate.toLocaleDateString("fr-FR", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {startDate.toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}{" "}
                        -{" "}
                        {endDate.toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
                      </Badge>
                      <Badge variant={statusInfo.variant}>
                        {statusInfo.label}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
