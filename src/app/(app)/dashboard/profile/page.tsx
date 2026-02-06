"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Euro, BookOpen, Save, Loader2, X } from "lucide-react";
import {
  useMyTeacherProfile,
  useUpdateMyTeacherProfile,
  useUpdateMyTeacherSubjects,
  useAllSubjects,
} from "@/features/dashboard/hooks";
import { Alert } from "@/components/ui/alert";

export default function ProfilePage() {
  const { data: profileData, isLoading: loadingProfile } =
    useMyTeacherProfile();
  const { data: subjectsData } = useAllSubjects();
  const updateProfileMutation = useUpdateMyTeacherProfile();
  const updateSubjectsMutation = useUpdateMyTeacherSubjects();

  const profile = profileData?.profile;
  const allSubjects = subjectsData?.subjects || [];

  const [formData, setFormData] = useState({
    bio: "",
    city: "",
    hourlyRate: 0,
  });

  const [selectedSubjectIds, setSelectedSubjectIds] = useState<number[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // Initialize form with profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        bio: profile.bio || "",
        city: profile.city || "",
        hourlyRate: profile.hourlyRate || 0,
      });
      setSelectedSubjectIds(profile.subjects.map((s) => s.id));
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Update profile info
      await updateProfileMutation.mutateAsync(formData);

      // Update subjects if changed
      if (
        JSON.stringify(selectedSubjectIds.sort()) !==
        JSON.stringify(profile?.subjects.map((s) => s.id).sort())
      ) {
        await updateSubjectsMutation.mutateAsync(selectedSubjectIds);
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const toggleSubject = (subjectId: number) => {
    setSelectedSubjectIds((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId],
    );
  };

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-96 text-muted-foreground">
        Profil non trouvé
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-3xl font-bold">Mon profil</h2>
        <p className="text-muted-foreground">
          Gérez vos informations professionnelles
        </p>
      </div>

      {showSuccess && (
        <Alert className="bg-green-50 text-green-900 border-green-200">
          <p className="font-medium">Profil mis à jour avec succès !</p>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informations personnelles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Biographie</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Présentez-vous en quelques lignes..."
                rows={5}
              />
              <p className="text-xs text-muted-foreground">
                Cette description sera visible par les élèves sur votre profil
              </p>
            </div>

            {/* Matières enseignées */}
            <div className="space-y-3">
              <Label>
                <BookOpen className="h-4 w-4 inline mr-1" />
                Matières enseignées
              </Label>
              <div className="flex flex-wrap gap-2">
                {allSubjects.map((subject) => (
                  <Badge
                    key={subject.id}
                    variant={
                      selectedSubjectIds.includes(subject.id)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => toggleSubject(subject.id)}
                  >
                    {subject.name}
                    {selectedSubjectIds.includes(subject.id) && (
                      <X className="ml-1 h-3 w-3" />
                    )}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Cliquez sur les matières pour les sélectionner/désélectionner
              </p>
            </div>

            {/* Ville */}
            <div className="space-y-2">
              <Label htmlFor="city">
                <MapPin className="h-4 w-4 inline mr-1" />
                Ville
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                placeholder="Paris"
              />
            </div>

            {/* Tarif horaire */}
            <div className="space-y-2">
              <Label htmlFor="hourlyRate">
                <Euro className="h-4 w-4 inline mr-1" />
                Tarif horaire (€)
              </Label>
              <Input
                id="hourlyRate"
                type="number"
                min="0"
                step="5"
                value={formData.hourlyRate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hourlyRate: parseFloat(e.target.value),
                  })
                }
              />
              <p className="text-xs text-muted-foreground">
                Ce tarif sera affiché sur votre profil public
              </p>
            </div>

            {/* Bouton de sauvegarde */}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                size="lg"
                disabled={
                  updateProfileMutation.isPending ||
                  updateSubjectsMutation.isPending
                }
              >
                {updateProfileMutation.isPending ||
                updateSubjectsMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer les modifications
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Aperçu du profil */}
      <Card>
        <CardHeader>
          <CardTitle>Aperçu du profil public</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                {profile.user.name[0]}
                {profile.user.surname[0]}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">
                  {profile.user.name} {profile.user.surname}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-4 w-4" />
                  {formData.city}
                </p>
                <p className="text-lg font-semibold text-primary mt-2">
                  {formData.hourlyRate}€/h
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{formData.bio}</p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-2">Matières enseignées</p>
              <div className="flex flex-wrap gap-2">
                {allSubjects
                  .filter((s) => selectedSubjectIds.includes(s.id))
                  .map((subject) => (
                    <Badge key={subject.id} variant="outline">
                      {subject.name}
                    </Badge>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
