"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  GraduationCap,
  Users,
  MessageCircle,
  Target,
  Calendar,
  Shield,
  Star,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10">
        {/* Animated background pattern */}
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block mb-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    La plateforme de cours particuliers
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-6xl md:text-7xl font-bold leading-tight"
            >
              Trouvez votre
              <span className="text-primary"> professeur idéal</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
            >
              Talemy connecte étudiants et professeurs particuliers qualifiés
              pour une expérience d'apprentissage sur mesure.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/register">
                <Button size="lg" className="text-lg px-8 h-14">
                  Commencer gratuitement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/teachers">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 h-14 border-2"
                >
                  Découvrir les professeurs
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto"
            >
              {[
                { label: "Professeurs qualifiés", value: "500+" },
                { label: "Élèves satisfaits", value: "2.5k+" },
                { label: "Note moyenne", value: "4.8/5" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="text-center"
                >
                  <p className="text-3xl font-bold text-primary">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Pourquoi choisir Talemy ?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Une plateforme pensée pour faciliter la mise en relation entre
              élèves et professeurs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: GraduationCap,
                title: "Professeurs vérifiés",
                description:
                  "Tous nos enseignants sont sélectionnés pour leur expertise et leur pédagogie.",
              },
              {
                icon: MessageCircle,
                title: "Communication directe",
                description:
                  "Échangez facilement avec vos professeurs via notre messagerie intégrée.",
              },
              {
                icon: Calendar,
                title: "Flexibilité totale",
                description:
                  "Organisez vos cours selon vos disponibilités et vos besoins.",
              },
              {
                icon: Target,
                title: "Apprentissage personnalisé",
                description:
                  "Chaque cours est adapté à votre niveau et vos objectifs.",
              },
              {
                icon: Shield,
                title: "Paiements sécurisés",
                description:
                  "Réglez vos cours en toute sécurité hors de la plateforme.",
              },
              {
                icon: Star,
                title: "Avis transparents",
                description:
                  "Consultez les retours d'autres élèves pour faire le bon choix.",
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Trouver un professeur n'a jamais été aussi simple
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-8">
            {[
              {
                step: "1",
                title: "Créez votre compte",
                description:
                  "Inscrivez-vous gratuitement en quelques secondes et créez votre profil.",
              },
              {
                step: "2",
                title: "Parcourez les profils",
                description:
                  "Découvrez nos professeurs qualifiés et consultez leurs expériences.",
              },
              {
                step: "3",
                title: "Envoyez une demande",
                description:
                  "Contactez directement le professeur de votre choix via la messagerie.",
              },
              {
                step: "4",
                title: "Commencez à apprendre",
                description: "Organisez vos cours et suivez votre progression.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6 flex items-start gap-6">
                    <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold mb-2">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-lg">
                        {item.description}
                      </p>
                    </div>
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* For Teachers Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-12 bg-gradient-to-br from-primary/5 to-primary/10">
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                      <h2 className="text-4xl font-bold mb-4">
                        Vous êtes professeur ?
                      </h2>
                      <p className="text-lg text-muted-foreground mb-6">
                        Rejoignez Talemy et développez votre activité
                        d'enseignement en toute flexibilité.
                      </p>
                      <ul className="space-y-3 mb-8">
                        {[
                          "Fixez vos propres tarifs",
                          "Gérez votre emploi du temps",
                          "Accédez à des élèves motivés",
                          "Développez votre réputation",
                        ].map((item, index) => (
                          <motion.li
                            key={item}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="flex items-center gap-3"
                          >
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                            <span>{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                      <Link href="/register">
                        <Button size="lg" className="text-lg">
                          Devenir enseignant
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { icon: Users, label: "2.5k+ élèves" },
                        { icon: TrendingUp, label: "Revenus flexibles" },
                        { icon: Calendar, label: "Horaires libres" },
                        { icon: Star, label: "Note 4.8/5" },
                      ].map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                          <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.4,
                              delay: 0.2 + index * 0.1,
                            }}
                          >
                            <Card className="p-6 text-center">
                              <Icon className="h-8 w-8 text-primary mx-auto mb-2" />
                              <p className="font-semibold">{stat.label}</p>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center space-y-8"
          >
            <h2 className="text-5xl md:text-6xl font-bold">
              Prêt à commencer ?
            </h2>
            <p className="text-xl text-muted-foreground">
              Rejoignez des milliers d'élèves et de professeurs qui utilisent
              Talemy pour apprendre et enseigner.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8 h-14">
                  Créer un compte gratuit
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 h-14 border-2"
                >
                  Se connecter
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Talemy</h3>
              <p className="text-sm text-muted-foreground">
                La plateforme qui connecte élèves et professeurs particuliers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Élèves</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/teachers" className="hover:text-primary">
                    Trouver un professeur
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-primary">
                    S'inscrire
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Professeurs</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/register" className="hover:text-primary">
                    Devenir enseignant
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-primary">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">À propos</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-primary">
                    Qui sommes-nous ?
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2026 Talemy. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
