"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  GraduationCap,
  Users,
  MessageCircle,
  Target,
  BookOpen,
  Euro,
  Calendar,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/features/auth/AuthContext";
import { register } from "@/lib/api";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

type Role = "STUDENT" | "TEACHER";

export default function RegisterPage() {
  const auth = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role>("STUDENT");

  useEffect(() => {
    if (auth.status === "authenticated") {
      router.replace(
        `/${auth.user?.role === "TEACHER" ? "teachers" : "dashboard"}`,
      );
    }
  }, [auth, router]);
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    setError(null);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const surname = formData.get("surname") as string;

    try {
      const { token, user } = await register(
        email,
        password,
        name,
        surname,
        selectedRole,
      );
      auth.login(token, user);
      router.replace(`/${user?.role === "TEACHER" ? "dashboard" : "teachers"}`);
    } catch (error: any) {
      if (error.statusCode === 409) {
        setError("Cet email est déjà utilisé.");
      } else if (error.statusCode === 422) {
        setError("Veuillez vérifier les informations saisies.");
      } else {
        console.error("Registration error:", error);
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Section gauche - Pourquoi choisir Talemy */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/5 p-12 items-center justify-center">
        <div className="max-w-lg space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">
              Pourquoi choisir Talemy ?
            </h1>
            <AnimatePresence mode="wait">
              <motion.p
                key={selectedRole}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-lg text-muted-foreground"
              >
                {selectedRole === "STUDENT"
                  ? "Trouvez le professeur parfait pour atteindre vos objectifs d'apprentissage."
                  : "Partagez votre passion et développez votre activité d'enseignement."}
              </motion.p>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedRole}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4, staggerChildren: 0.1 }}
              className="space-y-6"
            >
              {selectedRole === "STUDENT" ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        Professeurs qualifiés
                      </h3>
                      <p className="text-muted-foreground">
                        Accédez à un réseau de professeurs particuliers
                        expérimentés et passionnés, prêts à vous accompagner.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex gap-4"
                  >
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        Communication directe
                      </h3>
                      <p className="text-muted-foreground">
                        Échangez facilement avec vos professeurs grâce à notre
                        système de messagerie intégré.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-4"
                  >
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        Apprentissage sur mesure
                      </h3>
                      <p className="text-muted-foreground">
                        Bénéficiez d'un accompagnement adapté à vos besoins et à
                        votre rythme d'apprentissage.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex gap-4"
                  >
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        Parcourez les profils
                      </h3>
                      <p className="text-muted-foreground">
                        Consultez les profils détaillés des professeurs et
                        choisissez celui qui correspond le mieux à vos attentes.
                      </p>
                    </div>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Euro className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        Revenus complémentaires
                      </h3>
                      <p className="text-muted-foreground">
                        Générez des revenus en partageant vos connaissances et
                        fixez vos propres tarifs.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex gap-4"
                  >
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        Flexibilité totale
                      </h3>
                      <p className="text-muted-foreground">
                        Gérez votre emploi du temps comme vous le souhaitez et
                        enseignez à votre rythme.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-4"
                  >
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        Élèves motivés
                      </h3>
                      <p className="text-muted-foreground">
                        Connectez-vous avec des élèves réellement intéressés par
                        votre expertise.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex gap-4"
                  >
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        Développez votre activité
                      </h3>
                      <p className="text-muted-foreground">
                        Augmentez votre visibilité et construisez votre
                        réputation de professeur particulier.
                      </p>
                    </div>
                  </motion.div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Section droite - Formulaire d'inscription */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8">
          <div className="flex flex-col items-center space-y-6">
            {/* Icône */}
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>

            {/* Titre */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Créer un compte</h1>
              <p className="text-sm text-muted-foreground">
                Vous avez déjà un compte ?{" "}
                <Link
                  href="/login"
                  className="text-primary font-medium hover:underline"
                >
                  Se connecter
                </Link>
                .
              </p>
            </div>

            {/* Sélecteur de rôle */}
            <div className="w-full space-y-3">
              <label className="block text-sm font-medium text-center">
                Je suis...
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole("STUDENT")}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105",
                    selectedRole === "STUDENT"
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  <div className="flex flex-col items-center gap-2">
                    <BookOpen
                      className={cn(
                        "h-8 w-8",
                        selectedRole === "STUDENT"
                          ? "text-primary"
                          : "text-muted-foreground",
                      )}
                    />
                    <span
                      className={cn(
                        "font-medium text-sm",
                        selectedRole === "STUDENT"
                          ? "text-primary"
                          : "text-muted-foreground",
                      )}
                    >
                      Étudiant
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole("TEACHER")}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105",
                    selectedRole === "TEACHER"
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  <div className="flex flex-col items-center gap-2">
                    <GraduationCap
                      className={cn(
                        "h-8 w-8",
                        selectedRole === "TEACHER"
                          ? "text-primary"
                          : "text-muted-foreground",
                      )}
                    />
                    <span
                      className={cn(
                        "font-medium text-sm",
                        selectedRole === "TEACHER"
                          ? "text-primary"
                          : "text-muted-foreground",
                      )}
                    >
                      Enseignant
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Formulaire d'inscription */}
            <div className="w-full">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-muted-foreground"
                    >
                      Prénom
                    </label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
                      required
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="surname"
                      className="block text-sm font-medium text-muted-foreground"
                    >
                      Nom
                    </label>
                    <Input
                      type="text"
                      id="surname"
                      name="surname"
                      className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
                      required
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-muted-foreground"
                  >
                    Adresse e-mail
                  </label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
                    required
                    placeholder="Votre adresse e-mail"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-muted-foreground"
                  >
                    Mot de passe
                  </label>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
                    required
                    placeholder="Créer un mot de passe"
                    minLength={8}
                  />
                </div>

                {/* Bouton de soumission */}
                <Button type="submit" className="w-full">
                  S'inscrire
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  En vous inscrivant, vous acceptez nos conditions d'utilisation
                  et notre politique de confidentialité.
                </p>
              </form>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
