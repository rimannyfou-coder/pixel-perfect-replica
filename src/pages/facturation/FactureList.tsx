import { useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOCK_FACTURES } from "@/data/mockData";
import { Search, Eye, Receipt } from "lucide-react";

const statutVariant = (s: string) => {
  if (s === "PAYEE") return "default" as const;
  if (s === "PARTIELLE") return "secondary" as const;
  return "destructive" as const;
};

export default function FactureList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [factures] = useState(MOCK_FACTURES);

  const filtered = factures.filter((f) => {
    const matchSearch = f.patient_nom.toLowerCase().includes(search.toLowerCase()) || f.numero.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || f.statut === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalImpaye = factures.filter((f) => f.statut !== "PAYEE").reduce((s, f) => s + (f.montant - f.montant_paye), 0);
  const totalRevenu = factures.reduce((s, f) => s + f.montant_paye, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold flex items-center gap-2">
              <Receipt className="h-6 w-6 text-primary" /> Facturation
            </h1>
            <p className="text-muted-foreground text-sm">
              {factures.length} factures · Encaissé : {totalRevenu.toLocaleString()} Ar · Impayé : <span className="text-destructive font-medium">{totalImpaye.toLocaleString()} Ar</span>
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Rechercher..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tous les statuts</SelectItem>
                  <SelectItem value="PAYEE">Payée</SelectItem>
                  <SelectItem value="PARTIELLE">Partielle</SelectItem>
                  <SelectItem value="IMPAYEE">Impayée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Numéro</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead className="hidden lg:table-cell">Payé</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell className="font-mono text-sm">{f.numero}</TableCell>
                      <TableCell className="font-medium">{f.patient_nom}</TableCell>
                      <TableCell className="hidden md:table-cell">{f.date}</TableCell>
                      <TableCell>{f.montant.toLocaleString()} Ar</TableCell>
                      <TableCell className="hidden lg:table-cell">{f.montant_paye.toLocaleString()} Ar</TableCell>
                      <TableCell>
                        <Badge variant={statutVariant(f.statut)}>{f.statut}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/facturation/${f.id}`}><Eye className="h-4 w-4" /></Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">Aucune facture trouvée</TableCell>
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
