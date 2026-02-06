"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, BookOpen, Clock, Star, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  useDashboardStats,
  useUpcomingLessons,
  useTeacherReviews,
} from "@/features/dashboard/hooks";
import { useAuth } from "@/features/auth/AuthContext";
import { getLessonStatusInfo } from "@/features/dashboard/lesson-status";
import { StudentProfileCard } from "@/components/dashboard/StudentProfileCard";
import { StudentQuickActions } from "@/components/dashboard/StudentQuickActions";
import { StudentUpcomingLessons } from "@/components/dashboard/StudentUpcomingLessons";

export default function DashboardPage() {
  const { user } = useAuth();

  // Si l'utilisateur est un étudiant, afficher le dashboard étudiant
  if (user?.role === "STUDENT") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Tableau de bord</h2>
          <p className="text-muted-foreground">
            Bienvenue sur votre espace étudiant
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <StudentQuickActions />
            <StudentUpcomingLessons />
          </div>
          <div>
            <StudentProfileCard />
          </div>
        </div>
      </div>
    );
  }

  // Dashboard pour les enseignants
  const statsData = useDashboardStats();
  const { data: upcomingData } = useUpcomingLessons();
  const { data: reviewsData } = useTeacherReviews(user?.id || 0, {
    page: 1,
    pageSize: 3,
  });

  const stats = statsData || {
    coursesThisWeek: 0,
    coursesThisMonth: 0,
    totalHours: 0,
    averageRating: 0,
  };
  const upcomingLessons = upcomingData?.lessons.slice(0, 5) || [];
  const recentReviews = reviewsData?.items || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Tableau de bord</h2>
        <p className="text-muted-foreground">
          Bienvenue sur votre espace enseignant
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Cours cette semaine
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.coursesThisWeek}</div>
            <p className="text-xs text-muted-foreground">
              Cours à venir dans les 7 prochains jours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cours ce mois</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.coursesThisMonth}</div>
            <p className="text-xs text-muted-foreground">Total ce mois-ci</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Heures enseignées
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(stats.totalHours)}h
            </div>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Note moyenne</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {stats.averageRating.toFixed(1)}
              <span className="text-sm text-muted-foreground">/ 5</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {recentReviews.length} avis
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Prochains cours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Prochains cours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingLessons.map((lesson) => {
              const statusInfo = getLessonStatusInfo(
                lesson.statusForStudent,
                lesson.statusForTeacher,
                user?.role === "STUDENT",
              );
              return (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {lesson.student.name} {lesson.student.surname}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {lesson.subject.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {new Date(lesson.startAt).toLocaleDateString("fr-FR", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(lesson.startAt).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}{" "}
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
                    </div>
                    <Badge variant={statusInfo.variant}>
                      {statusInfo.label}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Avis récents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Avis récents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReviews.map((review) => (
              <div key={review.id} className="p-4 rounded-lg border">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {review.student.name} {review.student.surname}
                      </p>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
