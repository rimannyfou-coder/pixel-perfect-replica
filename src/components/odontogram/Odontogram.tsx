import { useState } from "react";
import { Tooth } from "./Tooth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToothStatus, STATUT_LABELS } from "@/data/mockData";

interface OdontogramProps {
  teeth: ToothStatus[];
  onUpdate?: (teeth: ToothStatus[]) => void;
  readOnly?: boolean;
}

export function Odontogram({ teeth, onUpdate, readOnly = false }: OdontogramProps) {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);

  // Organize teeth by quadrant
  const getTeethForRow = (start: number, end: number, reverse = false) => {
    const row = teeth
      .filter((t) => t.numero >= start && t.numero <= end)
      .sort((a, b) => a.numero - b.numero);
    return reverse ? row.reverse() : row;
  };

  const upperRight = getTeethForRow(11, 18, true); // 18..11
  const upperLeft = getTeethForRow(21, 28);          // 21..28
  const lowerLeft = getTeethForRow(31, 38, true);    // 38..31
  const lowerRight = getTeethForRow(41, 48);          // 41..48

  const selected = teeth.find((t) => t.numero === selectedTooth);

  const handleStatusChange = (statut: string) => {
    if (!selectedTooth || !onUpdate) return;
    const updated = teeth.map((t) =>
      t.numero === selectedTooth ? { ...t, statut } : t
    );
    onUpdate(updated);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-base">Odontogramme</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upper jaw */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-xs text-muted-foreground font-medium mb-1">Maxillaire (haut)</p>
          <div className="flex gap-0.5 md:gap-1 justify-center flex-wrap">
            {upperRight.map((t) => (
              <Tooth
                key={t.numero}
                numero={t.numero}
                statut={t.statut}
                isSelected={selectedTooth === t.numero}
                onClick={() => setSelectedTooth(selectedTooth === t.numero ? null : t.numero)}
              />
            ))}
            <div className="w-2 md:w-4" /> {/* Center gap */}
            {upperLeft.map((t) => (
              <Tooth
                key={t.numero}
                numero={t.numero}
                statut={t.statut}
                isSelected={selectedTooth === t.numero}
                onClick={() => setSelectedTooth(selectedTooth === t.numero ? null : t.numero)}
              />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed" />

        {/* Lower jaw */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex gap-0.5 md:gap-1 justify-center flex-wrap">
            {lowerRight.map((t) => (
              <Tooth
                key={t.numero}
                numero={t.numero}
                statut={t.statut}
                isSelected={selectedTooth === t.numero}
                onClick={() => setSelectedTooth(selectedTooth === t.numero ? null : t.numero)}
              />
            ))}
            <div className="w-2 md:w-4" />
            {lowerLeft.map((t) => (
              <Tooth
                key={t.numero}
                numero={t.numero}
                statut={t.statut}
                isSelected={selectedTooth === t.numero}
                onClick={() => setSelectedTooth(selectedTooth === t.numero ? null : t.numero)}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground font-medium mt-1">Mandibule (bas)</p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 pt-2">
          {Object.entries(STATUT_LABELS).map(([key, label]) => (
            <Badge key={key} variant="outline" className="text-xs gap-1">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: `hsl(var(--tooth-${key}))` }}
              />
              {label}
            </Badge>
          ))}
        </div>

        {/* Selected tooth panel */}
        {selected && !readOnly && (
          <div className="border rounded-lg p-4 bg-muted/50 animate-fade-in space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-semibold">Dent {selected.numero}</h4>
              <Badge>{STATUT_LABELS[selected.statut]}</Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Modifier le statut :</p>
              <Select value={selected.statut} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUT_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSelectedTooth(null)}>
              Fermer
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
