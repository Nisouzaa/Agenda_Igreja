import { format, parseISO, isToday, isTomorrow, isThisWeek } from "date-fns";
import { ptBR } from "date-fns/locale";

export const fmtDate = (str, pat = "d 'de' MMMM") =>
  format(parseISO(str), pat, { locale: ptBR });

export const fmtDateFull = (str) =>
  format(parseISO(str), "EEEE, d 'de' MMMM", { locale: ptBR });

export const relativeDate = (str) => {
  const d = parseISO(str);
  if (isToday(d)) return "Hoje";
  if (isTomorrow(d)) return "Amanhã";
  if (isThisWeek(d, { locale: ptBR }))
    return format(d, "EEEE", { locale: ptBR });
  return fmtDate(str);
};

export const getInitials = (name = "") =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

export const avatarStyle = (color = "#7C3AED") => ({
  backgroundColor: color + "18",
  color,
});

export const pct = (n, total) => (total ? Math.round((n / total) * 100) : 0);

// Type labels & badges
export const TYPE_LABEL = {
  culto: "Culto",
  formacao: "Formação",
  jovens: "Jovens",
  louvor: "Louvor",
  especial: "Especial",
  retiro: "Retiro",
};

export const TYPE_BADGE = {
  culto: "badge-violet",
  formacao: "badge-amber",
  jovens: "badge-emerald",
  louvor: "badge-sky",
  especial: "badge-rose",
  retiro: "badge-teal",
};

// Status
export const STATUS_LABEL = {
  confirmed: "Confirmado",
  pending: "Pendente",
  cancelled: "Cancelado",
};

export const STATUS_BADGE = {
  confirmed: "badge-emerald",
  pending: "badge-amber",
  cancelled: "badge-rose",
};

// Room status
export const ROOM_STATUS = {
  available: {
    label: "Disponível",
    textCls: "text-emerald-600 dark:text-emerald-400",
    dotCls: "bg-emerald-400",
  },
  occupied: {
    label: "Em uso",
    textCls: "text-rose-500   dark:text-rose-400",
    dotCls: "bg-rose-400",
  },
  reserved: {
    label: "Reservado",
    textCls: "text-amber-600  dark:text-amber-400",
    dotCls: "bg-amber-400",
  },
};

// Member status
export const MEMBER_STATUS_LABEL = {
  active: "Ativo",
  new: "Novo",
  inactive: "Inativo",
};

export const MEMBER_STATUS_BADGE = {
  active: "badge-emerald",
  new: "badge-violet",
  inactive: "badge-gray",
};
