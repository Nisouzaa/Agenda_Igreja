import { create } from "zustand";
import { format } from "date-fns";

const TODAY = new Date();

// Cores por tipo de evento
export const EVENT_TYPE_COLORS = {
  culto: "#7C3AED",
  formacao: "#0891B2",
  jovens: "#059669",
  louvor: "#D97706",
  especial: "#E11D48",
  retiro: "#6366F1",
};

export const useStore = create((set, get) => ({
  // UI state
  currentPage: "dashboard",
  darkMode: false,
  selectedDate: TODAY,
  modalOpen: null,
  toast: null,
  sidebarCollapsed: false,

  // Data
  events: [],
  volunteers: [],
  counseling: [],
  members: [],
  rooms: [
    { id: 1, name: "Sala Principal", capacity: 300, type: "Igreja",        status: "available", until: null, color: "#7C3AED" },
    { id: 2, name: "Sala 2",         capacity: 80,  type: "Reuniões",      status: "available", until: null, color: "#0891B2" },
    { id: 3, name: "Auditório",      capacity: 200, type: "Eventos",       status: "available", until: null, color: "#059669" },
    { id: 4, name: "Sala de Oração", capacity: 50,  type: "Oração",        status: "available", until: null, color: "#D97706" },
    { id: 5, name: "Sala Infantil",  capacity: 50,  type: "Escola Bíblica",status: "available", until: null, color: "#E11D48" },
    { id: 6, name: "Sala de Mídia",  capacity: 10,  type: "Produção",      status: "available", until: null, color: "#6366F1" },
  ],

  // UI actions
  setPage: (page) => set({ currentPage: page }),
  toggleDark: () => set((s) => ({ darkMode: !s.darkMode })),
  setSelectedDate: (date) => set({ selectedDate: date }),
  openModal: (name) => set({ modalOpen: name }),
  closeModal: () => set({ modalOpen: null }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  showToast: (msg, type = "success") => {
    set({ toast: { msg, type, id: Date.now() } });
    setTimeout(() => set({ toast: null }), 3000);
  },

  // ── Eventos ──
  addEvent: (ev) =>
    set((s) => ({
      events: [
        ...s.events,
        {
          ...ev,
          id: Date.now(),
          confirmed: 0,
          color: EVENT_TYPE_COLORS[ev.type] || "#7C3AED",
        },
      ],
    })),

  removeEvent: (id) =>
    set((s) => ({ events: s.events.filter((e) => e.id !== id) })),

  confirmPresence: (id) =>
    set((s) => ({
      events: s.events.map((e) =>
        e.id === id ? { ...e, confirmed: e.confirmed + 1 } : e,
      ),
    })),

  // ── Aconselhamento ──
  addCounseling: (c) =>
    set((s) => ({
      counseling: [
        ...s.counseling,
        { ...c, id: Date.now(), status: "pending", color: "#7C3AED" },
      ],
    })),

  updateCounseling: (id, status) =>
    set((s) => ({
      counseling: s.counseling.map((c) => (c.id === id ? { ...c, status } : c)),
    })),

  removeCounseling: (id) =>
    set((s) => ({ counseling: s.counseling.filter((c) => c.id !== id) })),

  // ── Voluntários ──
  addVolunteer: (v) =>
    set((s) => ({
      volunteers: [
        ...s.volunteers,
        { ...v, id: Date.now(), status: "pending", color: "#7C3AED" },
      ],
    })),

  updateVolunteer: (id, status) =>
    set((s) => ({
      volunteers: s.volunteers.map((v) => (v.id === id ? { ...v, status } : v)),
    })),

  removeVolunteer: (id) =>
    set((s) => ({ volunteers: s.volunteers.filter((v) => v.id !== id) })),

  // ── Membros ──
  addMember: (m) =>
    set((s) => ({
      members: [
        ...s.members,
        { ...m, id: Date.now(), status: "new", color: "#7C3AED" },
      ],
    })),

  removeMember: (id) =>
    set((s) => ({ members: s.members.filter((m) => m.id !== id) })),

  // ── Salas ──
  updateRoom: (id, changes) =>
    set((s) => ({
      rooms: s.rooms.map((r) => (r.id === id ? { ...r, ...changes } : r)),
    })),

  // ── Selectors ──
  getUpcoming: (n = 6) => {
    const todayStr = format(TODAY, "yyyy-MM-dd");
    return get()
      .events.filter((e) => e.date >= todayStr)
      .sort(
        (a, b) =>
          a.date.localeCompare(b.date) || a.time.localeCompare(b.time),
      )
      .slice(0, n);
  },

  getByDate: (date) =>
    get().events.filter((e) => e.date === format(date, "yyyy-MM-dd")),

  getDatesWithEvents: () => new Set(get().events.map((e) => e.date)),
}));