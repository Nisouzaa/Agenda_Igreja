import { useStore } from "@/context/store";
import { RiAddLine, RiSearchLine, RiBellLine } from "react-icons/ri";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const TODAY = new Date();

const TITLES = {
  dashboard: "Dashboard",
  calendario: "Calendário",
  cultos: "Agenda de Cultos",
  eventos: "Eventos Especiais",
  voluntarios: "Escala de Voluntários",
  salas: "Controle de Salas",
  aconselhamento: "Aconselhamento",
  membros: "Área de Membros",
};

const ACTIONS = {
  cultos: { label: "Novo culto", modal: "new-event" },
  eventos: { label: "Novo evento", modal: "new-event" },
  voluntarios: { label: "Escalar", modal: "new-volunteer" },
  salas: { label: "Reservar sala", modal: "new-event" },
  aconselhamento: { label: "Agendar", modal: "new-counseling" },
  membros: { label: "Novo membro", modal: "new-member" },
};

export default function Header() {
  const { currentPage, openModal, showToast, counseling } = useStore();
  const title = TITLES[currentPage] || "Dashboard";
  const action = ACTIONS[currentPage];
  const dateStr = format(TODAY, "EEEE, d 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });
  const pendingCount = counseling.filter((c) => c.status === "pending").length;

  return (
    <header className="flex items-center gap-3 px-5 h-[60px] bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
          {title}
        </h1>
        <p className="text-[11px] text-gray-400 capitalize truncate">
          {dateStr}
        </p>
      </div>

      <button
        onClick={() => showToast("Busca em desenvolvimento", "info")}
        className="btn btn-secondary hidden sm:inline-flex text-gray-400 gap-2.5"
      >
        <RiSearchLine className="text-base" />
        <span className="text-sm text-gray-400 font-normal">Buscar…</span>
        <kbd className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-400 rounded px-1.5 py-0.5 font-mono hidden md:inline">
          ⌘K
        </kbd>
      </button>

      <button
        onClick={() =>
          showToast(
            pendingCount > 0
              ? `${pendingCount} aconselhamento(s) pendente(s)`
              : "Nenhuma notificação",
            pendingCount > 0 ? "info" : "success",
          )
        }
        className="btn btn-ghost p-2 relative"
        aria-label="Notificações"
      >
        <RiBellLine className="text-lg text-gray-500 dark:text-gray-400" />
        {pendingCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full border-2 border-white dark:border-gray-900" />
        )}
      </button>

      <button
        onClick={() => openModal(action?.modal || "new-event")}
        className="btn btn-primary"
      >
        <RiAddLine className="text-base" />
        <span className="hidden sm:inline">
          {action?.label || "Novo evento"}
        </span>
      </button>
    </header>
  );
}
