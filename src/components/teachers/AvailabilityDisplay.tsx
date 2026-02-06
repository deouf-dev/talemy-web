"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AvailabilitySlot } from "@/features/teachers/types";
import { Calendar, Clock } from "lucide-react";

type AvailabilityDisplayProps = {
  slots: AvailabilitySlot[];
};

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

export function AvailabilityDisplay({ slots }: AvailabilityDisplayProps) {
  // Grouper les créneaux par jour de la semaine
  const slotsByDay = slots.reduce(
    (acc, slot) => {
      if (!acc[slot.dayOfWeek]) {
        acc[slot.dayOfWeek] = [];
      }
      acc[slot.dayOfWeek].push(slot);
      return acc;
    },
    {} as Record<number, AvailabilitySlot[]>,
  );

  // Trier les créneaux par heure de début
  Object.keys(slotsByDay).forEach((day) => {
    slotsByDay[parseInt(day)].sort((a, b) =>
      a.startTime.localeCompare(b.startTime),
    );
  });

  if (slots.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Disponibilités
        </h2>
        <p className="text-muted-foreground">
          Aucune disponibilité n'a été définie pour le moment.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Calendar className="h-5 w-5 text-primary" />
        Disponibilités
      </h2>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6, 0].map((dayIndex) => {
          const daySlots = slotsByDay[dayIndex];
          if (!daySlots || daySlots.length === 0) return null;

          return (
            <div key={dayIndex} className="border-l-4 border-primary/20 pl-4">
              <h3 className="font-semibold text-lg mb-2">
                {DAYS_OF_WEEK[dayIndex]}
              </h3>
              <div className="flex flex-wrap gap-2">
                {daySlots.map((slot) => (
                  <Badge
                    key={slot.id}
                    variant="outline"
                    className="text-sm px-3 py-1.5 border-primary/30"
                  >
                    <Clock className="h-3 w-3 mr-1 inline" />
                    {formatTimeWithoutSeconds(slot.startTime)} -{" "}
                    {formatTimeWithoutSeconds(slot.endTime)}
                  </Badge>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
