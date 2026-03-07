import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MOCK_PATIENTS, TYPES_TRAITEMENT, Traitement } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2, Stethoscope } from "lucide-react";

export default function ConsultationForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [patientId, setPatientId] = useState("");
  const [motif, setMotif] = useState("");
  const [diagnostic, setDiagnostic] = useState("");
  const [traitements, setTraitements] = useState<Omit<Traitement, "id">[]>([]);
  const [newDent, setNewDent] = useState("");
  const [newType, setNewType] = useState("");
  const [newCout, setNewCout] = useState("");

  const addTraitement = () => {
    if (!newType || !newCout) return;
    setTraitements((prev) => [
      ...prev,
      { dent: parseInt(newDent) || 0, type: newType, cout: parseInt(newCout), statut: "planifie" },
    ]);
    setNewDent("");
    setNewType("");
    setNewCout("");
  };

  const removeTraitement = (index: number) => {
    setTraitements((prev) => prev.filter((_, i) => i !== index));
  };

  const totalFrais = traitements.reduce((sum, t) => sum + t.cout, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !motif) {
      toast({ title: "Veuillez remplir les champs obligatoires", variant: "destructive" });
      return;
    }
    toast({ title: "Consultation créée avec succès" });
    navigate("/consultations");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-display text-2xl font-bold flex items-center gap-2">
              <Stethoscope className="h-6 w-6 text-primary" /> Nouvelle consultation
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Informations</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Patient *</Label>
                <Select value={patientId} onValueChange={setPatientId}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner un patient" /></SelectTrigger>
                  <SelectContent>
                    {MOCK_PATIENTS.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>{p.nom} {p.prenom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Motif *</Label>
                <Input value={motif} onChange={(e) => setMotif(e.target.value)} placeholder="Motif de consultation" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Diagnostic</Label>
                <Textarea value={diagnostic} onChange={(e) => setDiagnostic(e.target.value)} placeholder="Diagnostic..." />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Panier de traitements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-end">
                <div className="space-y-1">
                  <Label className="text-xs">Dent (n°)</Label>
                  <Input value={newDent} onChange={(e) => setNewDent(e.target.value)} placeholder="Ex: 16" type="number" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Traitement</Label>
                  <Select value={newType} onValueChange={setNewType}>
                    <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                    <SelectContent>
                      {TYPES_TRAITEMENT.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Coût (Ar)</Label>
                  <Input value={newCout} onChange={(e) => setNewCout(e.target.value)} placeholder="Montant" type="number" />
                </div>
                <Button type="button" onClick={addTraitement} size="sm">
                  <Plus className="h-4 w-4 mr-1" /> Ajouter
                </Button>
              </div>

              {traitements.length > 0 && (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Dent</TableHead>
                        <TableHead>Traitement</TableHead>
                        <TableHead>Coût</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {traitements.map((t, i) => (
                        <TableRow key={i}>
                          <TableCell>{t.dent || "—"}</TableCell>
                          <TableCell>{t.type}</TableCell>
                          <TableCell>{t.cout.toLocaleString()} Ar</TableCell>
                          <TableCell><Badge variant="secondary">Planifié</Badge></TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => removeTraitement(i)} className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={2} className="font-semibold">Total</TableCell>
                        <TableCell colSpan={3} className="font-semibold">{totalFrais.toLocaleString()} Ar</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="submit">Enregistrer</Button>
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>Annuler</Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
