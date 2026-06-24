import { motion } from "framer-motion";
import Calendario from "@/components/calendar/Calendario";

export default function Calendar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Calendario compact={false} />
    </motion.div>
  );
}
