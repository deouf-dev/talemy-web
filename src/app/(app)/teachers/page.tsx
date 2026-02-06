"use client";
import { useState } from "react";
import { useTeachersSearch } from "@/features/teachers/hooks";
import { TeacherSearchFilters } from "@/features/teachers/types";
import { SearchFilters } from "@/components/teachers/SearchFilters";
import { TeacherCard } from "@/components/teachers/TeacherCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function TeachersPage() {
  const [filters, setFilters] = useState<TeacherSearchFilters>({
    page: 1,
    pageSize: 10,
  });

  const { data, isLoading, isError, error } = useTeachersSearch(filters);

  const handleSearch = () => {
    setFilters({ ...filters, page: 1 });
  };

  const handleLoadMore = () => {
    setFilters({ ...filters, page: (filters.page || 1) + 1 });
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Trouver un professeur</h1>
          <p className="text-muted-foreground">
            Recherchez parmi nos professeurs qualifiés et trouvez celui qui
            correspond à vos besoins
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filtres de recherche */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <SearchFilters
                filters={filters}
                onFiltersChange={setFilters}
                onSearch={handleSearch}
              />
            </div>
          </div>

          {/* Résultats de recherche */}
          <div className="lg:col-span-3">
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {isError && (
              <div className="bg-destructive/10 text-destructive rounded-lg p-6 text-center">
                <p className="font-medium">Une erreur est survenue</p>
                <p className="text-sm mt-1">
                  {error instanceof Error
                    ? error.message
                    : "Impossible de charger les professeurs"}
                </p>
              </div>
            )}

            {data && data.items && (
              <>
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    {data.total} professeur{data.total > 1 ? "s" : ""} trouvé
                    {data.total > 1 ? "s" : ""}
                  </p>
                </div>

                {data.items.length === 0 ? (
                  <div className="bg-card rounded-lg border p-12 text-center">
                    <p className="text-muted-foreground">
                      Aucun professeur trouvé avec ces critères.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Essayez de modifier vos filtres de recherche.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data.items.map((teacher) => (
                      <TeacherCard key={teacher.id} teacher={teacher} />
                    ))}

                    {data.totalPages && data.page < data.totalPages && (
                      <div className="flex justify-center pt-4">
                        <Button
                          onClick={handleLoadMore}
                          variant="outline"
                          className="w-full sm:w-auto"
                        >
                          Charger plus de professeurs
                        </Button>
                      </div>
                    )}

                    {data.totalPages && (
                      <div className="text-center text-sm text-muted-foreground pt-2">
                        Page {data.page} sur {data.totalPages}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
