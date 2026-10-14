import { FormEvent, ReactNode, useMemo, useState } from "react";

type IconName =
  | "home"
  | "sparkles"
  | "info"
  | "history"
  | "calendar"
  | "settings"
  | "moon"
  | "sun"
  | "menu"
  | "send"
  | "mic"
  | "tasks"
  | "close"
  | "chevron";

const iconPaths: Record<IconName, ReactNode> = {
  home: <><path d="M3 10.8 12 3l9 7.8" /><path d="M5.5 9.5V21h13V9.5M9 21v-6h6v6" /></>,
  sparkles: <><path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3Z" /><path d="m19 14 .7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7L19 14ZM5 13l.8 2.2L8 16l-2.2.8L5 19l-.8-2.2L2 16l2.2-.8L5 13Z" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5h.01" /></>,
  history: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5M12 7v5l3 2" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4M17 3v4M3 10h18" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
  moon: <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  send: <><path d="m3 3 18 9-18 9 3.5-9L3 3Z" /><path d="M6.5 12H21" /></>,
  mic: <><rect x="9" y="3" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" /></>,
  tasks: <><path d="m4 6 1.5 1.5L8 5M11 6h9M4 12l1.5 1.5L8 11M11 12h9M4 18l1.5 1.5L8 17M11 18h9" /></>,
  close: <path d="m5 5 14 14M19 5 5 19" />,
  chevron: <path d="m9 18 6-6-6-6" />,
};

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconPaths[name]}
    </svg>
  );
}

const navItems: { label: string; icon: IconName; key: string }[] = [
  { label: "Inicio / Chat", icon: "home", key: "chat" },
  { label: "Organizar mi semana", icon: "sparkles", key: "plan" },
  { label: "Información del agente", icon: "info", key: "info" },
  { label: "Historial", icon: "history", key: "history" },
  { label: "Calendario", icon: "calendar", key: "calendar" },
  { label: "Configuración", icon: "settings", key: "settings" },
];

const quickStarts = [
  "1. Estoy saturado",
  "2. Completo mis datos",
  "3. Priorizo pendientes",
  "4. Creo mi plan",
];

const academicEvents = new Set(["2025-05-06", "2025-05-14", "2025-05-19", "2025-05-27"]);
const monthFormatter = new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" });
const fullDateFormatter = new Intl.DateTimeFormat("es-ES", { dateStyle: "full" });

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isSameDay(first: Date, second: Date) {
  return dateKey(first) === dateKey(second);
}

function getCalendarDays(month: Date) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const gridStart = new Date(firstDay);
  gridStart.setDate(firstDay.getDate() - mondayOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return date;
  });
}

function CalendarPanel({ onDateSelect }: { onDateSelect?: (date: Date) => void }) {
  const initialDate = useMemo(() => new Date(), []);
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(initialDate.getFullYear(), initialDate.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const calendarDays = useMemo(() => getCalendarDays(visibleMonth), [visibleMonth]);

  function changeMonth(offset: number) {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  }

  function selectDate(date: Date) {
    const nextDate = new Date(date);
    setSelectedDate(nextDate);
    setVisibleMonth(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1));
    onDateSelect?.(nextDate);
  }

  function goToToday() {
    const today = new Date();
    selectDate(today);
  }

  return (
    <section className="calendar-card glass">
      <div className="section-heading calendar-heading">
        <div>
          <span className="eyebrow">Calendario académico</span>
          <h2 aria-live="polite">{monthFormatter.format(visibleMonth)}</h2>
        </div>
        <div className="calendar-controls">
          <button className="calendar-today-button" onClick={goToToday}>Hoy</button>
          <button className="icon-button subtle previous" onClick={() => changeMonth(-1)} aria-label="Mes anterior">
            <Icon name="chevron" size={18} />
          </button>
          <button className="icon-button subtle" onClick={() => changeMonth(1)} aria-label="Mes siguiente">
            <Icon name="chevron" size={18} />
          </button>
        </div>
      </div>
      <div className="calendar-grid weekdays">
        {["L", "M", "M", "J", "V", "S", "D"].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}
      </div>
      <div className="calendar-grid days">
        {calendarDays.map((date) => {
          const outsideMonth = date.getMonth() !== visibleMonth.getMonth();
          const selected = isSameDay(date, selectedDate);
          const today = isSameDay(date, new Date());
          const hasEvent = academicEvents.has(dateKey(date));
          const className = [
            "calendar-day",
            outsideMonth ? "outside-month" : "",
            today ? "today" : "",
            selected ? "selected" : "",
          ].filter(Boolean).join(" ");

          return (
            <button
              className={className}
              key={dateKey(date)}
              onClick={() => selectDate(date)}
              aria-label={fullDateFormatter.format(date)}
              aria-pressed={selected}
              title={fullDateFormatter.format(date)}
            >
              <span>{date.getDate()}</span>
              {hasEvent && <i />}
            </button>
          );
        })}
      </div>
      <div className="calendar-legend"><i /> <span>Próxima entrega: Ensayo de Sociología</span></div>
    </section>
  );
}

function TasksPanel() {
  return (
    <section className="tasks-card glass">
      <div className="section-heading compact">
        <div>
          <span className="eyebrow">En progreso</span>
          <h2>Tareas por hacer</h2>
        </div>
        <span className="task-count">3</span>
      </div>
      <div className="task-list">
        <label><input type="checkbox" /><span><strong>Ensayo de Sociología</strong><small>Hoy · 18:00</small></span></label>
        <label><input type="checkbox" /><span><strong>Guía de Cálculo II</strong><small>Mañana · Alta prioridad</small></span></label>
        <label><input type="checkbox" /><span><strong>Lectura: Capítulo 4</strong><small>Viernes · 45 min</small></span></label>
      </div>
    </section>
  );
}

function AgentInfo({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="agent-modal glass" role="dialog" aria-modal="true" aria-labelledby="agent-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-mark"><Icon name="sparkles" size={24} /></div>
        <button className="icon-button modal-close" onClick={onClose} aria-label="Cerrar"><Icon name="close" /></button>
        <span className="eyebrow">Conoce a tu asistente</span>
        <h2 id="agent-title">Información del agente</h2>
        <p>¡Hola! Soy <strong>AURA equilibrio</strong>, tu asistente de inteligencia artificial universitario. Fui diseñado con el propósito de brindarte acompañamiento académico personalizado, ayudarte a organizar tus asignaturas y optimizar tus tiempos de estudio para prevenir la sobrecarga académica y el estrés universitario.</p>
        <p>Es importante señalar que AURA es una herramienta de apoyo académico e incentivo a la productividad, por lo que <strong>no reemplaza la atención ni el diagnóstico de un profesional de la salud mental o médica</strong>. Si experimentas momentos de sobrecarga emocional, te invitamos a acudir a los servicios de orientación de tu institución.</p>
        <div className="software-info">
          <h3>Información del Software</h3>
          <dl>
            <div><dt>Versión</dt><dd>AURA v2.4 (Academic Edition - Ciudad Aethera)</dd></div>
            <div><dt>Motor</dt><dd>Modelo de Lenguaje para Asistencia Educativa</dd></div>
            <div><dt>Estado del Sistema</dt><dd><span className="status-dot" /> Operativo / Sincronizado con Calendario Universitario</dd></div>
          </dl>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const [dark, setDark] = useState(true);
  const [active, setActive] = useState("chat");
  const [productivityVisible, setProductivityVisible] = useState(true);
  const [infoOpen, setInfoOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<"calendar" | "tasks" | null>(null);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<{ from: "aura" | "user"; text: string }[]>([
    { from: "aura", text: "Hola, Alex. Estoy aquí para ayudarte a ordenar tus pendientes sin dejar de lado tu bienestar. ¿Cómo te encuentras hoy?" },
    { from: "user", text: "Tengo varias entregas esta semana y no sé por dónde empezar." },
    { from: "aura", text: "Vamos paso a paso. Identifiqué tres tareas próximas en tu calendario. Podemos priorizarlas por fecha, esfuerzo y nivel de energía disponible." },
  ]);

  const today = useMemo(() => new Intl.DateTimeFormat("es", { day: "2-digit", month: "short" }).format(new Date()), []);

  function openNav(key: string) {
    setActive(key);
    setDrawerOpen(false);
    if (key === "info") setInfoOpen(true);
    if (key === "calendar") {
      if (window.matchMedia("(max-width: 860px)").matches) {
        setMobilePanel("calendar");
      } else {
        setProductivityVisible((current) => !current);
      }
    }
    if (key === "plan") {
      setDraft("Ayúdame a organizar mi semana según mis tareas pendientes.");
      setMobilePanel(null);
    }
  }

  function submitMessage(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages((current) => [...current, { from: "user", text }, { from: "aura", text: "Perfecto. Voy a considerar tus fechas, prioridades y tiempo disponible para proponerte un plan equilibrado." }]);
    setDraft("");
  }

  return (
    <main className={dark ? "app theme-dark" : "app theme-light"}>
      <header className="topbar glass">
        <div className="brand-group">
          <button className="icon-button mobile-only" onClick={() => setDrawerOpen(true)} aria-label="Abrir menú"><Icon name="menu" /></button>
          <div className="brand-mark"><span>A</span></div>
          <div className="brand-copy"><h1>AURA <em>equilibrio</em></h1><p>Tu tiempo cuenta. Hagámosle espacio.</p></div>
        </div>
        <div className="header-actions">
          <button className="theme-toggle" onClick={() => setDark(!dark)} aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"}>
            <Icon name={dark ? "moon" : "sun"} size={17} />
            <span className="desktop-only">{dark ? "Modo oscuro" : "Modo claro"}</span>
            <i className={dark ? "on" : ""}><b /></i>
          </button>
          <button className="profile-button" aria-label="Abrir perfil">
            <span>AR</span><div className="desktop-only"><strong>Alex Rivera</strong><small>Estudiante</small></div><Icon name="chevron" size={15} />
          </button>
        </div>
      </header>

      <div className={`workspace ${productivityVisible ? "" : "chat-expanded"}`}>
        <aside className={`sidebar glass ${drawerOpen ? "drawer-open" : ""}`}>
          <div className="mobile-drawer-heading"><span>Menú principal</span><button className="icon-button" onClick={() => setDrawerOpen(false)} aria-label="Cerrar menú"><Icon name="close" /></button></div>
          <nav>
            <span className="nav-label">Espacio personal</span>
            {navItems.map((item) => (
              <button
                key={item.key}
                className={`${active === item.key ? "active" : ""} ${item.key === "plan" ? "featured" : ""} ${item.key === "calendar" ? "calendar-toggle" : ""}`}
                onClick={() => openNav(item.key)}
                aria-pressed={item.key === "calendar" ? !productivityVisible : undefined}
              >
                <Icon name={item.icon} size={19} />
                <span>{item.label}</span>
                {(item.key === "plan" || item.key === "calendar") && (
                  <span className={item.key === "calendar" && !productivityVisible ? "toggle-arrow panel-hidden" : "toggle-arrow"}>
                    <Icon name="chevron" size={15} />
                  </span>
                )}
              </button>
            ))}
          </nav>
          <div className="wellbeing-card">
            <div className="wellbeing-ring"><span>72</span><small>%</small></div>
            <div><strong>Ritmo equilibrado</strong><p>Tu carga semanal está dentro de un rango saludable.</p></div>
          </div>
          <div className="sidebar-footer"><span className="status-dot" /> Sistema operativo <small>AURA v2.4</small></div>
        </aside>
        {drawerOpen && <button className="drawer-scrim" onClick={() => setDrawerOpen(false)} aria-label="Cerrar menú" />}

        <section className="chat-shell glass">
          <div className="context-bar">
            <div><span>ESTUDIANTE</span><strong>Alex Rivera</strong></div>
            <div><span>PERÍODO</span><strong>2025 · I</strong></div>
            <div><span>FECHA</span><strong>{today}</strong></div>
            <div className="guided-label"><Icon name="sparkles" size={16} /><strong>Demo guiada</strong></div>
          </div>
          <div className="quick-starts" aria-label="Accesos rápidos">
            {quickStarts.map((label, index) => <button key={label} onClick={() => setDraft(index === 0 ? "Me siento saturado con mis entregas." : label.replace(/^\d\. /, ""))}>{label}</button>)}
          </div>
          <div className="conversation">
            <div className="conversation-date"><span>Hoy</span></div>
            {messages.map((message, index) => (
              <div className={`message-row ${message.from}`} key={`${message.from}-${index}`}>
                {message.from === "aura" && <div className="message-avatar">A</div>}
                <div>
                  <span className="sender">{message.from === "aura" ? "AURA equilibrio" : "Tú"}</span>
                  <div className="message-bubble"><p>{message.text}</p><time>{index < 2 ? "09:4" + (index + 5) : "Ahora"}</time></div>
                  {index === 2 && (
                    <div className="suggestion-actions">
                      <button onClick={() => setDraft("Sí, organicemos mis pendientes.")}>Organizar pendientes</button>
                      <button onClick={() => setMobilePanel("calendar")}>Ver calendario</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <form className="composer" onSubmit={submitMessage}>
            <button type="button" className="icon-button voice" aria-label="Usar voz"><Icon name="mic" /></button>
            <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Cuéntame qué necesitas organizar..." aria-label="Mensaje para AURA" />
            <span className="keyboard-hint">↵</span>
            <button className="send-button" type="submit" aria-label="Enviar mensaje"><Icon name="send" size={19} /></button>
          </form>
        </section>

        <aside className="productivity-panel" aria-hidden={!productivityVisible}>
          <CalendarPanel />
          <TasksPanel />
        </aside>
      </div>

      <nav className="bottom-nav glass">
        <button className={active === "chat" ? "active" : ""} onClick={() => openNav("chat")}><Icon name="home" /><span>Chat</span></button>
        <button className={active === "plan" ? "active" : ""} onClick={() => openNav("plan")}><Icon name="sparkles" /><span>Planificar</span></button>
        <button className={mobilePanel === "calendar" ? "active" : ""} onClick={() => setMobilePanel("calendar")}><Icon name="calendar" /><span>Calendario</span></button>
        <button className={mobilePanel === "tasks" ? "active" : ""} onClick={() => setMobilePanel("tasks")}><Icon name="tasks" /><span>Tareas</span><i>3</i></button>
      </nav>

      {mobilePanel && (
        <div className="mobile-panel-backdrop" onMouseDown={() => setMobilePanel(null)}>
          <div className="mobile-sheet" onMouseDown={(event) => event.stopPropagation()}>
            <div className="sheet-handle" /><button className="icon-button sheet-close" onClick={() => setMobilePanel(null)} aria-label="Cerrar"><Icon name="close" /></button>
            {mobilePanel === "calendar" ? <CalendarPanel /> : <TasksPanel />}
          </div>
        </div>
      )}
      {infoOpen && <AgentInfo onClose={() => setInfoOpen(false)} />}
    </main>
  );
}
