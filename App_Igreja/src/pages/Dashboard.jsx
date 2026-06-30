import { motion } from "framer-motion";
import { useStore } from "@/context/store";
import {
  relativeDate,
  getInitials,
  avatarStyle,
  pct,
  TYPE_BADGE,
  TYPE_LABEL,
  STATUS_BADGE,
  STATUS_LABEL,
} from "@/utils/helpers";
import {
  RiGroupLine,
  RiBookOpenLine,
  RiHeartLine,
  RiTimeLine,
  RiMapPinLine,
  RiCheckLine,
  RiArrowRightLine,
  RiDoorOpenLine,
  RiSendPlaneLine,
} from "react-icons/ri";
import Calendario from "@/components/calendar/Calendar";

const TODAY = new Date(2026, 6, 24);

function MetricCard({
  label,
  value,
  sub,
  subColor = "text-sage-600",
  icon: Icon,
  color,
  delay = 0,
}) {
  const { showToast } = useStore();
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="metric-card"
      onClick={() => showToast(`${label}: ${value}`)}
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: color + "18" }}
        >
          <Icon className="text-sm" style={{ color }} />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          {label}
        </p>
      </div>
      <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        {value}
      </p>
      <p className={`text-xs mt-1 ${subColor}`}>{sub}</p>
    </motion.div>
  );
}

function EventItem({ ev, delay = 0 }) {
  const { showToast, confirmPresence } = useStore();
  const pctFull = pct(ev.confirmed, ev.capacity);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.25 }}
      className="flex items-start gap-3 p-3 rounded-xl border border-cream-100 dark:border-gray-800 bg-cream-50 dark:bg-gray-800/50 cursor-pointer hover:border-cream-300 dark:hover:border-gray-700 hover:shadow-soft transition-all"
      onClick={() => showToast(`${ev.title} · ${ev.room} · ${ev.time}`)}
    >
      <div
        className="w-0.5 self-stretch rounded-full flex-shrink-0 mt-0.5"
        style={{ backgroundColor: ev.color }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
            {ev.title}
          </p>
          <span
            className={`badge ${TYPE_BADGE[ev.type] || "badge-blue"} flex-shrink-0`}
          >
            {TYPE_LABEL[ev.type]}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <RiTimeLine className="text-[11px]" />
            {relativeDate(ev.date)} · {ev.time}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400 truncate">
            <RiMapPinLine className="text-[11px]" />
            {ev.room}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-1 bg-cream-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-serenity-400 transition-all"
              style={{ width: `${pctFull}%` }}
            />
          </div>
          <span className="text-[10px] text-gray-400 flex-shrink-0">
            {ev.confirmed}/{ev.capacity}
          </span>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          confirmPresence(ev.id);
        }}
        className="btn btn-ghost p-1.5 flex-shrink-0 text-sage-600"
        title="Confirmar presença"
      >
        <RiCheckLine />
      </button>
    </motion.div>
  );
}

export default function Dashboard() {
  const {
    events,
    volunteers,
    counseling,
    members,
    setPage,
    openModal,
    showToast,
    getUpcoming,
  } = useStore();

  const upcoming = getUpcoming(5);
  const todayVols = volunteers
    .filter((v) => v.date === "2026-07-24")
    .slice(0, 4);
  const pendingCount = counseling.filter((c) => c.status === "pending").length;

  return (
    <div className="flex gap-5 h-full">
      {/* Left */}
      <div className="flex-1 flex flex-col gap-5 min-w-0 overflow-y-auto">
        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard
            label="Membros"
            value={members.length}
            sub="↑ 3 este mês"
            icon={RiGroupLine}
            color="#7BA7C4"
            delay={0}
          />
          <MetricCard
            label="Cultos/semana"
            value="3"
            sub="Hoje + Qua + Qui"
            icon={RiBookOpenLine}
            color="#C9A84C"
            delay={0.05}
          />
          <MetricCard
            label="Voluntários"
            value={volunteers.filter((v) => v.status === "confirmed").length}
            sub="Confirmados hoje"
            icon={RiGroupLine}
            color="#6BAA8B"
            delay={0.1}
          />
          <MetricCard
            label="Pendentes"
            value={pendingCount}
            sub="Aconselhamentos"
            icon={RiHeartLine}
            color="#E07070"
            delay={0.15}
            subColor="text-red-400"
          />
        </div>

        {/* Upcoming events */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="card p-5 flex-1"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              Próximos Eventos
            </h2>
            <button
              onClick={() => setPage("eventos")}
              className="flex items-center gap-1 text-xs text-serenity-600 hover:text-serenity-800 transition-colors"
            >
              Ver todos <RiArrowRightLine />
            </button>
          </div>
          <div className="space-y-2">
            {upcoming.map((ev, i) => (
              <EventItem key={ev.id} ev={ev} delay={0.2 + i * 0.04} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right */}
      <div className="w-72 flex-shrink-0 flex flex-col gap-5 overflow-y-auto">
        {/* Mini calendar */}
        <Calendario compact />

        {/*   Today´s volunteers  */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              Escala de Hoje
            </h3>
            <button
              onClick={() => setPage("voluntarios")}
              className="text-xs text-serenity-600 hover:text-serenity-800 transition-colors"
            >
              ver todos
            </button>
          </div>
          <div className="space-y-2.5">
            {todayVols.map((v) => (
              <div key={v.id} className="flex items-center gap-2.5">
                <div
                  className="avatar w-7 h-7 text-[10px]"
                  style={avatarStyle(v.color)}
                >
                  {getInitials(v.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 dark:text-gray-100 truncate">
                    {v.name}
                  </p>
                  <p className="text-[10px] text-gray-400">{v.role}</p>
                </div>
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${v.status === "confirmed" ? "bg-sage-400" : "bg-gold-400"}`}
                  title={v.status === "confirmed" ? "Confirmado" : "Pendente"}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/*  Quick  actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-5"
        >
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">
            Ações Rápidas
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                label: "Novo culto",
                icon: RiBookOpenLine,
                action: () => openModal("new-event"),
              },
              {
                label: "Confirmar presença",
                icon: RiCheckLine,
                action: () => showToast("Presença confirmada!"),
              },
              {
                label: "Reservar sala",
                icon: RiDoorOpenLine,
                action: () => showToast("Sala reservada!"),
              },
              {
                label: "Notificar membros",
                icon: RiSendPlaneLine,
                action: () => showToast("Notificação enviada!"),
              },
            ].map(({ label, icon: Icon, action }) => (
              <button
                key={label}
                onClick={action}
                className="flex items-center gap-2 p-2.5 rounded-xl border border-cream-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-medium hover:border-serenity-200 hover:bg-serenity-50 hover:text-serenity-700 dark:hover:border-serenity-700 dark:hover:bg-serenity-900 dark:hover:text-serenity-200 transition-all active:scale-95"
              >
                <Icon className="text-sm flex-shrink-0" />
                <span className="text-left leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
