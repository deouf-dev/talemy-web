"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  Lock,
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/features/auth/AuthContext";
import { login } from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (auth.status === "authenticated") {
      router.replace(
        `/${auth.user?.role === "TEACHER" ? "dashboard" : "teachers"}`,
      );
    }
  }, [auth, router]);
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    setError(null);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    try {
      const { token, user } = await login(email, password);
      auth.login(token, user);
      router.replace(`/${user.role === "TEACHER" ? "dashboard" : "teachers"}`);
    } catch (error: any) {
      if (error.response?.status === 401) {
        setError("Email ou mot de passe incorrect.");
      } else if (error.response?.status === 429) {
        setError("Trop de tentatives. Réessayez plus tard.");
      } else {
        console.error("Login error:", error);
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Section gauche - Accueil et Stats */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-12 items-center justify-center relative overflow-hidden">
        {/* Effet de fond animé */}
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />

        <div className="max-w-lg space-y-8 relative z-10">
          <div className="space-y-4">
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-sm font-medium text-primary flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Votre réseau de professeurs particuliers
              </span>
            </div>
            <h1 className="text-5xl font-bold leading-tight">
              Reprenez contact avec vos enseignants
            </h1>
            <p className="text-lg text-muted-foreground">
              Connectez-vous pour gérer vos demandes, échanger avec vos
              professeurs et organiser vos cours.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 pt-8">
            <div className="p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">2.5k+</p>
                  <p className="text-xs text-muted-foreground">
                    Connexions réussies
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">500+</p>
                  <p className="text-xs text-muted-foreground">
                    Professeurs qualifiés
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature highlight */}
          <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex gap-3">
              <Zap className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Trouvez le prof parfait</h3>
                <p className="text-sm text-muted-foreground">
                  Parcourez les profils, envoyez des demandes et échangez
                  directement avec des professeurs particuliers qualifiés.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section droite - Formulaire de connexion */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8">
          <div className="flex flex-col items-center space-y-6">
            {/* Icône */}
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
              <Lock className="h-7 w-7 text-white" />
            </div>

            {/* Titre */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Bon retour !</h1>
              <p className="text-sm text-muted-foreground">
                Vous n'avez pas de compte ?{" "}
                <Link
                  href="/register"
                  className="text-primary font-medium hover:underline"
                >
                  S'inscrire gratuitement
                </Link>
                .
              </p>
            </div>

            {/* Formulaire de connexion */}
            <div className="w-full space-y-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-muted-foreground mb-1.5"
                  >
                    Adresse e-mail
                  </label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    className="h-11"
                    required
                    placeholder="exemple@email.com"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-muted-foreground"
                    >
                      Mot de passe
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-primary hover:underline"
                    >
                      Mot de passe oublié ?
                    </Link>
                  </div>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    className="h-11"
                    required
                    placeholder="••••••••"
                  />
                </div>

                {/* Bouton de soumission */}
                <Button type="submit" className="w-full h-11 mt-6">
                  Se connecter
                </Button>
              </form>

              {/* Séparateur */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-background px-2 text-muted-foreground">
                    Première visite ?
                  </span>
                </div>
              </div>

              {/* CTA Inscription */}
              <Link href="/register">
                <Button
                  variant="outline"
                  className="w-full h-11 border-2 hover:bg-primary/5 hover:border-primary"
                >
                  Créer un compte gratuit
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
