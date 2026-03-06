import { cn } from "@/lib/utils";

interface ToothProps {
  numero: number;
  statut: string;
  isSelected: boolean;
  onClick: () => void;
}

const STATUS_BG: Record<string, string> = {
  sain: "bg-tooth-sain border-border",
  carie: "bg-tooth-carie border-tooth-carie",
  couronne: "bg-tooth-couronne border-tooth-couronne",
  implant: "bg-tooth-implant border-tooth-implant",
  absente: "bg-tooth-absente border-tooth-absente",
  plombe: "bg-tooth-plombe border-tooth-plombe",
  obturee: "bg-tooth-obturee border-tooth-obturee",
  fracturee: "bg-tooth-fracturee border-tooth-fracturee",
  devitalisee: "bg-tooth-devitalisee border-tooth-devitalisee",
  bridge: "bg-tooth-bridge border-tooth-bridge",
};

export function Tooth({ numero, statut, isSelected, onClick }: ToothProps) {
  const isAbsent = statut === "absente";

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center w-10 h-12 md:w-12 md:h-14 rounded-lg border-2 transition-all cursor-pointer hover:scale-110 hover:shadow-md",
        STATUS_BG[statut] || STATUS_BG.sain,
        isAbsent && "opacity-40",
        isSelected && "ring-2 ring-primary ring-offset-2 scale-110 shadow-lg",
        statut !== "sain" && statut !== "absente" && "text-primary-foreground"
      )}
      title={`Dent ${numero} — ${statut}`}
    >
      <span className={cn("text-xs font-bold", statut === "sain" ? "text-foreground" : "text-inherit")}>
        {numero}
      </span>
      {statut !== "sain" && (
        <span className="text-[8px] mt-0.5 font-medium uppercase tracking-wider">
          {statut.slice(0, 3)}
        </span>
      )}
    </button>
  );
}
