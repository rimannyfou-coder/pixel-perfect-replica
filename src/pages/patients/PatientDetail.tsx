import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Odontogram } from "@/components/odontogram/Odontogram";
import { MOCK_PATIENTS, MOCK_TEETH_PATIENT_1, MOCK_CONSULTATIONS, MOCK_FACTURES, generateDefaultTeeth, type ToothStatus } from "@/data/mockData";
import { ArrowLeft, Pencil, Phone, Mail, MapPin, Calendar, Droplets, AlertTriangle, Eye, Stethoscope, Receipt } from "lucide-react";

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const patient = MOCK_PATIENTS.find((p) => p.id === Number(id));

  const [teeth, setTeeth] = useState<ToothStatus[]>(
    Number(id) === 1 ? MOCK_TEETH_PATIENT_1 : generateDefaultTeeth()
  );

  if (!patient) {
    return (
      <DashboardLayout>
        <div className="text-center py-20 text-muted-foreground">Patient introuvable</div>
      </DashboardLayout>
    );
  }

  const patientConsultations = MOCK_CONSULTATIONS.filter((c) => c.patient_id === patient.id);
  const patientFactures = MOCK_FACTURES.filter((f) => f.patient_id === patient.id);

  const age = new Date().getFullYear() - new Date(patient.date_naissance).getFullYear();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="font-display text-2xl font-bold">
                {patient.prenom} {patient.nom}
              </h1>
              <p className="text-sm text-muted-foreground">
                {patient.sexe === "M" ? "Homme" : "Femme"} · {age} ans · Fiche #{patient.id}
              </p>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link to={`/patients/${patient.id}/edit`}>
              <Pencil className="h-4 w-4 mr-2" /> Modifier
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="info">
          <TabsList>
            <TabsTrigger value="info">Informations</TabsTrigger>
            <TabsTrigger value="odontogramme">Odontogramme</TabsTrigger>
            <TabsTrigger value="historique">
              Historique
              {patientConsultations.length > 0 && (
                <Badge variant="secondary" className="ml-1.5 text-xs px-1.5 py-0">
                  {patientConsultations.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="factures">
              Factures
              {patientFactures.length > 0 && (
                <Badge variant="secondary" className="ml-1.5 text-xs px-1.5 py-0">
                  {patientFactures.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-base">Coordonnées</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{patient.telephone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{patient.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{patient.adresse}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-base">Informations médicales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Né(e) le {patient.date_naissance}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Droplets className="h-4 w-4 text-muted-foreground" />
                    <span>Groupe sanguin : {patient.groupe_sanguin || "Non renseigné"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    <span>Allergies : {patient.allergies || "Aucune"}</span>
                    {patient.allergies && <Badge variant="destructive" className="text-xs">Attention</Badge>}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="odontogramme" className="mt-4">
            <Odontogram teeth={teeth} onUpdate={setTeeth} />
          </TabsContent>

          <TabsContent value="historique" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-primary" /> Consultations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {patientConsultations.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <p>Aucune consultation enregistrée pour ce patient.</p>
                    <Button className="mt-3" size="sm" asChild>
                      <Link to="/consultations/new">Créer une consultation</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Motif</TableHead>
                          <TableHead className="hidden md:table-cell">Traitements</TableHead>
                          <TableHead>Frais</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {patientConsultations.map((c) => (
                          <TableRow key={c.id}>
                            <TableCell>{c.date}</TableCell>
                            <TableCell className="font-medium">{c.motif}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              {c.traitements.map(t => t.type).join(", ")}
                            </TableCell>
                            <TableCell>{c.frais.toLocaleString()} Ar</TableCell>
                            <TableCell>
                              <Badge variant={c.statut === "terminee" ? "default" : "secondary"}>
                                {c.statut === "terminee" ? "Terminée" : "En cours"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" asChild>
                                <Link to={`/consultations/${c.id}`}><Eye className="h-4 w-4" /></Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="factures" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-primary" /> Factures
                </CardTitle>
              </CardHeader>
              <CardContent>
                {patientFactures.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">Aucune facture pour ce patient.</p>
                ) : (
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Numéro</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Montant</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {patientFactures.map((f) => (
                          <TableRow key={f.id}>
                            <TableCell className="font-mono text-sm">{f.numero}</TableCell>
                            <TableCell>{f.date}</TableCell>
                            <TableCell>{f.montant.toLocaleString()} Ar</TableCell>
                            <TableCell>
                              <Badge variant={f.statut === "PAYEE" ? "default" : f.statut === "PARTIELLE" ? "secondary" : "destructive"}>
                                {f.statut}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" asChild>
                                <Link to={`/facturation/${f.id}`}><Eye className="h-4 w-4" /></Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
