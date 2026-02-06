"use client";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TeacherProfile } from "@/features/teachers/types";
import { MapPin, Star } from "lucide-react";

type TeacherCardProps = {
  teacher: TeacherProfile;
};

export function TeacherCard({ teacher }: TeacherCardProps) {
  const initials = `${teacher.name[0]}${teacher.surname[0]}`.toUpperCase();
  console.log(teacher);
  return (
    <Link href={`/teachers/${teacher.id}`}>
      <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-1">
              {teacher.name} {teacher.surname}
            </h3>
            {teacher.city && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                <MapPin className="h-3 w-3" />
                <span>{teacher.city}</span>
              </div>
            )}
            {teacher.bio && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {teacher.bio}
              </p>
            )}
            {teacher.subjects && teacher.subjects.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {teacher.subjects.slice(0, 3).map((subject) => (
                  <Badge key={subject.id} variant="secondary">
                    {subject.name}
                  </Badge>
                ))}
                {teacher.subjects.length > 3 && (
                  <Badge variant="outline">
                    +{teacher.subjects.length - 3}
                  </Badge>
                )}
              </div>
            )}
            <div className="flex items-center justify-between">
              {teacher.ratingAvg !== undefined && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">
                    {teacher.ratingAvg.slice(0, 3)}
                  </span>
                  {teacher.reviewsCount !== undefined && (
                    <span className="text-sm text-muted-foreground">
                      ({teacher.reviewsCount})
                    </span>
                  )}
                </div>
              )}
              {teacher.hourlyRate !== undefined && (
                <span className="font-semibold text-primary">
                  {teacher.hourlyRate}€/h
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
