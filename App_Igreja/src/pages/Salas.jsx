import { motion } from "framer-motion";
import { useStore } from "@/context/store";
import { ROOM_STATUS } from "@/utils/helpers";
import { RiDoorOpenLine, RiGroupLine, RiTimeLine } from "react-icons/ri";

export default function Salas() {
  const { rooms, showToast } = useStore();

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
            label: "Disponíveis",
            value: rooms.filter((r) => r.status === "available").length,
            color: "#00ff2a",
          },
          {
            label: "Em uso",
            value: rooms.filter((r) => r.status === "occupied").length,
            color: "#fffb05",
          },
          {
            label: "Reservadas",
            value: rooms.filter((r) => r.status === "reserved").length,
            color: "#ff0000",
          },
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room, i) => {
          const st = ROOM_STATUS[room.status];
          return (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="card p-5 cursor-pointer hover:shadow-medium hover:-translate-y-0.5 transition-all"
              onClick={() => showToast(`${room.name} — ${st.label}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: room.color + "18" }}
                >
                  <RiDoorOpenLine
                    className="text-lg"
                    style={{ color: room.color }}
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${st.dotCls}`} />
                  <span className={`text-xs font-medium ${st.textCls}`}>
                    {st.label}
                  </span>
                </div>
              </div>

              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {room.name}
              </h3>
              <p className="text-xs text-gray-400 mb-3">{room.type}</p>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <RiGroupLine className="text-[11px]" />
                  <span>{room.capacity} lugares</span>
                </div>
                {room.until && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <RiTimeLine className="text-[11px]" />
                    <span>
                      {room.status === "occupied"
                        ? "Libera às"
                        : "Reservado às"}{" "}
                      {room.until}
                    </span>
                  </div>
                )}
              </div>

              <button
                className="w-full btn btn-secondary text-xs py-1.5 mt-4"
                onClick={(e) => {
                  e.stopPropagation();
                  showToast(`${room.name} reservada!`);
                }}
                disabled={room.status === "occupied"}
              >
                {room.status === "occupied" ? "Indisponível" : "Reservar sala"}
              </button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
