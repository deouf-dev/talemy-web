"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useCreateAvailabilitySlot } from "@/features/dashboard/hooks";

const DAYS_OF_WEEK = [
  { value: 0, label: "Dimanche" },
  { value: 1, label: "Lundi" },
  { value: 2, label: "Mardi" },
  { value: 3, label: "Mercredi" },
  { value: 4, label: "Jeudi" },
  { value: 5, label: "Vendredi" },
  { value: 6, label: "Samedi" },
];

export function AddAvailabilityDialog() {
  const [open, setOpen] = useState(false);
  const [dayOfWeek, setDayOfWeek] = useState<string>("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const createSlotMutation = useCreateAvailabilitySlot();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dayOfWeek || !startTime || !endTime) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    // Convert HH:MM to HH:MM:SS format
    const formattedStartTime = startTime + ":00";
    const formattedEndTime = endTime + ":00";

    try {
      await createSlotMutation.mutateAsync({
        dayOfWeek: parseInt(dayOfWeek),
        startTime: formattedStartTime,
        endTime: formattedEndTime,
      });
      // Reset form and close dialog
      setDayOfWeek("");
      setStartTime("");
      setEndTime("");
      setOpen(false);
    } catch (error) {
      console.error("Failed to create slot:", error);
      alert("Erreur lors de la création du créneau");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un créneau
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un créneau de disponibilité</DialogTitle>
          <DialogDescription>
            Définissez vos disponibilités hebdomadaires pour que les étudiants
            puissent réserver des cours.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dayOfWeek">Jour de la semaine</Label>
            <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
              <SelectTrigger id="dayOfWeek">
                <SelectValue placeholder="Sélectionnez un jour" />
              </SelectTrigger>
              <SelectContent>
                {DAYS_OF_WEEK.map((day) => (
                  <SelectItem key={day.value} value={day.value.toString()}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="startTime">Heure de début</Label>
            <Input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endTime">Heure de fin</Label>
            <Input
              id="endTime"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={createSlotMutation.isPending}>
              {createSlotMutation.isPending ? "Création..." : "Créer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
