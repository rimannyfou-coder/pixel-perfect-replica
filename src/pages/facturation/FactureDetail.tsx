import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MOCK_FACTURES, Paiement } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Receipt, Plus, CreditCard } from "lucide-react";

const statutVariant = (s: string) => {
  if (s === "PAYEE") return "default" as const;
  if (s === "PARTIELLE") return "secondary" as const;
  return "destructive" as const;
};

export default function FactureDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const facture = MOCK_FACTURES.find((f) => f.id === Number(id));
  const [paiements, setPaiements] = useState<Paiement[]>(facture?.paiements || []);
  const [montant, setMontant] = useState("");
  const [methode, setMethode] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!facture) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Facture introuvable</p>
          <Button className="mt-4" onClick={() => navigate("/facturation")}>Retour</Button>
        </div>
      </DashboardLayout>
    );
  }

  const totalPaye = paiements.reduce((s, p) => s + p.montant, 0);
  const reste = facture.montant - totalPaye;

  const handlePaiement = () => {
    const m = parseInt(montant);
    if (!m || m <= 0 || !methode) {
      toast({ title: "Veuillez remplir tous les champs", variant: "destructive" });
      return;
    }
    if (m > reste) {
      toast({ title: "Le montant dépasse le reste à payer", variant: "destructive" });
      return;
    }
    setPaiements((prev) => [
      ...prev,
      { id: prev.length + 100, montant: m, methode: methode as Paiement["methode"], date: new Date().toISOString().slice(0, 10) },
    ]);
    setMontant("");
    setMethode("");
    setDialogOpen(false);
    toast({ title: "Paiement enregistré" });
  };

  const currentStatut = reste <= 0 ? "PAYEE" : totalPaye > 0 ? "PARTIELLE" : "IMPAYEE";

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-display text-2xl font-bold flex items-center gap-2">
              <Receipt className="h-6 w-6 text-primary" /> {facture.numero}
            </h1>
            <p className="text-muted-foreground text-sm">{facture.patient_nom} · {facture.date}</p>
          </div>
          <Badge className="ml-auto" variant={statutVariant(currentStatut)}>{currentStatut}</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Montant total</p>
              <p className="text-2xl font-bold font-display">{facture.montant.toLocaleString()} Ar</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Payé</p>
              <p className="text-2xl font-bold font-display text-secondary">{totalPaye.toLocaleString()} Ar</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Reste</p>
              <p className="text-2xl font-bold font-display text-destructive">{reste.toLocaleString()} Ar</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2"><CreditCard className="h-4 w-4" /> Paiements</CardTitle>
            {reste > 0 && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Ajouter paiement</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Nouveau paiement</DialogTitle></DialogHeader>
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label>Montant (Ar) — Reste : {reste.toLocaleString()} Ar</Label>
                      <Input type="number" value={montant} onChange={(e) => setMontant(e.target.value)} placeholder="Montant" />
                    </div>
                    <div className="space-y-2">
                      <Label>Méthode</Label>
                      <Select value={methode} onValueChange={setMethode}>
                        <SelectTrigger><SelectValue placeholder="Méthode de paiement" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ESPECES">Espèces</SelectItem>
                          <SelectItem value="CARTE">Carte</SelectItem>
                          <SelectItem value="MOBILE_MONEY">Mobile Money</SelectItem>
                          <SelectItem value="VIREMENT">Virement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handlePaiement} className="w-full">Enregistrer le paiement</Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Méthode</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paiements.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.date}</TableCell>
                      <TableCell>{p.montant.toLocaleString()} Ar</TableCell>
                      <TableCell>{p.methode.replace("_", " ")}</TableCell>
                    </TableRow>
                  ))}
                  {paiements.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-6">Aucun paiement</TableCell>
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
