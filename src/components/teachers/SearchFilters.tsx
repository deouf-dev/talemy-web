"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSubjects } from "@/features/teachers/hooks";
import { TeacherSearchFilters } from "@/features/teachers/types";
import { Search } from "lucide-react";

type SearchFiltersProps = {
  filters: TeacherSearchFilters;
  onFiltersChange: (filters: TeacherSearchFilters) => void;
  onSearch: () => void;
};

export function SearchFilters({
  filters,
  onFiltersChange,
  onSearch,
}: SearchFiltersProps) {
  const { data: subjectsData } = useSubjects();

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, city: e.target.value, page: 1 });
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ ...filters, subjectId: e.target.value, page: 1 });
  };

  return (
    <div className="bg-card rounded-lg border p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Rechercher un professeur</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="city">Ville</Label>
          <Input
            id="city"
            type="text"
            placeholder="Ex: Paris, Lyon..."
            value={filters.city || ""}
            onChange={handleCityChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="subject">Matière</Label>
          <select
            id="subject"
            value={filters.subjectId || ""}
            onChange={handleSubjectChange}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">Toutes les matières</option>
            {subjectsData?.subjects?.map((subject) => (
              <option key={subject.id} value={subject.id.toString()}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
        <Button onClick={onSearch} className="w-full">
          <Search className="mr-2 h-4 w-4" />
          Rechercher
        </Button>
      </div>
    </div>
  );
}
