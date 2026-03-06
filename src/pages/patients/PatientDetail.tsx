import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Odontogram } from "@/components/odontogram/Odontogram";
import { MOCK_PATIENTS, MOCK_TEETH_PATIENT_1, generateDefaultTeeth, type ToothStatus } from "@/data/mockData";
import { ArrowLeft, Pencil, Phone, Mail, MapPin, Calendar, Droplets, AlertTriangle } from "lucide-react";

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
              <p className="text-sm text-muted-foreground">Fiche patient #{patient.id}</p>
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
            <TabsTrigger value="historique">Historique</TabsTrigger>
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
              <CardContent className="py-12 text-center text-muted-foreground">
                <p>Aucune consultation enregistrée pour ce patient.</p>
                <p className="text-sm mt-1">Les consultations apparaîtront ici une fois créées.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
