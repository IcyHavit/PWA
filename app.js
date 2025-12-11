const form = document.getElementById('event-form');
const titleInput = document.getElementById('title');
const dateInput = document.getElementById('date');
const timeInput = document.getElementById('time');
const eventsList = document.getElementById('events-list');

const STORAGE_KEY = 'mini-agenda-events';

// Cargar eventos al iniciar
document.addEventListener('DOMContentLoaded', () => {
  renderEvents();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const date = dateInput.value;
  const time = timeInput.value;

  if (!title || !date) {
    alert('Título y fecha son obligatorios');
    return;
  }

  const newEvent = {
    id: Date.now(),
    title,
    date,
    time
  };

  const events = getEvents();
  events.push(newEvent);
  saveEvents(events);

  form.reset();
  renderEvents();
});

function getEvents() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveEvents(events) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function deleteEvent(id) {
  const events = getEvents().filter(ev => ev.id !== id);
  saveEvents(events);
  renderEvents();
}

function renderEvents() {
  const events = getEvents()
    .sort((a, b) => {
      // Ordenar por fecha + hora
      const aKey = a.date + (a.time || '');
      const bKey = b.date + (b.time || '');
      if (aKey < bKey) return -1;
      if (aKey > bKey) return 1;
      return 0;
    });

  eventsList.innerHTML = '';

  if (events.length === 0) {
    eventsList.innerHTML = '<p>No hay eventos registrados.</p>';
    return;
  }

  events.forEach(ev => {
    const card = document.createElement('div');
    card.className = 'event-card';

    const info = document.createElement('div');
    info.className = 'event-info';

    const titleEl = document.createElement('div');
    titleEl.className = 'event-title';
    titleEl.textContent = ev.title;

    const metaEl = document.createElement('div');
    metaEl.className = 'event-meta';

    let text = `Fecha: ${ev.date}`;
    if (ev.time) {
      text += ` · Hora: ${ev.time}`;
    }
    metaEl.textContent = text;

    info.appendChild(titleEl);
    info.appendChild(metaEl);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Eliminar';
    deleteBtn.addEventListener('click', () => deleteEvent(ev.id));

    card.appendChild(info);
    card.appendChild(deleteBtn);
    eventsList.appendChild(card);
  });
}
