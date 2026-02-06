"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useTeacher, useTeacherAvailability } from "@/features/teachers/hooks";
import { useAuth } from "@/features/auth/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContactDialog } from "@/components/teachers/ContactDialog";
import { AvailabilityDisplay } from "@/components/teachers/AvailabilityDisplay";
import {
  MapPin,
  Star,
  Mail,
  Loader2,
  MessageCircle,
  BookOpen,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function TeacherProfilePage() {
  const params = useParams();
  const teacherId = parseInt(params.userId as string);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const { user } = useAuth();

  const { data: teacher, isLoading, isError, error } = useTeacher(teacherId);
  const { data: availabilityData } = useTeacherAvailability(teacherId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (isError || !teacher) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-destructive/10 text-destructive rounded-lg p-6 text-center">
            <p className="font-medium">Professeur introuvable</p>
            <p className="text-sm mt-1">
              {error instanceof Error
                ? error.message
                : "Impossible de charger le profil du professeur"}
            </p>
          </div>
        </div>
      </div>
    );
  }
  const initials = `${teacher.name[0]}${teacher.surname[0]}`.toUpperCase();
  const rating = teacher.ratingAvg ? parseFloat(teacher.ratingAvg) : null;

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header Card */}
        <Card className="p-8 mb-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Avatar className="h-32 w-32 shadow-lg">
              <AvatarFallback className="bg-primary/10 text-primary text-3xl">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">
                {teacher.name} {teacher.surname}
              </h1>

              <div className="flex flex-wrap gap-4 mb-4">
                {teacher.city && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{teacher.city}</span>
                  </div>
                )}
                {rating !== null && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{rating.toFixed(1)}</span>
                    {teacher.reviewsCount !== undefined && (
                      <span className="text-sm text-muted-foreground">
                        ({teacher.reviewsCount} avis)
                      </span>
                    )}
                  </div>
                )}
                {teacher.hourlyRate !== undefined && (
                  <div className="text-2xl font-bold text-primary">
                    {teacher.hourlyRate}€/h
                  </div>
                )}
              </div>

              {user?.role === "STUDENT" && (
                <Button
                  size="lg"
                  className="w-full md:w-auto"
                  onClick={() => setContactDialogOpen(true)}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Contacter le professeur
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Bio Section */}
        {teacher.bio && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />À propos
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {teacher.bio}
            </p>
          </Card>
        )}

        {/* Subjects Section */}
        {teacher.subjects && teacher.subjects.length > 0 && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Matières enseignées
            </h2>
            <div className="flex flex-wrap gap-2">
              {teacher.subjects.map((subject) => (
                <Badge
                  key={subject.id}
                  variant="secondary"
                  className="text-base px-4 py-2"
                >
                  {subject.name}
                </Badge>
              ))}
            </div>
          </Card>
        )}

        {/* Availability Section - Only visible for teachers */}
        {user?.role === "TEACHER" &&
          availabilityData &&
          availabilityData.slots && (
            <AvailabilityDisplay slots={availabilityData.slots} />
          )}
      </div>

      {/* Contact Dialog */}
      <ContactDialog
        teacherId={teacher.userId}
        teacherName={`${teacher.name} ${teacher.surname}`}
        open={contactDialogOpen}
        onOpenChange={setContactDialogOpen}
      />
    </div>
  );
}
