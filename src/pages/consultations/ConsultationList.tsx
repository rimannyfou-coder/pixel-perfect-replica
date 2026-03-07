import { useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MOCK_CONSULTATIONS } from "@/data/mockData";
import { Search, Plus, Eye, Stethoscope } from "lucide-react";

export default function ConsultationList() {
  const [search, setSearch] = useState("");
  const [consultations] = useState(MOCK_CONSULTATIONS);

  const filtered = consultations.filter(
    (c) =>
      c.patient_nom.toLowerCase().includes(search.toLowerCase()) ||
      c.motif.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold flex items-center gap-2">
              <Stethoscope className="h-6 w-6 text-primary" /> Consultations
            </h1>
            <p className="text-muted-foreground text-sm">{consultations.length} consultations</p>
          </div>
          <Button asChild>
            <Link to="/consultations/new">
              <Plus className="h-4 w-4 mr-2" /> Nouvelle consultation
            </Link>
          </Button>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead className="hidden md:table-cell">Motif</TableHead>
                    <TableHead className="hidden lg:table-cell">Frais</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>{c.date}</TableCell>
                      <TableCell className="font-medium">{c.patient_nom}</TableCell>
                      <TableCell className="hidden md:table-cell">{c.motif}</TableCell>
                      <TableCell className="hidden lg:table-cell">{c.frais.toLocaleString()} Ar</TableCell>
                      <TableCell>
                        <Badge variant={c.statut === "terminee" ? "default" : "secondary"}>
                          {c.statut === "terminee" ? "Terminée" : "En cours"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/consultations/${c.id}`}><Eye className="h-4 w-4" /></Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">Aucune consultation trouvée</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
