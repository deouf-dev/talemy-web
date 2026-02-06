"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, BookOpen, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateLesson, useAllSubjects } from "@/features/dashboard/hooks";
import { useAuth } from "@/features/auth/AuthContext";

interface ProposeLessonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentUserId: number;
  studentName: string;
  onLessonCreated?: () => void;
}

export function ProposeLessonDialog({
  open,
  onOpenChange,
  studentUserId,
  studentName,
  onLessonCreated,
}: ProposeLessonDialogProps) {
  const router = useRouter();
  const { user } = useAuth();
  const createLessonMutation = useCreateLesson();
  const { data: subjectsData } = useAllSubjects();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    subjectId: "",
    date: "",
    time: "",
    duration: "60",
  });

  const subjects = subjectsData?.subjects || [];

  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subjectId || !formData.date || !hours || !minutes) {
      return;
    }

    // Valider les heures et minutes
    const hoursNum = parseInt(hours);
    const minutesNum = parseInt(minutes);

    if (hoursNum < 0 || hoursNum > 23 || minutesNum < 0 || minutesNum > 59) {
      alert(
        "Heure invalide. Les heures doivent être entre 0 et 23, et les minutes entre 0 et 59.",
      );
      return;
    }

    try {
      // Formater l'heure au format HH:MM
      const formattedHours = hours.padStart(2, "0");
      const formattedMinutes = minutes.padStart(2, "0");
      const startAt = `${formData.date}T${formattedHours}:${formattedMinutes}:00.000Z`;

      await createLessonMutation.mutateAsync({
        studentUserId,
        teacherUserId: user!.id,
        subjectId: parseInt(formData.subjectId),
        startAt,
        durationMin: parseInt(formData.duration),
      });

      setShowSuccess(true);
      onLessonCreated?.();
    } catch (error) {
      console.error("Failed to create lesson:", error);
    }
  };

  const handleClose = () => {
    if (!createLessonMutation.isPending) {
      setFormData({
        subjectId: "",
        date: "",
        time: "",
        duration: "60",
      });
      setHours("");
      setMinutes("");
      setShowSuccess(false);
      onOpenChange(false);
    }
  };

  const handleViewSchedule = () => {
    handleClose();
    router.push("/dashboard/schedule");
  };

  // Générer la date minimum (aujourd'hui)
  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        {!showSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Proposer un cours
              </DialogTitle>
              <DialogDescription>
                Proposez un créneau de cours à {studentName}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Matière */}
              <div className="space-y-2">
                <Label htmlFor="subject">Matière *</Label>
                <Select
                  value={formData.subjectId}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, subjectId: value })
                  }
                  required
                >
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Sélectionnez une matière" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem
                        key={subject.id}
                        value={subject.id.toString()}
                      >
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date *
                </Label>
                <Input
                  id="date"
                  type="date"
                  min={today}
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>

              {/* Heure */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Heure *
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="23"
                    value={hours}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (
                        val === "" ||
                        (parseInt(val) >= 0 && parseInt(val) <= 23)
                      ) {
                        setHours(val);
                      }
                    }}
                    placeholder="14"
                    className="w-20 text-center"
                    required
                  />
                  <span className="text-lg font-semibold">:</span>
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (
                        val === "" ||
                        (parseInt(val) >= 0 && parseInt(val) <= 59)
                      ) {
                        setMinutes(val);
                      }
                    }}
                    placeholder="30"
                    className="w-20 text-center"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Format 24h (ex: 14:30)
                </p>
              </div>

              {/* Durée */}
              <div className="space-y-2">
                <Label htmlFor="duration">Durée</Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, duration: value })
                  }
                >
                  <SelectTrigger id="duration">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 heure</SelectItem>
                    <SelectItem value="90">1h30</SelectItem>
                    <SelectItem value="120">2 heures</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={createLessonMutation.isPending}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={createLessonMutation.isPending}>
                  {createLessonMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    "Proposer ce cours"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-600">
                <BookOpen className="h-5 w-5" />
                Cours proposé avec succès !
              </DialogTitle>
              <DialogDescription>
                Le cours a été proposé à {studentName}. Vous pouvez maintenant
                consulter votre emploi du temps.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="sm:justify-between">
              <Button variant="outline" onClick={handleClose}>
                Fermer
              </Button>
              <Button onClick={handleViewSchedule}>
                Voir mon emploi du temps
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
