import { motion } from "framer-motion";
import { useStore } from "@/context/store";
import {
  getInitials,
  avatarStyle,
  STATUS_BADGE,
  STATUS_LABEL,
  relativeDate,
} from "@/utils/helpers";
import { RiCheckLine, RiTimeLine } from "react-icons/ri";

export default function Voluntarios() {
  const { volunteers, updateVolunteer, showToast, openModal } = useStore();

  const confirmed = volunteers.filter((v) => v.status === "confirmed");
  const pending = volunteers.filter((v) => v.status === "pending");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full overflow-y-auto space-y-5"
    >
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Total escalados",
            value: volunteers.length,
            color: "#0121d8",
          },
          { label: "Confirmados", value: confirmed.length, color: "#06f106" },
          { label: "Pendentes", value: pending.length, color: "#ff6207" },
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
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Escala de Voluntários
          </h2>
          <button
            className="btn btn-primary text-xs py-1.5"
            onClick={() => openModal("new-volunteer")} 
          >
            + Escalar
          </button>
        </div>

        <div className="space-y-2">
          {volunteers.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3 p-3 rounded-xl border border-cream-100 dark:border-gray-800 hover:border-cream-200 dark:hover:border-gray-700 transition-colors"
            >
              <div
                className="avatar w-9 h-9 text-xs"
                style={avatarStyle(v.color)}
              >
                {getInitials(v.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                  {v.name}
                </p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-gray-400">{v.role}</span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <RiTimeLine className="text-[10px]" />
                    {v.event} · {relativeDate(v.date)}
                  </span>
                </div>
              </div>
              <span className={`badge ${STATUS_BADGE[v.status]}`}>
                {STATUS_LABEL[v.status]}
              </span>
              {v.status === "pending" && (
                <button
                  className="btn btn-ghost p-1.5 text-sage-600 flex-shrink-0"
                  title="Confirmar"
                  onClick={() => {
                    updateVolunteer(v.id, "confirmed");
                    showToast(`${v.name} confirmado!`);
                  }}
                >
                  <RiCheckLine />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
