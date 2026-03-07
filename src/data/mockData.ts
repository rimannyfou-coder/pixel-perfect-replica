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

export interface Consultation {
  id: number;
  patient_id: number;
  patient_nom: string;
  date: string;
  motif: string;
  diagnostic: string;
  frais: number;
  traitements: Traitement[];
  statut: "en_cours" | "terminee";
}

export interface Traitement {
  id: number;
  dent: number;
  type: string;
  cout: number;
  statut: "planifie" | "en_cours" | "termine";
}

export interface Facture {
  id: number;
  numero: string;
  patient_id: number;
  patient_nom: string;
  consultation_id: number;
  montant: number;
  montant_paye: number;
  statut: "IMPAYEE" | "PARTIELLE" | "PAYEE";
  date: string;
  paiements: Paiement[];
}

export interface Paiement {
  id: number;
  montant: number;
  methode: "ESPECES" | "CARTE" | "MOBILE_MONEY" | "VIREMENT";
  date: string;
}

export interface Article {
  id: number;
  nom: string;
  categorie: string;
  quantite: number;
  seuil_alerte: number;
  prix: number;
  unite: string;
}

export interface MouvementStock {
  id: number;
  article_id: number;
  article_nom: string;
  type: "ENTREE" | "SORTIE";
  quantite: number;
  date: string;
  motif: string;
}

export interface RendezVous {
  id: number;
  patient_id: number;
  patient_nom: string;
  date: string;
  heure: string;
  motif: string;
  statut: "confirme" | "en_attente" | "annule" | "termine";
  duree: number; // minutes
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
  for (const quadrant of [1, 2, 3, 4]) {
    for (let pos = 1; pos <= 8; pos++) {
      teeth.push({ numero: quadrant * 10 + pos, statut: "sain" });
    }
  }
  return teeth;
}

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

export const TYPES_TRAITEMENT = [
  "Détartrage", "Extraction", "Obturation", "Couronne", "Bridge",
  "Implant", "Traitement de canal", "Blanchiment", "Prothèse", "Orthodontie",
];

export const MOCK_CONSULTATIONS: Consultation[] = [
  {
    id: 1, patient_id: 1, patient_nom: "Rakoto Faly", date: "2024-06-15",
    motif: "Douleur molaire", diagnostic: "Carie profonde dent 16",
    frais: 150000, statut: "terminee",
    traitements: [
      { id: 1, dent: 16, type: "Obturation", cout: 80000, statut: "termine" },
      { id: 2, dent: 16, type: "Détartrage", cout: 70000, statut: "termine" },
    ],
  },
  {
    id: 2, patient_id: 2, patient_nom: "Razafy Niry", date: "2024-06-16",
    motif: "Contrôle annuel", diagnostic: "Bonne hygiène, détartrage recommandé",
    frais: 60000, statut: "terminee",
    traitements: [
      { id: 3, dent: 0, type: "Détartrage", cout: 60000, statut: "termine" },
    ],
  },
  {
    id: 3, patient_id: 3, patient_nom: "Andria Hery", date: "2024-06-17",
    motif: "Dent cassée", diagnostic: "Fracture dent 21, couronne nécessaire",
    frais: 350000, statut: "en_cours",
    traitements: [
      { id: 4, dent: 21, type: "Couronne", cout: 250000, statut: "en_cours" },
      { id: 5, dent: 21, type: "Traitement de canal", cout: 100000, statut: "planifie" },
    ],
  },
  {
    id: 4, patient_id: 1, patient_nom: "Rakoto Faly", date: "2024-06-20",
    motif: "Pose implant", diagnostic: "Implant dent 48",
    frais: 800000, statut: "en_cours",
    traitements: [
      { id: 6, dent: 48, type: "Implant", cout: 800000, statut: "en_cours" },
    ],
  },
  {
    id: 5, patient_id: 5, patient_nom: "Randrianasolo Tiana", date: "2024-06-22",
    motif: "Blanchiment", diagnostic: "Blanchiment complet",
    frais: 200000, statut: "terminee",
    traitements: [
      { id: 7, dent: 0, type: "Blanchiment", cout: 200000, statut: "termine" },
    ],
  },
];

export const MOCK_FACTURES: Facture[] = [
  {
    id: 1, numero: "FAC-2024-001", patient_id: 1, patient_nom: "Rakoto Faly",
    consultation_id: 1, montant: 150000, montant_paye: 150000, statut: "PAYEE",
    date: "2024-06-15",
    paiements: [{ id: 1, montant: 150000, methode: "ESPECES", date: "2024-06-15" }],
  },
  {
    id: 2, numero: "FAC-2024-002", patient_id: 2, patient_nom: "Razafy Niry",
    consultation_id: 2, montant: 60000, montant_paye: 60000, statut: "PAYEE",
    date: "2024-06-16",
    paiements: [{ id: 2, montant: 60000, methode: "CARTE", date: "2024-06-16" }],
  },
  {
    id: 3, numero: "FAC-2024-003", patient_id: 3, patient_nom: "Andria Hery",
    consultation_id: 3, montant: 350000, montant_paye: 100000, statut: "PARTIELLE",
    date: "2024-06-17",
    paiements: [{ id: 3, montant: 100000, methode: "MOBILE_MONEY", date: "2024-06-17" }],
  },
  {
    id: 4, numero: "FAC-2024-004", patient_id: 1, patient_nom: "Rakoto Faly",
    consultation_id: 4, montant: 800000, montant_paye: 0, statut: "IMPAYEE",
    date: "2024-06-20",
    paiements: [],
  },
  {
    id: 5, numero: "FAC-2024-005", patient_id: 5, patient_nom: "Randrianasolo Tiana",
    consultation_id: 5, montant: 200000, montant_paye: 0, statut: "IMPAYEE",
    date: "2024-06-22",
    paiements: [],
  },
];

export const MOCK_ARTICLES: Article[] = [
  { id: 1, nom: "Composite dentaire", categorie: "Matériaux", quantite: 25, seuil_alerte: 10, prix: 45000, unite: "tube" },
  { id: 2, nom: "Gants latex (boîte)", categorie: "Consommables", quantite: 8, seuil_alerte: 10, prix: 15000, unite: "boîte" },
  { id: 3, nom: "Aiguilles anesthésie", categorie: "Consommables", quantite: 50, seuil_alerte: 20, prix: 500, unite: "unité" },
  { id: 4, nom: "Ciment temporaire", categorie: "Matériaux", quantite: 3, seuil_alerte: 5, prix: 35000, unite: "pot" },
  { id: 5, nom: "Fraises diamantées", categorie: "Instruments", quantite: 12, seuil_alerte: 5, prix: 8000, unite: "unité" },
  { id: 6, nom: "Masques chirurgicaux", categorie: "Consommables", quantite: 4, seuil_alerte: 10, prix: 12000, unite: "boîte" },
  { id: 7, nom: "Fil de suture", categorie: "Consommables", quantite: 15, seuil_alerte: 5, prix: 6000, unite: "sachet" },
  { id: 8, nom: "Résine acrylique", categorie: "Matériaux", quantite: 6, seuil_alerte: 3, prix: 55000, unite: "kit" },
];

export const MOCK_MOUVEMENTS: MouvementStock[] = [
  { id: 1, article_id: 1, article_nom: "Composite dentaire", type: "ENTREE", quantite: 10, date: "2024-06-01", motif: "Réapprovisionnement" },
  { id: 2, article_id: 2, article_nom: "Gants latex (boîte)", type: "SORTIE", quantite: 2, date: "2024-06-05", motif: "Usage quotidien" },
  { id: 3, article_id: 3, article_nom: "Aiguilles anesthésie", type: "SORTIE", quantite: 5, date: "2024-06-10", motif: "Consultations" },
  { id: 4, article_id: 4, article_nom: "Ciment temporaire", type: "SORTIE", quantite: 1, date: "2024-06-12", motif: "Obturation temporaire" },
  { id: 5, article_id: 6, article_nom: "Masques chirurgicaux", type: "ENTREE", quantite: 20, date: "2024-06-14", motif: "Commande fournisseur" },
];

export const MOCK_RENDEZVOUS: RendezVous[] = [
  { id: 1, patient_id: 1, patient_nom: "Rakoto Faly", date: "2024-06-25", heure: "09:00", motif: "Suivi implant", statut: "confirme", duree: 30 },
  { id: 2, patient_id: 2, patient_nom: "Razafy Niry", date: "2024-06-25", heure: "10:00", motif: "Détartrage", statut: "confirme", duree: 45 },
  { id: 3, patient_id: 3, patient_nom: "Andria Hery", date: "2024-06-25", heure: "14:00", motif: "Pose couronne", statut: "en_attente", duree: 60 },
  { id: 4, patient_id: 4, patient_nom: "Rabe Vola", date: "2024-06-26", heure: "09:30", motif: "Contrôle", statut: "confirme", duree: 30 },
  { id: 5, patient_id: 5, patient_nom: "Randrianasolo Tiana", date: "2024-06-26", heure: "11:00", motif: "Orthodontie", statut: "en_attente", duree: 45 },
  { id: 6, patient_id: 6, patient_nom: "Raharison Soa", date: "2024-06-27", heure: "08:30", motif: "Extraction", statut: "confirme", duree: 30 },
  { id: 7, patient_id: 1, patient_nom: "Rakoto Faly", date: "2024-06-20", heure: "10:00", motif: "Consultation initiale", statut: "termine", duree: 45 },
  { id: 8, patient_id: 3, patient_nom: "Andria Hery", date: "2024-06-18", heure: "14:30", motif: "Urgence dentaire", statut: "annule", duree: 30 },
];

export const CATEGORIES_ARTICLES = ["Matériaux", "Consommables", "Instruments", "Médicaments", "Équipement"];
