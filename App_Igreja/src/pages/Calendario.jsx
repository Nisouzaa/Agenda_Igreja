import Calendar from "@/components/calendar/Calendar";
import { motion } from "framer-motion";

export default function Calendario() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Calendar compact={false} />
    </motion.div>
  );
}
