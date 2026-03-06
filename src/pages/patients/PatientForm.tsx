import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOCK_PATIENTS } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";

export default function PatientForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const existing = isEdit ? MOCK_PATIENTS.find((p) => p.id === Number(id)) : null;
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({
    prenom: existing?.prenom || "",
    nom: existing?.nom || "",
    date_naissance: existing?.date_naissance || "",
    sexe: existing?.sexe || "M",
    telephone: existing?.telephone || "",
    email: existing?.email || "",
    adresse: existing?.adresse || "",
    groupe_sanguin: existing?.groupe_sanguin || "",
    allergies: existing?.allergies || "",
  });

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: isEdit ? "Patient modifié" : "Patient créé", description: `${form.prenom} ${form.nom}` });
    navigate("/patients");
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-display text-2xl font-bold">
              {isEdit ? "Modifier le patient" : "Nouveau patient"}
            </h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-display">Informations du patient</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prénom</Label>
                  <Input value={form.prenom} onChange={update("prenom")} required />
                </div>
                <div className="space-y-2">
                  <Label>Nom</Label>
                  <Input value={form.nom} onChange={update("nom")} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date de naissance</Label>
                  <Input type="date" value={form.date_naissance} onChange={update("date_naissance")} required />
                </div>
                <div className="space-y-2">
                  <Label>Sexe</Label>
                  <Select value={form.sexe} onValueChange={(v) => setForm((f) => ({ ...f, sexe: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculin</SelectItem>
                      <SelectItem value="F">Féminin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input value={form.telephone} onChange={update("telephone")} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={form.email} onChange={update("email")} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Groupe sanguin</Label>
                  <Input value={form.groupe_sanguin} onChange={update("groupe_sanguin")} />
                </div>
                <div className="space-y-2">
                  <Label>Allergies</Label>
                  <Input value={form.allergies} onChange={update("allergies")} placeholder="Aucune" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Adresse</Label>
                <Textarea value={form.adresse} onChange={update("adresse")} />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>Annuler</Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {isEdit ? "Enregistrer" : "Créer"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
