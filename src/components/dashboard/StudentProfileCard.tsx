"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/features/auth/AuthContext";
import {
  useStudentProfile,
  useUpdateStudentProfile,
} from "@/features/profile/student-hooks";
import { User, MapPin, Mail, Loader2, Save } from "lucide-react";

export function StudentProfileCard() {
  const { token, user } = useAuth();
  const { data: profileData, isLoading } = useStudentProfile(token);
  const updateMutation = useUpdateStudentProfile(token);
  const [city, setCity] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const profile = profileData?.profile;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  const handleSave = () => {
    updateMutation.mutate(
      { city: city || undefined },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  const handleEdit = () => {
    setCity(profile?.city || "");
    setIsEditing(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Mon Profil
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-muted-foreground">Nom complet</Label>
          <div className="font-medium">
            {user?.name} {user?.surname}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground flex items-center gap-1">
            <Mail className="h-3 w-3" />
            Email
          </Label>
          <div className="font-medium">{user?.email}</div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="city" className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            Ville
          </Label>
          {isEditing ? (
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ex: Paris, Lyon..."
              disabled={updateMutation.isPending}
            />
          ) : (
            <div className="font-medium">
              {profile?.city || (
                <span className="text-muted-foreground italic">
                  Non renseignée
                </span>
              )}
            </div>
          )}
        </div>

        {updateMutation.isError && (
          <div className="text-sm text-destructive">
            Une erreur est survenue lors de la mise à jour
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {isEditing ? (
            <>
              <Button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="flex-1"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={updateMutation.isPending}
              >
                Annuler
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit} variant="outline" className="w-full">
              Modifier
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
