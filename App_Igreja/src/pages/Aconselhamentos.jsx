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
} from "react-icons/ri";

export default function Aconselhamento() {
  const { counseling, updateCounseling, openModal, showToast } = useStore();

  const pending = counseling.filter((c) => c.status === "pending");
  const confirmed = counseling.filter((c) => c.status === "confirmed");

  const Section = ({ title, items, emptyMsg }) => (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <span className="badge badge-blue">{items.length}</span>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-4">{emptyMsg}</p>
      ) : (
        <div className="space-y-2">
          {items.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl border border-cream-100 dark:border-gray-800 hover:border-cream-200 dark:hover:border-gray-700 transition-colors"
            >
              <div
                className="avatar w-9 h-9 text-xs"
                style={avatarStyle(c.color)}
              >
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
              {c.status === "pending" && (
                <div className="flex gap-1">
                  <button
                    className="btn btn-ghost p-1.5 text-sage-600 flex-shrink-0"
                    onClick={() => {
                      updateCounseling(c.id, "confirmed");
                      showToast(`${c.name} confirmado!`);
                    }}
                    title="Confirmar"
                  >
                    <RiCheckLine className="text-sm" />
                  </button>
                  <button
                    className="btn btn-ghost p-1.5 text-red-400 flex-shrink-0"
                    onClick={() => {
                      updateCounseling(c.id, "cancelled");
                      showToast("Cancelado");
                    }}
                    title="Cancelar"
                  >
                    <RiCloseLine className="text-sm" />
                  </button>
                </div>
              )}
            </motion.div>
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Aconselhamentos
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {counseling.length} solicitações
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => openModal("new-counseling")}
        >
          + Agendar
        </button>
      </div>

      <Section
        title="Pendentes de confirmação"
        items={pending}
        emptyMsg="Nenhum pendente 🎉"
      />
      <Section
        title="Confirmados"
        items={confirmed}
        emptyMsg="Nenhum confirmado ainda"
      />
    </motion.div>
  );
}
