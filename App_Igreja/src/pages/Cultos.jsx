import { motion } from "framer-motion";
import { useStore } from "@/context/store";
import { relativeDate, pct, TYPE_BADGE, TYPE_LABEL } from "@/utils/helpers";
import {
  RiTimeLine,
  RiMapPinLine,
  RiUserLine,
  RiCheckLine,
  RiRepeatLine,
} from "react-icons/ri";

export default function Cultos() {
  const { events, confirmPresence, showToast, openModal } = useStore();
  const cultos = events
    .filter((e) => ["culto", "formacao", "louvor"].includes(e.type))
    .sort(
      (a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time),
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card p-6 h-full overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Agenda de Cultos
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {cultos.length} cultos cadastrados
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => openModal("new-event")}
        >
          + Novo Culto
        </button>
      </div>

      <div className="space-y-3">
        {cultos.map((ev, i) => {
          const fill = pct(ev.confirmed, ev.capacity);
          return (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-start gap-4 p-4 rounded-xl border border-cream-100 dark:border-gray-800 hover:border-cream-300 dark:hover:border-gray-700 hover:shadow-soft transition-all cursor-pointer"
              onClick={() => showToast(`${ev.title} — ${ev.leader}`)}
            >
              <div
                className="w-1 self-stretch rounded-full flex-shrink-0"
                style={{ backgroundColor: ev.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {ev.title}
                  </p>
                  <div className="flex items-center gap-2">
                    {ev.recurring && (
                      <span className="flex items-center gap-1 text-[10px] text-gray-400 bg-cream-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                        <RiRepeatLine className="text-[10px]" />
                        {ev.recurring}
                      </span>
                    )}
                    <span
                      className={`badge ${TYPE_BADGE[ev.type] || "badge-blue"}`}
                    >
                      {TYPE_LABEL[ev.type]}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <RiTimeLine className="text-[11px]" />
                    {relativeDate(ev.date)} · {ev.time}–{ev.end}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <RiMapPinLine className="text-[11px]" />
                    {ev.room}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <RiUserLine className="text-[11px]" />
                    {ev.leader}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2.5">
                  <div className="flex-1 h-1.5 bg-cream-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-serenity-400 transition-all"
                      style={{ width: `${fill}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 flex-shrink-0">
                    {ev.confirmed}/{ev.capacity} confirmados
                  </span>
                </div>
              </div>
              <button
                className="btn btn-ghost p-1.5 text-sage-600 flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  confirmPresence(ev.id);
                  showToast("Presença confirmada!");
                }}
                title="Confirmar presença"
              >
                <RiCheckLine />
              </button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
