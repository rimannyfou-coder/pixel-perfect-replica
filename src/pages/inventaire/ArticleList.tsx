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
import { MOCK_ARTICLES, CATEGORIES_ARTICLES, Article } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Package, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

export default function ArticleList() {
  const [search, setSearch] = useState("");
  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newArticle, setNewArticle] = useState({ nom: "", categorie: "", quantite: "", seuil_alerte: "", prix: "", unite: "" });
  const { toast } = useToast();

  const filtered = articles.filter(
    (a) => a.nom.toLowerCase().includes(search.toLowerCase()) || a.categorie.toLowerCase().includes(search.toLowerCase())
  );

  const alertCount = articles.filter((a) => a.quantite <= a.seuil_alerte).length;

  const handleAdd = () => {
    if (!newArticle.nom || !newArticle.categorie) {
      toast({ title: "Remplissez les champs obligatoires", variant: "destructive" });
      return;
    }
    setArticles((prev) => [
      ...prev,
      {
        id: prev.length + 100,
        nom: newArticle.nom,
        categorie: newArticle.categorie,
        quantite: parseInt(newArticle.quantite) || 0,
        seuil_alerte: parseInt(newArticle.seuil_alerte) || 5,
        prix: parseInt(newArticle.prix) || 0,
        unite: newArticle.unite || "unité",
      },
    ]);
    setNewArticle({ nom: "", categorie: "", quantite: "", seuil_alerte: "", prix: "", unite: "" });
    setDialogOpen(false);
    toast({ title: "Article ajouté" });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" /> Inventaire
            </h1>
            <p className="text-muted-foreground text-sm">
              {articles.length} articles
              {alertCount > 0 && (
                <span className="text-destructive ml-2">
                  · {alertCount} en alerte stock
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/inventaire/mouvements">Mouvements</Link>
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" /> Nouvel article</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Nouvel article</DialogTitle></DialogHeader>
                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <Label>Nom *</Label>
                    <Input value={newArticle.nom} onChange={(e) => setNewArticle({ ...newArticle, nom: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label>Catégorie *</Label>
                    <Select value={newArticle.categorie} onValueChange={(v) => setNewArticle({ ...newArticle, categorie: v })}>
                      <SelectTrigger><SelectValue placeholder="Catégorie" /></SelectTrigger>
                      <SelectContent>
                        {CATEGORIES_ARTICLES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label>Quantité</Label>
                      <Input type="number" value={newArticle.quantite} onChange={(e) => setNewArticle({ ...newArticle, quantite: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <Label>Seuil alerte</Label>
                      <Input type="number" value={newArticle.seuil_alerte} onChange={(e) => setNewArticle({ ...newArticle, seuil_alerte: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label>Prix (Ar)</Label>
                      <Input type="number" value={newArticle.prix} onChange={(e) => setNewArticle({ ...newArticle, prix: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <Label>Unité</Label>
                      <Input value={newArticle.unite} onChange={(e) => setNewArticle({ ...newArticle, unite: e.target.value })} placeholder="Ex: boîte" />
                    </div>
                  </div>
                  <Button onClick={handleAdd} className="w-full">Ajouter</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher un article..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Article</TableHead>
                    <TableHead className="hidden md:table-cell">Catégorie</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead className="hidden lg:table-cell">Prix</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((a) => {
                    const isAlert = a.quantite <= a.seuil_alerte;
                    return (
                      <TableRow key={a.id}>
                        <TableCell className="font-medium">{a.nom}</TableCell>
                        <TableCell className="hidden md:table-cell">{a.categorie}</TableCell>
                        <TableCell>
                          {a.quantite} {a.unite}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{a.prix.toLocaleString()} Ar</TableCell>
                        <TableCell>
                          {isAlert ? (
                            <Badge variant="destructive" className="gap-1">
                              <AlertTriangle className="h-3 w-3" /> Stock faible
                            </Badge>
                          ) : (
                            <Badge variant="default">En stock</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">Aucun article trouvé</TableCell>
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
