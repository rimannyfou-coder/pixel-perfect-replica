import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    nom_cabinet: "",
    telephone: "",
    adresse: "",
    password: "",
    passwordConfirm: "",
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.passwordConfirm) {
      toast({ title: "Erreur", description: "Les mots de passe ne correspondent pas", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await register({ ...form, role: "CABINET" });
      navigate("/dashboard");
    } catch {
      toast({ title: "Erreur", description: "Erreur lors de l'inscription", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary mb-4">
            <Stethoscope className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold">Créer un compte</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Inscription</CardTitle>
            <CardDescription>Enregistrez votre cabinet dentaire</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nom du cabinet</Label>
                <Input placeholder="Cabinet Dentaire XYZ" value={form.nom_cabinet} onChange={update("nom_cabinet")} required />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="cabinet@exemple.com" value={form.email} onChange={update("email")} required />
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input placeholder="+261 34 00 000 00" value={form.telephone} onChange={update("telephone")} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Mot de passe</Label>
                  <Input type="password" value={form.password} onChange={update("password")} required />
                </div>
                <div className="space-y-2">
                  <Label>Confirmer</Label>
                  <Input type="password" value={form.passwordConfirm} onChange={update("passwordConfirm")} required />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Inscription..." : "S'inscrire"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Déjà un compte ?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">Se connecter</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
