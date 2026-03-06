export interface Patient {
  id: number;
  prenom: string;
  nom: string;
  date_naissance: string;
  sexe: string;
  telephone: string;
  email: string;
  adresse: string;
  groupe_sanguin: string;
  allergies: string;
  date_creation: string;
}

export interface ToothStatus {
  numero: number;
  statut: string;
  note?: string;
}

export const MOCK_PATIENTS: Patient[] = [
  { id: 1, prenom: "Faly", nom: "Rakoto", date_naissance: "1990-03-15", sexe: "M", telephone: "+261 34 12 345 67", email: "faly@mail.com", adresse: "Antananarivo", groupe_sanguin: "A+", allergies: "Pénicilline", date_creation: "2024-01-10" },
  { id: 2, prenom: "Niry", nom: "Razafy", date_naissance: "1985-07-22", sexe: "F", telephone: "+261 33 98 765 43", email: "niry@mail.com", adresse: "Antsirabe", groupe_sanguin: "O-", allergies: "", date_creation: "2024-02-05" },
  { id: 3, prenom: "Hery", nom: "Andria", date_naissance: "2000-11-01", sexe: "M", telephone: "+261 32 11 222 33", email: "hery@mail.com", adresse: "Fianarantsoa", groupe_sanguin: "B+", allergies: "Latex", date_creation: "2024-03-18" },
  { id: 4, prenom: "Vola", nom: "Rabe", date_naissance: "1978-05-30", sexe: "F", telephone: "+261 34 55 666 77", email: "vola@mail.com", adresse: "Mahajanga", groupe_sanguin: "AB+", allergies: "", date_creation: "2024-04-02" },
  { id: 5, prenom: "Tiana", nom: "Randrianasolo", date_naissance: "1995-09-12", sexe: "M", telephone: "+261 33 44 555 66", email: "tiana@mail.com", adresse: "Toamasina", groupe_sanguin: "O+", allergies: "Aspirine", date_creation: "2024-05-20" },
  { id: 6, prenom: "Soa", nom: "Raharison", date_naissance: "2002-01-28", sexe: "F", telephone: "+261 32 77 888 99", email: "soa@mail.com", adresse: "Antananarivo", groupe_sanguin: "A-", allergies: "", date_creation: "2024-06-15" },
];

// Generate default tooth statuses for adult dentition
export function generateDefaultTeeth(): ToothStatus[] {
  const teeth: ToothStatus[] = [];
  // Upper right: 18-11, Upper left: 21-28
  // Lower left: 38-31, Lower right: 41-48
  for (const quadrant of [1, 2, 3, 4]) {
    for (let pos = 1; pos <= 8; pos++) {
      teeth.push({ numero: quadrant * 10 + pos, statut: "sain" });
    }
  }
  return teeth;
}

// Sample teeth with some statuses for patient 1
export const MOCK_TEETH_PATIENT_1: ToothStatus[] = generateDefaultTeeth().map((t) => {
  if (t.numero === 16) return { ...t, statut: "carie", note: "Carie profonde" };
  if (t.numero === 36) return { ...t, statut: "couronne" };
  if (t.numero === 24) return { ...t, statut: "plombe" };
  if (t.numero === 48) return { ...t, statut: "absente" };
  if (t.numero === 11) return { ...t, statut: "implant" };
  return t;
});

export const STATUT_COLORS: Record<string, string> = {
  sain: "tooth-sain",
  carie: "tooth-carie",
  couronne: "tooth-couronne",
  implant: "tooth-implant",
  absente: "tooth-absente",
  plombe: "tooth-plombe",
  obturee: "tooth-obturee",
  fracturee: "tooth-fracturee",
  devitalisee: "tooth-devitalisee",
  bridge: "tooth-bridge",
};

export const STATUT_LABELS: Record<string, string> = {
  sain: "Sain",
  carie: "Carie",
  couronne: "Couronne",
  implant: "Implant",
  absente: "Absente",
  plombe: "Plombé",
  obturee: "Obturée",
  fracturee: "Fracturée",
  devitalisee: "Dévitalisée",
  bridge: "Bridge",
};
