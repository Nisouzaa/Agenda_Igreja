import { motion } from "framer-motion";
import { useStore } from "@/context/store";
import { fmtDateFull, pct, TYPE_BADGE, TYPE_LABEL } from "@/utils/helpers";
import {
  RiTimeLine,
  RiMapPinLine,
  RiUserLine,
  RiGroupLine,
} from "react-icons/ri";

export default function Eventos() {
  const { events, openModal, showToast, confirmPresence } = useStore();
  const especiais = events
    .filter((e) => ["especial", "retiro", "jovens"].includes(e.type))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Eventos Especiais
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {especiais.length} eventos programados
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => openModal("new-event")}
        >
          + Novo Evento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {especiais.map((ev, i) => {
          const fill = pct(ev.confirmed, ev.capacity);
          return (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              className="card p-5 cursor-pointer hover:shadow-medium hover:-translate-y-0.5 transition-all"
              onClick={() => showToast(`${ev.title} · ${ev.room}`)}
            >
              {/* Color bar */}
              <div
                className="h-1 rounded-full mb-4 -mx-5 -mt-5 rounded-t-2xl"
                style={{ backgroundColor: ev.color + "80" }}
              />

              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {ev.title}
                </h3>
                <span
                  className={`badge ${TYPE_BADGE[ev.type] || "badge-blue"} flex-shrink-0`}
                >
                  {TYPE_LABEL[ev.type]}
                </span>
              </div>

              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <RiTimeLine className="text-[11px] flex-shrink-0" />
                  <span className="capitalize">
                    {fmtDateFull(ev.date)} · {ev.time}–{ev.end}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <RiMapPinLine className="text-[11px] flex-shrink-0" />
                  <span>{ev.room}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <RiUserLine className="text-[11px] flex-shrink-0" />
                  <span>{ev.leader}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <RiGroupLine className="text-xs text-gray-400" />
                <div className="flex-1 h-1.5 bg-cream-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${fill}%`, backgroundColor: ev.color }}
                  />
                </div>
                <span className="text-[10px] text-gray-400">
                  {ev.confirmed}/{ev.capacity}
                </span>
              </div>

              <button
                className="w-full btn btn-secondary text-xs py-1.5"
                onClick={(e) => {
                  e.stopPropagation();
                  confirmPresence(ev.id);
                  showToast("Inscrição confirmada!");
                }}
              >
                Confirmar inscrição
              </button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
