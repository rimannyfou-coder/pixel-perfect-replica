import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MOCK_MOUVEMENTS, MOCK_ARTICLES, MouvementStock } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowDownUp, Plus } from "lucide-react";

export default function MouvementStockPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mouvements, setMouvements] = useState<MouvementStock[]>(MOCK_MOUVEMENTS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ article_id: "", type: "", quantite: "", motif: "" });

  const handleAdd = () => {
    const article = MOCK_ARTICLES.find((a) => a.id === Number(form.article_id));
    if (!article || !form.type || !form.quantite) {
      toast({ title: "Remplissez tous les champs", variant: "destructive" });
      return;
    }
    setMouvements((prev) => [
      ...prev,
      {
        id: prev.length + 100,
        article_id: article.id,
        article_nom: article.nom,
        type: form.type as "ENTREE" | "SORTIE",
        quantite: parseInt(form.quantite),
        date: new Date().toISOString().slice(0, 10),
        motif: form.motif,
      },
    ]);
    setForm({ article_id: "", type: "", quantite: "", motif: "" });
    setDialogOpen(false);
    toast({ title: "Mouvement enregistré" });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/inventaire")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="font-display text-2xl font-bold flex items-center gap-2">
                <ArrowDownUp className="h-6 w-6 text-primary" /> Mouvements de stock
              </h1>
              <p className="text-muted-foreground text-sm">{mouvements.length} mouvements</p>
            </div>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" /> Nouveau mouvement</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nouveau mouvement</DialogTitle></DialogHeader>
              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <Label>Article</Label>
                  <Select value={form.article_id} onValueChange={(v) => setForm({ ...form, article_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>
                      {MOCK_ARTICLES.map((a) => <SelectItem key={a.id} value={String(a.id)}>{a.nom}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ENTREE">Entrée</SelectItem>
                      <SelectItem value="SORTIE">Sortie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Quantité</Label>
                  <Input type="number" value={form.quantite} onChange={(e) => setForm({ ...form, quantite: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>Motif</Label>
                  <Input value={form.motif} onChange={(e) => setForm({ ...form, motif: e.target.value })} placeholder="Raison du mouvement" />
                </div>
                <Button onClick={handleAdd} className="w-full">Enregistrer</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Article</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead className="hidden md:table-cell">Motif</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mouvements.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>{m.date}</TableCell>
                      <TableCell className="font-medium">{m.article_nom}</TableCell>
                      <TableCell>
                        <Badge variant={m.type === "ENTREE" ? "default" : "secondary"}>
                          {m.type === "ENTREE" ? "↑ Entrée" : "↓ Sortie"}
                        </Badge>
                      </TableCell>
                      <TableCell>{m.quantite}</TableCell>
                      <TableCell className="hidden md:table-cell">{m.motif}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
