import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/context/store";
import {
  RiCheckLine,
  RiErrorWarningLine,
  RiInformationLine,
} from "react-icons/ri";

const CONFIG = {
  success: { Icon: RiCheckLine, cls: "text-emerald-400" },
  error: { Icon: RiErrorWarningLine, cls: "text-rose-400" },
  info: { Icon: RiInformationLine, cls: "text-violet-400" },
};

export default function Toast() {
  const { toast } = useStore();
  const { Icon, cls } = CONFIG[toast?.type ?? "success"];

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.18 }}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3
                     bg-gray-950 dark:bg-gray-800 text-white rounded-2xl
                     shadow-[0_8px_32px_rgba(0,0,0,0.24)] max-w-xs"
        >
          <Icon className={`text-base flex-shrink-0 ${cls}`} />
          <span className="text-sm leading-snug">{toast.msg}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
