import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MOCK_CONSULTATIONS } from "@/data/mockData";
import { ArrowLeft, Stethoscope, User, FileText } from "lucide-react";

export default function ConsultationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const consultation = MOCK_CONSULTATIONS.find((c) => c.id === Number(id));

  if (!consultation) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Consultation introuvable</p>
          <Button className="mt-4" onClick={() => navigate("/consultations")}>Retour</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-display text-2xl font-bold flex items-center gap-2">
              <Stethoscope className="h-6 w-6 text-primary" /> Consultation #{consultation.id}
            </h1>
            <p className="text-muted-foreground text-sm">{consultation.date}</p>
          </div>
          <Badge className="ml-auto" variant={consultation.statut === "terminee" ? "default" : "secondary"}>
            {consultation.statut === "terminee" ? "Terminée" : "En cours"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><User className="h-4 w-4" /> Patient</CardTitle></CardHeader>
            <CardContent>
              <p className="font-medium">{consultation.patient_nom}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4" /> Motif & Diagnostic</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <p><span className="text-muted-foreground">Motif :</span> {consultation.motif}</p>
              <p><span className="text-muted-foreground">Diagnostic :</span> {consultation.diagnostic}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Traitements</CardTitle></CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dent</TableHead>
                    <TableHead>Traitement</TableHead>
                    <TableHead>Coût</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {consultation.traitements.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{t.dent || "—"}</TableCell>
                      <TableCell>{t.type}</TableCell>
                      <TableCell>{t.cout.toLocaleString()} Ar</TableCell>
                      <TableCell>
                        <Badge variant={t.statut === "termine" ? "default" : t.statut === "en_cours" ? "secondary" : "outline"}>
                          {t.statut === "termine" ? "Terminé" : t.statut === "en_cours" ? "En cours" : "Planifié"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={2} className="font-semibold">Total</TableCell>
                    <TableCell colSpan={2} className="font-semibold">{consultation.frais.toLocaleString()} Ar</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
