import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/context/store";
import {
  RiDashboardLine,
  RiCalendarLine,
  RiBookOpenLine,
  RiStarLine,
  RiGroupLine,
  RiDoorOpenLine,
  RiHeartLine,
  RiIdCardLine,
  RiSettingsLine,
  RiMoonLine,
  RiSunLine,
  RiMenuFoldLine,
  RiMenuUnfoldLine,
  RiLeafLine,
} from "react-icons/ri";

const NAV = [
  {
    section: "Principal",
    items: [
      { id: "dashboard", label: "Dashboard", icon: RiDashboardLine },
      { id: "calendario", label: "Calendário", icon: RiCalendarLine },
      { id: "cultos", label: "Cultos", icon: RiBookOpenLine },
      { id: "eventos", label: "Eventos", icon: RiStarLine },
    ],
  },
  {
    section: "Gestão",
    items: [
      { id: "voluntarios", label: "Voluntários", icon: RiGroupLine },
      { id: "salas", label: "Salas", icon: RiDoorOpenLine },
      { id: "aconselhamento", label: "Aconselhamento", icon: RiHeartLine },
      { id: "membros", label: "Membros", icon: RiIdCardLine },
    ],
  },
];

export default function Sidebar() {
  const {
    currentPage,
    setPage,
    darkMode,
    toggleDark,
    sidebarCollapsed,
    toggleSidebar,
    showToast,
    counseling,
  } = useStore();

  const pendingCounseling = counseling.filter(
    (c) => c.status === "pending",
  ).length;

  const getBadge = (id) => {
    if (id === "aconselhamento" && pendingCounseling > 0)
      return pendingCounseling;
    return null;
  };

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 100 : 236 }}
      transition={{ duration: 0.1, ease: "easeInOut" }}
      className="flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden z-20 relative"
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 h-[60px] border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
        <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center flex-shrink-0">
          <RiLeafLine className="text-white text-base" />
        </div>

        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.20 }}
              className="overflow-hidden"
            >
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap leading-tight">
                ASD - Igreja
              </p>
              <p className="text-[8.5px] text-gray-400 uppercase tracking-widest whitespace-nowrap">
                Missão Galo Branco
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={toggleSidebar}
          className="ml-auto p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
          aria-label={sidebarCollapsed ? "Expandir menu" : "Recolher menu"}
        >
          {sidebarCollapsed ? <RiMenuUnfoldLine /> : <RiMenuFoldLine />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-5">
        {NAV.map(({ section, items }) => (
          <div key={section}>
            {!sidebarCollapsed && (
              <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-600 font-medium px-3 mb-1.5">
                {section}
              </p>
            )}
            <div className="space-y-0.5">
              {items.map(({ id, label, icon: Icon }) => {
                const badge = getBadge(id);
                return (
                  <button
                    key={id}
                    onClick={() => setPage(id)}
                    title={sidebarCollapsed ? label : undefined}
                    className={`nav-item ${currentPage === id ? "active" : ""} ${sidebarCollapsed ? "justify-center px-0" : ""}`}
                  >
                    <Icon className="text-[20px] flex-shrink-0" />
                    <AnimatePresence>
                      {!sidebarCollapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex-1 text-left whitespace-nowrap"
                        >
                          {label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {!sidebarCollapsed && badge && (
                      <span className="badge badge-rose text-[10px] px-1.5 py-0 min-w-[18px] justify-center">
                        {badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-100 dark:border-gray-800 p-2 space-y-0.5 flex-shrink-0">
        <button
          onClick={toggleDark}
          title={
            sidebarCollapsed
              ? darkMode
                ? "Modo claro"
                : "Modo escuro"
              : undefined
          }
          className={`nav-item ${sidebarCollapsed ? "justify-center px-0" : ""}`}
        >
          {darkMode ? (
            <RiSunLine className="text-[17px]" />
          ) : (
            <RiMoonLine className="text-[17px]" />
          )}
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="whitespace-nowrap"
              >
                {darkMode ? "Modo claro" : "Modo escuro"}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <button
          onClick={() => showToast("Configurações em breve", "info")}
          title={sidebarCollapsed ? "Configurações" : undefined}
          className={`nav-item ${sidebarCollapsed ? "justify-center px-0" : ""}`}
        >
          <RiSettingsLine className="text-[17px]" />
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="whitespace-nowrap"
              >
                Configurações
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* User avatar */}
        <div
          className={`nav-item mt-1 cursor-default ${sidebarCollapsed ? "justify-center px-0" : "gap-2.5"}`}
        >
          <div className="avatar w-7 h-7 bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 text-[10px] font-semibold flex-shrink-0">
            PS
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-left overflow-hidden"
              >
                <p className="text-xs font-medium text-gray-800 dark:text-gray-100 truncate leading-tight">
                  <span>[name]</span>
                </p>
                <p className="text-[10px] text-gray-400 truncate">
                  Administrador
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
