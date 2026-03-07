import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_CONSULTATIONS, MOCK_FACTURES, MOCK_PATIENTS, MOCK_ARTICLES } from "@/data/mockData";
import { BarChart3, Users, Stethoscope, Receipt, Package, TrendingUp } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--info))",
  "hsl(var(--warning))",
  "hsl(var(--destructive))",
  "hsl(var(--success))",
];

export default function Rapports() {
  // Revenue data
  const revenueByMonth = [
    { mois: "Jan", revenus: 1200000, depenses: 400000 },
    { mois: "Fév", revenus: 980000, depenses: 350000 },
    { mois: "Mar", revenus: 1450000, depenses: 500000 },
    { mois: "Avr", revenus: 1100000, depenses: 380000 },
    { mois: "Mai", revenus: 1600000, depenses: 450000 },
    { mois: "Jun", revenus: 1380000, depenses: 420000 },
  ];

  // Facture status distribution
  const factureStats = [
    { name: "Payée", value: MOCK_FACTURES.filter((f) => f.statut === "PAYEE").length },
    { name: "Partielle", value: MOCK_FACTURES.filter((f) => f.statut === "PARTIELLE").length },
    { name: "Impayée", value: MOCK_FACTURES.filter((f) => f.statut === "IMPAYEE").length },
  ];

  // Treatment type distribution
  const traitementTypes: Record<string, number> = {};
  MOCK_CONSULTATIONS.forEach((c) =>
    c.traitements.forEach((t) => {
      traitementTypes[t.type] = (traitementTypes[t.type] || 0) + 1;
    })
  );
  const traitementData = Object.entries(traitementTypes).map(([name, value]) => ({ name, value }));

  // Stock alerts
  const stockAlerts = MOCK_ARTICLES.filter((a) => a.quantite <= a.seuil_alerte);

  // KPIs
  const totalRevenu = MOCK_FACTURES.reduce((s, f) => s + f.montant, 0);
  const totalPaye = MOCK_FACTURES.reduce((s, f) => s + f.montant_paye, 0);
  const totalConsultations = MOCK_CONSULTATIONS.length;
  const avgConsultation = totalConsultations > 0 ? Math.round(totalRevenu / totalConsultations) : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" /> Rapports & Statistiques
          </h1>
          <p className="text-muted-foreground text-sm">Analyses et performances du cabinet</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Patients total</p>
                  <p className="text-3xl font-bold font-display">{MOCK_PATIENTS.length}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Consultations</p>
                  <p className="text-3xl font-bold font-display">{totalConsultations}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Stethoscope className="h-5 w-5 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenus totaux</p>
                  <p className="text-3xl font-bold font-display">{(totalRevenu / 1000).toFixed(0)}k Ar</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Moy. / consultation</p>
                  <p className="text-3xl font-bold font-display">{avgConsultation.toLocaleString()} Ar</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Receipt className="h-5 w-5 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="financier">
          <TabsList>
            <TabsTrigger value="financier">Financier</TabsTrigger>
            <TabsTrigger value="activite">Activité</TabsTrigger>
            <TabsTrigger value="stock">Stock</TabsTrigger>
          </TabsList>

          <TabsContent value="financier" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Revenus vs Dépenses mensuels</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={revenueByMonth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="mois" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip formatter={(value: number) => `${value.toLocaleString()} Ar`} />
                      <Legend />
                      <Bar dataKey="revenus" fill="hsl(var(--primary))" name="Revenus" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="depenses" fill="hsl(var(--secondary))" name="Dépenses" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Statut des factures</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={factureStats} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                        {factureStats.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activite" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Types de traitements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={traitementData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" fontSize={12} />
                      <YAxis type="category" dataKey="name" fontSize={12} width={120} />
                      <Tooltip />
                      <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Consultations par mois</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={[
                      { mois: "Jan", count: 45 },
                      { mois: "Fév", count: 38 },
                      { mois: "Mar", count: 52 },
                      { mois: "Avr", count: 41 },
                      { mois: "Mai", count: 58 },
                      { mois: "Jun", count: 49 },
                    ]}>
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
          </TabsContent>

          <TabsContent value="stock" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="h-4 w-4" /> Articles en alerte stock
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stockAlerts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-6">Aucune alerte de stock</p>
                ) : (
                  <div className="space-y-3">
                    {stockAlerts.map((a) => (
                      <div key={a.id} className="flex items-center justify-between p-3 rounded-lg border border-destructive/30 bg-destructive/5">
                        <div>
                          <p className="font-medium">{a.nom}</p>
                          <p className="text-sm text-muted-foreground">{a.categorie}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-destructive">{a.quantite} {a.unite}</p>
                          <p className="text-xs text-muted-foreground">seuil : {a.seuil_alerte}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
