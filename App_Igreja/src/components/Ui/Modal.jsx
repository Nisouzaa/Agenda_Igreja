import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useStore } from "@/context/store";
import { RiCloseLine } from "react-icons/ri";
import { format } from "date-fns";

const TODAY_STR = format(new Date(), "yyyy-MM-dd");

function Field({ label, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}

function ModalShell({
  title,
  onClose,
  children,
  onSave,
  saveLabel = "Salvar",
}) {
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <button
          onClick={onClose}
          className="btn btn-ghost p-1.5"
          aria-label="Fechar"
        >
          <RiCloseLine className="text-lg" />
        </button>
      </div>

      <div className="space-y-4 overflow-y-auto max-h-[55vh] pr-0.5">
        {children}
      </div>

      <div className="flex gap-2.5 justify-end mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
        <button className="btn btn-secondary" onClick={onClose}>
          Cancelar
        </button>
        <button className="btn btn-primary" onClick={onSave}>
          {saveLabel}
        </button>
      </div>
    </>
  );
}

/* ── Novo Evento ── */
function NewEventForm({ onClose }) {
  const { addEvent, showToast } = useStore();
  const [f, setF] = useState({
    title: "",
    type: "culto",
    date: TODAY_STR,
    time: "09:00",
    end: "11:00",
    room: "Sala Principal",
    leader: "",
    capacity: 100,
    recurring: "",
  });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const save = () => {
    if (!f.title.trim()) {
      showToast("Informe o nome do evento", "error");
      return;
    }
    if (!f.leader.trim()) {
      showToast("Informe o responsável", "error");
      return;
    }
    addEvent(f);
    showToast("Evento criado com sucesso!");
    onClose();
  };

  return (
    <ModalShell
      title="Novo evento"
      onClose={onClose}
      onSave={save}
      saveLabel="Criar evento"
    >
      <Field label="Tipo">
        <select
          className="input"
          value={f.type}
          onChange={(e) => set("type", e.target.value)}
        >
          <option value="culto">Culto</option>
          <option value="formacao">Escola Bíblica / Formação</option>
          <option value="jovens">Jovens</option>
          <option value="louvor">Louvor / Ensaio</option>
          <option value="especial">Evento Especial</option>
          <option value="retiro">Retiro</option>
        </select>
      </Field>

      <Field label="Nome do evento">
        <input
          className="input"
          placeholder="Ex: Culto Dominical Matutino"
          value={f.title}
          onChange={(e) => set("title", e.target.value)}
        />
      </Field>

      <Field label="Data">
        <input
          type="date"
          className="input"
          value={f.date}
          onChange={(e) => set("date", e.target.value)}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Início">
          <input
            type="time"
            className="input"
            value={f.time}
            onChange={(e) => set("time", e.target.value)}
          />
        </Field>
        <Field label="Término">
          <input
            type="time"
            className="input"
            value={f.end}
            onChange={(e) => set("end", e.target.value)}
          />
        </Field>
      </div>

      <Field label="Local">
        <select
          className="input"
          value={f.room}
          onChange={(e) => set("room", e.target.value)}
        >
          <option>Sala Principal</option>
          <option>Sala 2</option>
          <option>Auditório</option>
          <option>Sala de Oração</option>
          <option>Sala Infantil</option>
          <option>Sítio da Igreja</option>
        </select>
      </Field>

      <Field label="Responsável">
        <input
          className="input"
          placeholder="Nome do pastor ou líder"
          value={f.leader}
          onChange={(e) => set("leader", e.target.value)}
        />
      </Field>

      <Field label="Capacidade máxima">
        <input
          type="number"
          className="input"
          min={1}
          value={f.capacity}
          onChange={(e) => set("capacity", Number(e.target.value))}
        />
      </Field>

      <Field label="Recorrência (opcional)">
        <select
          className="input"
          value={f.recurring}
          onChange={(e) => set("recurring", e.target.value)}
        >
          <option value="">Sem recorrência</option>
          <option value="Semanal">Semanal</option>
          <option value="Quinzenal">Quinzenal</option>
          <option value="Mensal">Mensal</option>
        </select>
      </Field>
    </ModalShell>
  );
}

/* ── Novo Aconselhamento ── */
function NewCounselingForm({ onClose }) {
  const { addCounseling, showToast } = useStore();
  const [f, setF] = useState({
    name: "",
    subject: "",
    date: TODAY_STR,
    time: "09:00",
    pastor: "",
  });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const save = () => {
    if (!f.name.trim()) {
      showToast("Informe o nome", "error");
      return;
    }
    if (!f.subject.trim()) {
      showToast("Informe o assunto", "error");
      return;
    }
    if (!f.pastor.trim()) {
      showToast("Informe o pastor responsável", "error");
      return;
    }
    addCounseling(f);
    showToast("Aconselhamento agendado!");
    onClose();
  };

  return (
    <ModalShell
      title="Agendar aconselhamento"
      onClose={onClose}
      onSave={save}
      saveLabel="Agendar"
    >
      <Field label="Nome do solicitante">
        <input
          className="input"
          placeholder="Nome completo"
          value={f.name}
          onChange={(e) => set("name", e.target.value)}
        />
      </Field>

      <Field label="Assunto">
        <input
          className="input"
          placeholder="Ex: Orientação familiar"
          value={f.subject}
          onChange={(e) => set("subject", e.target.value)}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Data">
          <input
            type="date"
            className="input"
            value={f.date}
            onChange={(e) => set("date", e.target.value)}
          />
        </Field>
        <Field label="Horário">
          <input
            type="time"
            className="input"
            value={f.time}
            onChange={(e) => set("time", e.target.value)}
          />
        </Field>
      </div>

      <Field label="Pastor responsável">
        <input
          className="input"
          placeholder="Nome do pastor"
          value={f.pastor}
          onChange={(e) => set("pastor", e.target.value)}
        />
      </Field>
    </ModalShell>
  );
}

/* ── Novo Membro ── */
function NewMemberForm({ onClose }) {
  const { addMember, showToast } = useStore();
  const [f, setF] = useState({
    name: "",
    role: "Membro",
    cell: "",
    since: String(new Date().getFullYear()),
  });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const save = () => {
    if (!f.name.trim()) {
      showToast("Informe o nome", "error");
      return;
    }
    addMember(f);
    showToast("Membro cadastrado!");
    onClose();
  };

  return (
    <ModalShell
      title="Novo membro"
      onClose={onClose}
      onSave={save}
      saveLabel="Cadastrar"
    >
      <Field label="Nome completo">
        <input
          className="input"
          placeholder="Nome completo"
          value={f.name}
          onChange={(e) => set("name", e.target.value)}
        />
      </Field>

      <Field label="Função">
        <select
          className="input"
          value={f.role}
          onChange={(e) => set("role", e.target.value)}
        >
          <option>Membro</option>
          <option>Líder</option>
          <option>Diácono</option>
          <option>Diáconisa</option>
          <option>Pastor</option>
        </select>
      </Field>

      <Field label="Célula">
        <input
          className="input"
          placeholder="Ex: Célula Norte"
          value={f.cell}
          onChange={(e) => set("cell", e.target.value)}
        />
      </Field>

      <Field label="Ano de ingresso">
        <input
          type="number"
          className="input"
          min={1900}
          max={new Date().getFullYear()}
          value={f.since}
          onChange={(e) => set("since", e.target.value)}
        />
      </Field>
    </ModalShell>
  );
}

/* ── NOVO Voluntário ── */
function NewVolunteerForm({ onClose }) {
  const { addVolunteer, showToast, events } = useStore();
  const [f, setF] = useState({
    name: "",
    role: "",
    event: "",
    date: TODAY_STR,
  });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const save = () => {
    if (!f.name.trim()) {
      showToast("Informe o nome", "error");
      return;
    }
    if (!f.role.trim()) {
      showToast("Informe a função", "error");
      return;
    }
    addVolunteer(f);
    showToast("Voluntário escalado!");
    onClose();
  };

  return (
    <ModalShell
      title="Escalar voluntário"
      onClose={onClose}
      onSave={save}
      saveLabel="Escalar"
    >
      <Field label="Nome do voluntário">
        <input
          className="input"
          placeholder="Nome completo"
          value={f.name}
          onChange={(e) => set("name", e.target.value)}
        />
      </Field>

      <Field label="Função">
        <select
          className="input"
          value={f.role}
          onChange={(e) => set("role", e.target.value)}
        >
          <option value="">Selecionar…</option>
          <option>Louvor</option>
          <option>Recepção</option>
          <option>Mídia</option>
          <option>Segurança</option>
          <option>Infantil</option>
          <option>Organização</option>
        </select>
      </Field>

      <Field label="Evento">
        {events.length > 0 ? (
          <select
            className="input"
            value={f.event}
            onChange={(e) => set("event", e.target.value)}
          >
            <option value="">Selecionar evento…</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.title}>
                {ev.title} — {ev.date}
              </option>
            ))}
          </select>
        ) : (
          <input
            className="input"
            placeholder="Nome do evento"
            value={f.event}
            onChange={(e) => set("event", e.target.value)}
          />
        )}
      </Field>

      <Field label="Data">
        <input
          type="date"
          className="input"
          value={f.date}
          onChange={(e) => set("date", e.target.value)}
        />
      </Field>
    </ModalShell>
  );
}

/* ── Modal Principal ── */
export default function Modal() {
  const { modalOpen, closeModal } = useStore();

  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-40 flex items-center justify-center p-4"
          style={{
            background: "rgba(0,0,0,0.18)",
            backdropFilter: "blur(6px)",
          }}
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.18 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.16)] border border-gray-100 dark:border-gray-800 p-6 w-full max-w-md"
          >
            {modalOpen === "new-event" && <NewEventForm onClose={closeModal} />}
            {modalOpen === "new-counseling" && (
              <NewCounselingForm onClose={closeModal} />
            )}
            {modalOpen === "new-member" && (
              <NewMemberForm onClose={closeModal} />
            )}
            {modalOpen === "new-volunteer" && (
              <NewVolunteerForm onClose={closeModal} />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
