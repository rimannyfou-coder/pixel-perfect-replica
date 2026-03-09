import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Building2, Clock, CreditCard, Bell, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface CabinetSettings {
  nom: string;
  telephone: string;
  email: string;
  adresse: string;
  ville: string;
  code_postal: string;
  site_web: string;
  numero_fiscal: string;
  logo_url: string;
}

interface TarifDefaut {
  type: string;
  prix: number;
}

interface HorairesJour {
  jour: string;
  ouvert: boolean;
  debut: string;
  fin: string;
  pause_debut: string;
  pause_fin: string;
}

interface PreferencesSettings {
  devise: string;
  duree_rdv_defaut: number;
  rappel_sms: boolean;
  rappel_email: boolean;
  rappel_delai_heures: number;
  seuil_stock_alerte: number;
  format_numero_facture: string;
  mention_legale_facture: string;
}

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export default function Settings() {
  const { toast } = useToast();
  const { user } = useAuth();

  const [cabinet, setCabinet] = useState<CabinetSettings>({
    nom: user?.cabinet || "Cabinet Dentaire",
    telephone: "+261 34 00 000 00",
    email: "contact@cabinet-dentaire.mg",
    adresse: "Lot IVG 123, Analakely",
    ville: "Antananarivo",
    code_postal: "101",
    site_web: "",
    numero_fiscal: "NIF-2024-00001",
    logo_url: "",
  });

  const [tarifs, setTarifs] = useState<TarifDefaut[]>([
    { type: "Consultation simple", prix: 30000 },
    { type: "Détartrage", prix: 50000 },
    { type: "Extraction simple", prix: 40000 },
    { type: "Extraction complexe", prix: 80000 },
    { type: "Obturation (plombage)", prix: 60000 },
    { type: "Couronne céramique", prix: 350000 },
    { type: "Traitement de canal", prix: 150000 },
    { type: "Prothèse amovible", prix: 400000 },
    { type: "Implant dentaire", prix: 1200000 },
    { type: "Blanchiment", prix: 200000 },
    { type: "Orthodontie (par mois)", prix: 100000 },
    { type: "Radiographie panoramique", prix: 45000 },
  ]);

  const [horaires, setHoraires] = useState<HorairesJour[]>(
    JOURS.map((jour) => ({
      jour,
      ouvert: jour !== "Dimanche",
      debut: "08:00",
      fin: "17:00",
      pause_debut: "12:00",
      pause_fin: "13:00",
    }))
  );

  const [prefs, setPrefs] = useState<PreferencesSettings>({
    devise: "MGA",
    duree_rdv_defaut: 30,
    rappel_sms: true,
    rappel_email: true,
    rappel_delai_heures: 24,
    seuil_stock_alerte: 10,
    format_numero_facture: "FACT-{ANNEE}-{NUM}",
    mention_legale_facture: "Payable à réception. Tout retard de paiement entraînera des pénalités.",
  });

  const handleSave = (section: string) => {
    toast({ title: "Enregistré", description: `Les ${section} ont été mis à jour avec succès.` });
  };

  const updateTarif = (index: number, prix: number) => {
    setTarifs((prev) => prev.map((t, i) => (i === index ? { ...t, prix } : t)));
  };

  const updateHoraire = (index: number, field: keyof HorairesJour, value: string | boolean) => {
    setHoraires((prev) => prev.map((h, i) => (i === index ? { ...h, [field]: value } : h)));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Paramètres</h1>
          <p className="text-muted-foreground">Configurez votre cabinet et vos préférences</p>
        </div>

        <Tabs defaultValue="cabinet" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
            <TabsTrigger value="cabinet" className="gap-2"><Building2 className="h-4 w-4" />Cabinet</TabsTrigger>
            <TabsTrigger value="tarifs" className="gap-2"><CreditCard className="h-4 w-4" />Tarifs</TabsTrigger>
            <TabsTrigger value="horaires" className="gap-2"><Clock className="h-4 w-4" />Horaires</TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2"><Bell className="h-4 w-4" />Notifications</TabsTrigger>
            <TabsTrigger value="facturation" className="gap-2"><Shield className="h-4 w-4" />Facturation</TabsTrigger>
          </TabsList>

          {/* ─── CABINET ─── */}
          <TabsContent value="cabinet">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5 text-primary" />Informations du cabinet</CardTitle>
                <CardDescription>Coordonnées et informations légales de votre cabinet dentaire</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nom du cabinet</Label>
                    <Input value={cabinet.nom} onChange={(e) => setCabinet({ ...cabinet, nom: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Téléphone</Label>
                    <Input value={cabinet.telephone} onChange={(e) => setCabinet({ ...cabinet, telephone: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={cabinet.email} onChange={(e) => setCabinet({ ...cabinet, email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Site web</Label>
                    <Input value={cabinet.site_web} onChange={(e) => setCabinet({ ...cabinet, site_web: e.target.value })} placeholder="https://" />
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <Label>Adresse</Label>
                    <Input value={cabinet.adresse} onChange={(e) => setCabinet({ ...cabinet, adresse: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Ville</Label>
                    <Input value={cabinet.ville} onChange={(e) => setCabinet({ ...cabinet, ville: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Code postal</Label>
                    <Input value={cabinet.code_postal} onChange={(e) => setCabinet({ ...cabinet, code_postal: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Numéro d'identification fiscale</Label>
                    <Input value={cabinet.numero_fiscal} onChange={(e) => setCabinet({ ...cabinet, numero_fiscal: e.target.value })} />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => handleSave("informations du cabinet")}>Enregistrer</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── TARIFS ─── */}
          <TabsContent value="tarifs">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary" />Tarifs par défaut</CardTitle>
                <CardDescription>Définissez les prix par défaut des actes et traitements. Ces tarifs seront pré-remplis lors de la création des consultations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tarifs.map((tarif, i) => (
                    <div key={tarif.type} className="flex items-center gap-3 rounded-lg border bg-card p-3">
                      <span className="flex-1 text-sm font-medium">{tarif.type}</span>
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          className="w-28 text-right"
                          value={tarif.prix}
                          onChange={(e) => updateTarif(i, Number(e.target.value))}
                        />
                        <span className="text-xs text-muted-foreground">MGA</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end pt-2">
                  <Button onClick={() => handleSave("tarifs")}>Enregistrer les tarifs</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── HORAIRES ─── */}
          <TabsContent value="horaires">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-primary" />Horaires d'ouverture</CardTitle>
                <CardDescription>Configurez les heures de travail et pauses pour chaque jour de la semaine</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {horaires.map((h, i) => (
                  <div key={h.jour} className={`flex flex-col md:flex-row md:items-center gap-3 rounded-lg border p-3 ${!h.ouvert ? "opacity-50" : ""}`}>
                    <div className="flex items-center gap-3 min-w-[140px]">
                      <Switch checked={h.ouvert} onCheckedChange={(v) => updateHoraire(i, "ouvert", v)} />
                      <span className="font-medium text-sm">{h.jour}</span>
                    </div>
                    {h.ouvert && (
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <Input type="time" className="w-28" value={h.debut} onChange={(e) => updateHoraire(i, "debut", e.target.value)} />
                        <span className="text-muted-foreground">à</span>
                        <Input type="time" className="w-28" value={h.fin} onChange={(e) => updateHoraire(i, "fin", e.target.value)} />
                        <span className="text-muted-foreground ml-2">Pause:</span>
                        <Input type="time" className="w-28" value={h.pause_debut} onChange={(e) => updateHoraire(i, "pause_debut", e.target.value)} />
                        <span className="text-muted-foreground">-</span>
                        <Input type="time" className="w-28" value={h.pause_fin} onChange={(e) => updateHoraire(i, "pause_fin", e.target.value)} />
                      </div>
                    )}
                  </div>
                ))}
                <div className="flex justify-end pt-2">
                  <Button onClick={() => handleSave("horaires")}>Enregistrer les horaires</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── NOTIFICATIONS ─── */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary" />Notifications & Rappels</CardTitle>
                <CardDescription>Configurez les rappels automatiques pour les rendez-vous et les alertes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium text-sm">Rappel SMS</p>
                      <p className="text-xs text-muted-foreground">Envoyer un SMS de rappel avant chaque rendez-vous</p>
                    </div>
                    <Switch checked={prefs.rappel_sms} onCheckedChange={(v) => setPrefs({ ...prefs, rappel_sms: v })} />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium text-sm">Rappel Email</p>
                      <p className="text-xs text-muted-foreground">Envoyer un email de rappel avant chaque rendez-vous</p>
                    </div>
                    <Switch checked={prefs.rappel_email} onCheckedChange={(v) => setPrefs({ ...prefs, rappel_email: v })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Délai de rappel (heures avant le RDV)</Label>
                    <Select value={String(prefs.rappel_delai_heures)} onValueChange={(v) => setPrefs({ ...prefs, rappel_delai_heures: Number(v) })}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 heures</SelectItem>
                        <SelectItem value="6">6 heures</SelectItem>
                        <SelectItem value="12">12 heures</SelectItem>
                        <SelectItem value="24">24 heures</SelectItem>
                        <SelectItem value="48">48 heures</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Seuil d'alerte stock faible</Label>
                    <p className="text-xs text-muted-foreground">Recevoir une alerte quand un article passe sous ce seuil</p>
                    <Input type="number" className="w-32" value={prefs.seuil_stock_alerte} onChange={(e) => setPrefs({ ...prefs, seuil_stock_alerte: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => handleSave("notifications")}>Enregistrer</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── FACTURATION ─── */}
          <TabsContent value="facturation">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" />Paramètres de facturation</CardTitle>
                <CardDescription>Format des factures, devise et mentions légales</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Devise</Label>
                    <Select value={prefs.devise} onValueChange={(v) => setPrefs({ ...prefs, devise: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MGA">Ariary (MGA)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        <SelectItem value="USD">Dollar (USD)</SelectItem>
                        <SelectItem value="XOF">Franc CFA (XOF)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Durée RDV par défaut (min)</Label>
                    <Select value={String(prefs.duree_rdv_defaut)} onValueChange={(v) => setPrefs({ ...prefs, duree_rdv_defaut: Number(v) })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 min</SelectItem>
                        <SelectItem value="30">30 min</SelectItem>
                        <SelectItem value="45">45 min</SelectItem>
                        <SelectItem value="60">1 heure</SelectItem>
                        <SelectItem value="90">1h30</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Format numéro de facture</Label>
                  <Input value={prefs.format_numero_facture} onChange={(e) => setPrefs({ ...prefs, format_numero_facture: e.target.value })} />
                  <p className="text-xs text-muted-foreground">Variables : {"{ANNEE}"}, {"{MOIS}"}, {"{NUM}"}</p>
                </div>

                <div className="space-y-2">
                  <Label>Mentions légales sur les factures</Label>
                  <Textarea rows={3} value={prefs.mention_legale_facture} onChange={(e) => setPrefs({ ...prefs, mention_legale_facture: e.target.value })} />
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => handleSave("paramètres de facturation")}>Enregistrer</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
