import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MOCK_RENDEZVOUS, MOCK_PATIENTS, RendezVous } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Calendar, Clock, List, MoreHorizontal, CheckCircle, XCircle, Ban } from "lucide-react";

const statutLabel: Record<string, string> = {
  confirme: "Confirmé",
  en_attente: "En attente",
  annule: "Annulé",
  termine: "Terminé",
};

const statutVariant = (s: string) => {
  if (s === "confirme") return "default" as const;
  if (s === "en_attente") return "secondary" as const;
  if (s === "annule") return "destructive" as const;
  return "outline" as const;
};

export default function RendezVousList() {
  const [search, setSearch] = useState("");
  const [rdvs, setRdvs] = useState<RendezVous[]>(MOCK_RENDEZVOUS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ patient_id: "", date: "", heure: "", motif: "", duree: "30" });
  const { toast } = useToast();

  const filtered = rdvs.filter(
    (r) => r.patient_nom.toLowerCase().includes(search.toLowerCase()) || r.motif.toLowerCase().includes(search.toLowerCase())
  );

  const upcoming = filtered.filter((r) => r.statut === "confirme" || r.statut === "en_attente").sort((a, b) => a.date.localeCompare(b.date) || a.heure.localeCompare(b.heure));
  const past = filtered.filter((r) => r.statut === "termine" || r.statut === "annule");

  const groupedByDate = upcoming.reduce<Record<string, RendezVous[]>>((acc, r) => {
    if (!acc[r.date]) acc[r.date] = [];
    acc[r.date].push(r);
    return acc;
  }, {});

  const handleAdd = () => {
    const patient = MOCK_PATIENTS.find((p) => p.id === Number(form.patient_id));
    if (!patient || !form.date || !form.heure) {
      toast({ title: "Remplissez les champs obligatoires", variant: "destructive" });
      return;
    }
    setRdvs((prev) => [
      ...prev,
      {
        id: prev.length + 100,
        patient_id: patient.id,
        patient_nom: `${patient.nom} ${patient.prenom}`,
        date: form.date,
        heure: form.heure,
        motif: form.motif,
        statut: "en_attente",
        duree: parseInt(form.duree) || 30,
      },
    ]);
    setForm({ patient_id: "", date: "", heure: "", motif: "", duree: "30" });
    setDialogOpen(false);
    toast({ title: "Rendez-vous créé" });
  };

  const changeStatut = (id: number, statut: RendezVous["statut"]) => {
    setRdvs((prev) => prev.map((r) => r.id === id ? { ...r, statut } : r));
    toast({ title: `Rendez-vous ${statutLabel[statut].toLowerCase()}` });
  };

  const RDVActions = ({ rdv }: { rdv: RendezVous }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {rdv.statut === "en_attente" && (
          <DropdownMenuItem onClick={() => changeStatut(rdv.id, "confirme")}>
            <CheckCircle className="h-4 w-4 mr-2 text-primary" /> Confirmer
          </DropdownMenuItem>
        )}
        {(rdv.statut === "confirme" || rdv.statut === "en_attente") && (
          <>
            <DropdownMenuItem onClick={() => changeStatut(rdv.id, "termine")}>
              <CheckCircle className="h-4 w-4 mr-2 text-secondary" /> Marquer terminé
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeStatut(rdv.id, "annule")} className="text-destructive">
              <XCircle className="h-4 w-4 mr-2" /> Annuler
            </DropdownMenuItem>
          </>
        )}
        {rdv.statut === "annule" && (
          <DropdownMenuItem onClick={() => changeStatut(rdv.id, "en_attente")}>
            <Ban className="h-4 w-4 mr-2" /> Remettre en attente
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" /> Rendez-vous
            </h1>
            <p className="text-muted-foreground text-sm">{upcoming.length} à venir · {past.length} passés</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" /> Nouveau RDV</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nouveau rendez-vous</DialogTitle></DialogHeader>
              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <Label>Patient *</Label>
                  <Select value={form.patient_id} onValueChange={(v) => setForm({ ...form, patient_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>
                      {MOCK_PATIENTS.map((p) => <SelectItem key={p.id} value={String(p.id)}>{p.nom} {p.prenom}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Date *</Label>
                    <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label>Heure *</Label>
                    <Input type="time" value={form.heure} onChange={(e) => setForm({ ...form, heure: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Motif</Label>
                    <Input value={form.motif} onChange={(e) => setForm({ ...form, motif: e.target.value })} placeholder="Motif" />
                  </div>
                  <div className="space-y-1">
                    <Label>Durée (min)</Label>
                    <Input type="number" value={form.duree} onChange={(e) => setForm({ ...form, duree: e.target.value })} />
                  </div>
                </div>
                <Button onClick={handleAdd} className="w-full">Créer le rendez-vous</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            <Tabs defaultValue="agenda">
              <TabsList className="mb-4">
                <TabsTrigger value="agenda"><Calendar className="h-4 w-4 mr-1" /> Agenda</TabsTrigger>
                <TabsTrigger value="liste"><List className="h-4 w-4 mr-1" /> Liste</TabsTrigger>
              </TabsList>

              <TabsContent value="agenda" className="space-y-4">
                {Object.entries(groupedByDate).length === 0 && (
                  <p className="text-muted-foreground text-center py-8">Aucun rendez-vous à venir</p>
                )}
                {Object.entries(groupedByDate).map(([date, rdvList]) => (
                  <div key={date}>
                    <h3 className="font-display font-semibold text-sm mb-2 text-muted-foreground">{date}</h3>
                    <div className="space-y-2">
                      {rdvList.sort((a, b) => a.heure.localeCompare(b.heure)).map((r) => (
                        <div key={r.id} className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                          <div className="flex items-center gap-2 min-w-[80px]">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono text-sm font-medium">{r.heure}</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{r.patient_nom}</p>
                            <p className="text-sm text-muted-foreground">{r.motif} · {r.duree} min</p>
                          </div>
                          <Badge variant={statutVariant(r.statut)}>{statutLabel[r.statut]}</Badge>
                          <RDVActions rdv={r} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="liste">
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Heure</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead className="hidden md:table-cell">Motif</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...upcoming, ...past].map((r) => (
                        <TableRow key={r.id}>
                          <TableCell>{r.date}</TableCell>
                          <TableCell className="font-mono">{r.heure}</TableCell>
                          <TableCell className="font-medium">{r.patient_nom}</TableCell>
                          <TableCell className="hidden md:table-cell">{r.motif}</TableCell>
                          <TableCell><Badge variant={statutVariant(r.statut)}>{statutLabel[r.statut]}</Badge></TableCell>
                          <TableCell className="text-right"><RDVActions rdv={r} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
