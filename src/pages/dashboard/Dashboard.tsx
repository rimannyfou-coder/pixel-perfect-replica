import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Stethoscope, Receipt, Package, TrendingUp, Calendar, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { MOCK_RENDEZVOUS, MOCK_FACTURES, MOCK_ARTICLES } from "@/data/mockData";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const stats = [
  { title: "Patients", value: "127", icon: Users, change: "+12 ce mois", color: "text-primary" },
  { title: "Consultations aujourd'hui", value: "8", icon: Stethoscope, change: "3 en attente", color: "text-secondary" },
  { title: "Factures impayées", value: String(MOCK_FACTURES.filter(f => f.statut !== "PAYEE").length), icon: Receipt, change: `${MOCK_FACTURES.filter(f => f.statut !== "PAYEE").reduce((s, f) => s + (f.montant - f.montant_paye), 0).toLocaleString()} Ar`, color: "text-destructive" },
  { title: "Stock faible", value: String(MOCK_ARTICLES.filter(a => a.quantite <= a.seuil_alerte).length), icon: Package, change: "articles en alerte", color: "text-warning" },
];

const revenusData = [
  { mois: "Jan", montant: 1200000 },
  { mois: "Fév", montant: 980000 },
  { mois: "Mar", montant: 1450000 },
  { mois: "Avr", montant: 1100000 },
  { mois: "Mai", montant: 1600000 },
  { mois: "Jun", montant: 1380000 },
];

const consultationsData = [
  { mois: "Jan", count: 45 },
  { mois: "Fév", count: 38 },
  { mois: "Mar", count: 52 },
  { mois: "Avr", count: 41 },
  { mois: "Mai", count: 58 },
  { mois: "Jun", count: 49 },
];

const todayRDVs = MOCK_RENDEZVOUS.filter(r => r.statut === "confirme" || r.statut === "en_attente")
  .sort((a, b) => a.heure.localeCompare(b.heure))
  .slice(0, 5);

const statutLabel: Record<string, string> = {
  confirme: "Confirmé",
  en_attente: "En attente",
};
const statutVariant = (s: string) => s === "confirme" ? "default" as const : "secondary" as const;

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold">
            Bonjour, {user?.email?.split("@")[0] || "Docteur"} 👋
          </h1>
          <p className="text-muted-foreground text-sm">Vue d'ensemble de votre cabinet — {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="animate-fade-in">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold font-display mt-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Today's RDVs + Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Today's appointments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Prochains rendez-vous
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/rendezvous">Voir tout</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {todayRDVs.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">Aucun rendez-vous à venir</p>
              ) : (
                todayRDVs.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 p-2.5 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-1.5 min-w-[60px]">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-mono text-xs font-medium">{r.heure}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{r.patient_nom}</p>
                      <p className="text-xs text-muted-foreground truncate">{r.motif}</p>
                    </div>
                    <Badge variant={statutVariant(r.statut)} className="text-xs shrink-0">
                      {statutLabel[r.statut]}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Revenue chart */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Revenus mensuels (Ar)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={revenusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mois" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(value: number) => `${value.toLocaleString()} Ar`} />
                  <Bar dataKey="montant" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Consultations chart */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-base flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-secondary" />
                Consultations / mois
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={consultationsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mois" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="hsl(var(--secondary))" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
