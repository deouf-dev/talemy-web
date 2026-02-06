"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Calendar } from "lucide-react";
import Link from "next/link";

export function StudentQuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <Link href="/dashboard/messages">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Messagerie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Discutez avec vos professeurs et gérez vos conversations
            </p>
            <Button className="w-full">Voir les messages</Button>
          </CardContent>
        </Link>
      </Card>

      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <Link href="/teachers">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Trouver un professeur
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Recherchez et contactez des professeurs qualifiés
            </p>
            <Button className="w-full">Chercher</Button>
          </CardContent>
        </Link>
      </Card>
    </div>
  );
}
