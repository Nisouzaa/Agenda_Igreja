import { motion } from "framer-motion";
import { useStore } from "@/context/store";
import {
  getInitials,
  avatarStyle,
  STATUS_BADGE,
  STATUS_LABEL,
  fmtDate,
} from "@/utils/helpers";
import {
  RiTimeLine,
  RiUserLine,
  RiCheckLine,
  RiCloseLine,
  RiDeleteBinLine,
} from "react-icons/ri";

function CounselingCard({ c, i, onConfirm, onCancel, onRemove }) {
  return (
    <motion.div
      key={c.id}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: i * 0.05 }}
      className="flex items-center gap-3 p-3 rounded-xl border border-cream-100 dark:border-gray-800 hover:border-cream-200 dark:hover:border-gray-700 transition-colors"
    >
      <div className="avatar w-9 h-9 text-xs" style={avatarStyle(c.color)}>
        {getInitials(c.name)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
          {c.name}
        </p>
        <p className="text-xs text-gray-400 truncate">{c.subject}</p>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <RiTimeLine className="text-[10px]" />
            {fmtDate(c.date)} · {c.time}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <RiUserLine className="text-[10px]" />
            {c.pastor}
          </span>
        </div>
      </div>

      <span className={`badge ${STATUS_BADGE[c.status]} flex-shrink-0`}>
        {STATUS_LABEL[c.status]}
      </span>

      <div className="flex gap-1 flex-shrink-0">
        {c.status === "pending" && (
          <>
            <button
              className="btn btn-ghost p-1.5 text-sage-600"
              onClick={onConfirm}
              title="Confirmar"
            >
              <RiCheckLine className="text-sm" />
            </button>
            <button
              className="btn btn-ghost p-1.5 text-red-400"
              onClick={onCancel}
              title="Cancelar"
            >
              <RiCloseLine className="text-sm" />
            </button>
          </>
        )}
        <button
          className="btn btn-ghost p-1.5 text-gray-300 hover:text-red-400"
          onClick={onRemove}
          title="Remover"
        >
          <RiDeleteBinLine className="text-sm" />
        </button>
      </div>
    </motion.div>
  );
}

export default function Aconselhamento() {
  const { counseling, updateCounseling, removeCounseling, openModal, showToast } = useStore();

  const pending   = counseling.filter((c) => c.status === "pending");
  const confirmed = counseling.filter((c) => c.status === "confirmed");
  const cancelled = counseling.filter((c) => c.status === "cancelled");

  const Section = ({ title, items, emptyMsg, badge }) => (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <span className={`badge ${badge}`}>{items.length}</span>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-4">{emptyMsg}</p>
      ) : (
        <div className="space-y-2">
          {items.map((c, i) => (
            <CounselingCard
              key={c.id}
              c={c}
              i={i}
              onConfirm={() => {
                updateCounseling(c.id, "confirmed");
                showToast(`${c.name} confirmado!`);
              }}
              onCancel={() => {
                updateCounseling(c.id, "cancelled");
                showToast("Aconselhamento cancelado");
              }}
              onRemove={() => {
                removeCounseling(c.id);
                showToast("Removido");
              }}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full overflow-y-auto space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Aconselhamentos
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {counseling.length} solicitações · {pending.length} pendente(s)
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => openModal("new-counseling")}
        >
          + Agendar
        </button>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Pendentes",   value: pending.length,   color: "#E07070" },
          { label: "Confirmados", value: confirmed.length, color: "#6BAA8B" },
          { label: "Cancelados",  value: cancelled.length, color: "#9CA3AF" },
        ].map((m) => (
          <div key={m.label} className="card p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{m.label}</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{m.value}</p>
            <div className="w-8 h-0.5 rounded-full mt-2" style={{ backgroundColor: m.color }} />
          </div>
        ))}
      </div>

      <Section
        title="Pendentes de confirmação"
        items={pending}
        emptyMsg="Nenhum pendente 🎉"
        badge="badge-rose"
      />
      <Section
        title="Confirmados"
        items={confirmed}
        emptyMsg="Nenhum confirmado ainda"
        badge="badge-green"
      />
      {cancelled.length > 0 && (
        <Section
          title="Cancelados"
          items={cancelled}
          emptyMsg=""
          badge="badge-gray"
        />
      )}
    </motion.div>
  );
}