"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, TrendingUp, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTeacherReviews } from "@/features/dashboard/hooks";
import { useAuth } from "@/features/auth/AuthContext";

export default function ReviewsPage() {
  const { user } = useAuth();
  const { data: reviewsData, isLoading } = useTeacherReviews(user?.id || 0, {
    page: 1,
    pageSize: 50,
  });

  const reviews = reviewsData?.items || [];
  const totalReviews = reviewsData?.total || 0;

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Avis des élèves</h2>
        <p className="text-muted-foreground">
          Consultez les retours de vos élèves
        </p>
      </div>

      {/* Note moyenne */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Note moyenne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <div className="text-4xl font-bold">
                {averageRating.toFixed(1)}
              </div>
              <div className="text-muted-foreground pb-1">/ 5</div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted"
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Total d'avis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{totalReviews}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Avis reçus au total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <div className="text-4xl font-bold">
                {Math.round((averageRating / 5) * 100)}%
              </div>
              <TrendingUp className="h-6 w-6 text-green-500 mb-2" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Élèves satisfaits
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Liste des avis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Tous les avis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun avis pour le moment
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="pb-6 border-b last:border-b-0">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {review.student.name[0]}
                        {review.student.surname[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold">
                            {review.student.name} {review.student.surname}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-muted"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {review.rating}/5
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString(
                            "fr-FR",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
