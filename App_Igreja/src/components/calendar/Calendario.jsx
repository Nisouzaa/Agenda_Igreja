import { motion } from "framer-motion";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  getDay,
  addMonths,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { useStore } from "@/context/store";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { TYPE_BADGE, TYPE_LABEL } from "@/utils/helpers";

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const TODAY = new Date(2026, 4, 25);

export default function Calendario({ compact = false }) {
  const { events, selectedDate, setSelectedDate, showToast } = useStore();
  const [month, setMonth] = useState(new Date(2026, 4, 1));

  const days = eachDayOfInterval({
    start: startOfMonth(month),
    end: endOfMonth(month),
  });
  const padStart = getDay(startOfMonth(month));

  const eventsForDay = (day) =>
    events.filter((e) => e.date === format(day, "yyyy-MM-dd"));
  const selectedEvents = events.filter(
    (e) => e.date === format(selectedDate, "yyyy-MM-dd"),
  );

  return (
    <div className={compact ? "" : "flex gap-5 h-full"}>
      {/* Grid */}
      <div className={`card p-5 ${compact ? "" : "flex-1"}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 capitalize">
            {format(month, "MMMM yyyy", { locale: ptBR })}
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMonth(subMonths(month, 1))}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-cream-100 dark:hover:bg-gray-800 transition-colors"
            >
              <RiArrowLeftSLine />
            </button>
            <button
              onClick={() => setMonth(new Date(2026, 4, 1))}
              className="px-2 h-7 text-xs text-gray-400 hover:bg-cream-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Hoje
            </button>
            <button
              onClick={() => setMonth(addMonths(month, 1))}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-cream-100 dark:hover:bg-gray-800 transition-colors"
            >
              <RiArrowRightSLine />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 mb-1">
          {DAYS.map((d) => (
            <div
              key={d}
              className="text-center text-[10px] font-medium text-gray-400 uppercase tracking-wide py-1"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5">
          {Array(padStart)
            .fill(null)
            .map((_, i) => (
              <div key={"p" + i} />
            ))}
          {days.map((day) => {
            const evs = eventsForDay(day);
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, TODAY);
            return (
              <motion.button
                key={day.toISOString()}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedDate(day)}
                className={[
                  "flex flex-col items-center rounded-lg cursor-pointer transition-all duration-150 pt-1 min-h-[36px]",
                  isToday
                    ? "bg-serenity-400 text-white hover:bg-serenity-600"
                    : isSelected
                      ? "bg-serenity-50 dark:bg-serenity-900 text-serenity-800 dark:text-serenity-100"
                      : "text-gray-600 dark:text-gray-400 hover:bg-cream-100 dark:hover:bg-gray-800",
                ].join(" ")}
              >
                <span className="text-xs leading-none">{format(day, "d")}</span>
                {evs.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                    {evs.slice(0, 3).map((e, i) => (
                      <span
                        key={i}
                        className="w-1 h-1 rounded-full"
                        style={{
                          backgroundColor: isToday
                            ? "rgba(255,255,255,0.7)"
                            : e.color,
                        }}
                      />
                    ))}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Day detail — full view only */}
      {!compact && (
        <div className="w-72 flex flex-col gap-3">
          <div className="card p-4 flex-shrink-0">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 capitalize">
              {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {selectedEvents.length} evento(s)
            </p>
          </div>

          <div className="space-y-2 overflow-y-auto flex-1">
            {selectedEvents.length === 0 ? (
              <div className="card p-6 text-center">
                <p className="text-sm text-gray-400">
                  Nenhum evento neste dia.
                </p>
              </div>
            ) : (
              selectedEvents.map((ev) => (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="card p-4 cursor-pointer hover:shadow-medium transition-shadow"
                  onClick={() => showToast(`${ev.title} · ${ev.room}`)}
                >
                  <div className="flex gap-3">
                    <div
                      className="w-0.5 self-stretch rounded-full flex-shrink-0"
                      style={{ backgroundColor: ev.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                        {ev.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {ev.time} – {ev.end}
                      </p>
                      <p className="text-xs text-gray-400">{ev.room}</p>
                      <div className="flex gap-2 mt-2 items-center">
                        <span
                          className={`badge ${TYPE_BADGE[ev.type] || "badge-blue"}`}
                        >
                          {TYPE_LABEL[ev.type]}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {ev.confirmed} confirmados
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
