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
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiDeleteBinLine,
} from "react-icons/ri";
import { TYPE_BADGE, TYPE_LABEL } from "@/utils/helpers";

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const TODAY = new Date();

// Feriados nacionais brasileiros (formato MM-DD para comparar qualquer ano)
// e feriados fixos de 2026
const HOLIDAYS = {
  "2026-01-01": "Confraternização Universal",
  "2026-04-21": "Tiradentes",
  "2026-05-01": "Dia do Trabalho",
  "2026-09-07": "Independência do Brasil",
  "2026-10-12": "Nossa Sra. Aparecida",
  "2026-11-02": "Finados",
  "2026-11-15": "Proclamação da República",
  "2026-11-20": "Consciência Negra",
  "2026-12-25": "Natal",
  // Móveis 2026
  "2026-02-16": "Carnaval",
  "2026-02-17": "Carnaval",
  "2026-04-03": "Sexta-feira Santa",
  "2026-04-05": "Páscoa",
  "2026-06-04": "Corpus Christi",
};

const EVENT_COLORS = {
  culto: "#7C3AED",
  formacao: "#0891B2",
  jovens: "#059669",
  louvor: "#D97706",
  especial: "#E11D48",
  retiro: "#6366F1",
};

export default function Calendar({ compact = false }) {
  const { events, selectedDate, setSelectedDate, showToast, removeEvent } =
    useStore();
  const [month, setMonth] = useState(
    new Date(TODAY.getFullYear(), TODAY.getMonth(), 1),
  );

  const days = eachDayOfInterval({
    start: startOfMonth(month),
    end: endOfMonth(month),
  });
  const padStart = getDay(startOfMonth(month));

  const eventsForDay = (day) =>
    events.filter((e) => e.date === format(day, "yyyy-MM-dd"));

  const getHoliday = (day) => HOLIDAYS[format(day, "yyyy-MM-dd")] || null;

  const selectedEvents = events.filter(
    (e) => e.date === format(selectedDate, "yyyy-MM-dd"),
  );
  const selectedHoliday = getHoliday(selectedDate);

  return (
    <div className={compact ? "" : "flex gap-5 h-full"}>
      {/* Grid do calendário */}
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
              onClick={() =>
                setMonth(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1))
              }
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

        {/* Legenda compacta */}
        {!compact && (
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="flex items-center gap-1 text-[10px] text-gray-400">
              <span className="w-2 h-2 rounded-full bg-serenity-400 inline-block" />{" "}
              Hoje
            </span>
            <span className="flex items-center gap-1 text-[10px] text-gray-400">
              <span className="w-2 h-2 rounded-full bg-red-300 inline-block" />{" "}
              Feriado
            </span>
            <span className="flex items-center gap-1 text-[10px] text-gray-400">
              <span className="w-2 h-2 rounded-full bg-violet-400 inline-block" />{" "}
              Evento
            </span>
          </div>
        )}

        <div className="grid grid-cols-7 mb-1">
          {DAYS.map((d) => (
            <div
              key={d}
              className="text-center text-[10px] font-medium text-gray-400 uppercase tracking-wide py-1"
            >
              {compact ? d[0] : d}
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
            const holiday = getHoliday(day);
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, TODAY);
            const isSunday = getDay(day) === 0;

            return (
              <motion.button
                key={day.toISOString()}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedDate(day)}
                title={holiday || undefined}
                className={[
                  "flex flex-col items-center rounded-lg cursor-pointer transition-all duration-150 pt-1 min-h-[36px]",
                  isToday
                    ? "bg-serenity-400 text-white hover:bg-serenity-500"
                    : isSelected
                      ? "bg-serenity-50 dark:bg-serenity-900 text-serenity-800 dark:text-serenity-100 ring-1 ring-serenity-300"
                      : holiday
                        ? "bg-red-50 dark:bg-red-950/30 text-red-500"
                        : isSunday
                          ? "text-red-400 dark:text-red-400 hover:bg-cream-100 dark:hover:bg-gray-800"
                          : "text-gray-600 dark:text-gray-400 hover:bg-cream-100 dark:hover:bg-gray-800",
                ].join(" ")}
              >
                <span className="text-xs leading-none font-medium">
                  {format(day, "d")}
                </span>
                {/* Pontos de eventos */}
                {evs.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                    {evs.slice(0, 3).map((e, i) => (
                      <span
                        key={i}
                        className="w-1 h-1 rounded-full"
                        style={{
                          backgroundColor: isToday
                            ? "rgba(255,255,255,0.8)"
                            : EVENT_COLORS[e.type] || e.color,
                        }}
                      />
                    ))}
                  </div>
                )}
                {/* Ponto de feriado */}
                {holiday && !isToday && evs.length === 0 && (
                  <span className="w-1 h-1 rounded-full bg-red-300 mt-0.5" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Painel lateral — somente modo completo */}
      {!compact && (
        <div className="w-72 flex flex-col gap-3">
          <div className="card p-4 flex-shrink-0">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 capitalize">
              {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
            </p>
            {selectedHoliday && (
              <span className="inline-block mt-1 text-[10px] bg-red-100 dark:bg-red-950 text-red-500 px-2 py-0.5 rounded-full font-medium">
                🎉 {selectedHoliday}
              </span>
            )}
            <p className="text-xs text-gray-400 mt-1">
              {selectedEvents.length} evento(s) neste dia
            </p>
          </div>

          <div className="space-y-2 overflow-y-auto flex-1">
            {selectedEvents.length === 0 ? (
              <div className="card p-6 text-center">
                <p className="text-sm text-gray-400">
                  {selectedHoliday
                    ? "Feriado — nenhum evento agendado."
                    : "Nenhum evento neste dia."}
                </p>
              </div>
            ) : (
              selectedEvents.map((ev) => (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="card p-4"
                >
                  <div className="flex gap-3">
                    <div
                      className="w-0.5 self-stretch rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: EVENT_COLORS[ev.type] || ev.color,
                      }}
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
                          {ev.confirmed}/{ev.capacity} confirmados
                        </span>
                      </div>
                    </div>
                    {/* Botão remover */}
                    {removeEvent && (
                      <button
                        onClick={() => {
                          removeEvent(ev.id);
                          showToast("Evento removido");
                        }}
                        className="btn btn-ghost p-1.5 text-red-400 hover:text-red-600 flex-shrink-0 self-start"
                        title="Remover evento"
                      >
                        <RiDeleteBinLine className="text-sm" />
                      </button>
                    )}
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
