import { motion } from "framer-motion";
import { useStore } from "@/context/store";
import { getInitials, avatarStyle, STATUS_BADGE } from "@/utils/helpers";
import { RiDownloadLine, RiMapPinLine, RiCalendarLine } from "react-icons/ri";

const STATUS_LABELS = { active: "Ativo", new: "Novo", inactive: "Inativo" };
const STATUS_COLORS = {
  active: "badge-green",
  new: "badge-blue",
  inactive: "badge-red",
};

export default function Membros() {
  const { members, showToast } = useStore();

  const active = members.filter((m) => m.status === "active").length;
  const newMembs = members.filter((m) => m.status === "new").length;
  const inactive = members.filter((m) => m.status === "inactive").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full overflow-y-auto space-y-5"
    >
      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Ativos", value: active, color: "#6BAA8B" },
          { label: "Novos", value: newMembs, color: "#7BA7C4" },
          { label: "Inativos", value: inactive, color: "#888" },
        ].map((m) => (
          <div key={m.label} className="card p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {m.label}
            </p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {m.value}
            </p>
            <div
              className="w-8 h-0.5 rounded-full mt-2"
              style={{ backgroundColor: m.color }}
            />
          </div>
        ))}
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Área de Membros
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {members.length} membros cadastrados
            </p>
          </div>
          <button
            className="btn btn-secondary text-xs py-1.5"
            onClick={() => showToast("Lista exportada!")}
          >
            <RiDownloadLine /> Exportar
          </button>
        </div>

        <div className="space-y-2">
          {members.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3 p-3 rounded-xl border border-cream-100 dark:border-gray-800 hover:border-cream-200 dark:hover:border-gray-700 cursor-pointer transition-colors"
              onClick={() => showToast(`${m.name} — ${m.role} — ${m.cell}`)}
            >
              <div
                className="avatar w-10 h-10 text-sm"
                style={avatarStyle(m.color)}
              >
                {getInitials(m.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                    {m.name}
                  </p>
                  <span className="text-[10px] text-gray-400 bg-cream-100 dark:bg-gray-800 rounded-full px-2 py-0.5 flex-shrink-0">
                    {m.role}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <RiMapPinLine className="text-[10px]" />
                    {m.cell}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <RiCalendarLine className="text-[10px]" />
                    Desde {m.since}
                  </span>
                </div>
              </div>
              <span
                className={`badge ${STATUS_COLORS[m.status] || "badge-blue"} flex-shrink-0`}
              >
                {STATUS_LABELS[m.status] || m.status}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
