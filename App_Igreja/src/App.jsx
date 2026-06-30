import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/context/store";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import Toast from "@/components/Ui/Toast";
import Modal from "@/components/Ui/Modal";

import Dashboard from "@/pages/Dashboard";
import Calendar from "@/pages/Calendario";
import Cultos from "@/pages/Cultos";
import Eventos from "@/pages/Eventos";
import Salas from "@/pages/Salas";
import Aconselhamento from "@/pages/Aconselhamento";
import Voluntarios from "@/pages/Voluntarios";
import Membros from "@/pages/Membros";

const PAGES = {
  dashboard: Dashboard,
  calendario: Calendar, 
  cultos: Cultos,
  eventos: Eventos, 
  salas: Salas,
  aconselhamento: Aconselhamento, 
  voluntarios: Voluntarios,
  membros: Membros,
};

function App() {
  const { currentPage, darkMode } = useStore();
  const PageComponent = PAGES[currentPage] || Dashboard;

  // Aplica o tema escuro ao body quando darkMode é verdadeiro
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="flex h-screen overflow-hidden bg-cream-100 dark:bg-gray-950">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-hidden p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="h-full"
            >
              <PageComponent />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <Modal />
      <Toast />
    </div>
  );
}

export default App;
