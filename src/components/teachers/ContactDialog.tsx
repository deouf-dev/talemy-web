"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createContactRequest } from "@/features/teachers/api";
import { useAuth } from "@/features/auth/AuthContext";
import { Loader2, Send } from "lucide-react";

type ContactDialogProps = {
  teacherId: number;
  teacherName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ContactDialog({
  teacherId,
  teacherName,
  open,
  onOpenChange,
}: ContactDialogProps) {
  const [message, setMessage] = useState("");
  const { token } = useAuth();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("Non authentifié");
      return createContactRequest({ teacherUserId: teacherId, message }, token);
    },
    onSuccess: () => {
      setMessage("");
      onOpenChange(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      mutation.mutate();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Contacter {teacherName}</DialogTitle>
            <DialogDescription>
              Envoyez un message à {teacherName} pour prendre contact et
              discuter de vos besoins d'apprentissage.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="message">Votre message</Label>
              <Textarea
                id="message"
                placeholder="Ex: Bonjour, je souhaiterais prendre des cours de mathématiques..."
                className="min-h-[120px]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={mutation.isPending}
                required
              />
            </div>
            {mutation.isError && (
              <div className="text-sm text-destructive">
                {mutation.error instanceof Error
                  ? mutation.error.message
                  : "Une erreur est survenue lors de l'envoi de la demande"}
              </div>
            )}
            {mutation.isSuccess && (
              <div className="text-sm text-green-600">
                Demande envoyée avec succès !
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending || !message.trim()}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Envoyer la demande
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
