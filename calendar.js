let currentDate = new Date();

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  const calendarHeader = document.getElementById('calendar-header');
  calendarHeader.textContent = `${monthNames[month]} ${year}`;
  
  const calendarGrid = document.getElementById('calendar-grid');
  calendarGrid.innerHTML = '';
  
  // Días de la semana
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  dayNames.forEach(day => {
    const dayEl = document.createElement('div');
    dayEl.className = 'calendar-day-name';
    dayEl.textContent = day;
    calendarGrid.appendChild(dayEl);
  });
  
  // Espacios vacíos antes del primer día
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarGrid.appendChild(document.createElement('div'));
  }
  
  // Días del mes
  const events = getEvents();
  for (let day = 1; day <= daysInMonth; day++) {
    const dayEl = document.createElement('div');
    dayEl.className = 'calendar-day';
    
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEvents = events.filter(ev => ev.date === dateStr);
    
    const dayNum = document.createElement('div');
    dayNum.className = 'calendar-day-number';
    dayNum.textContent = day;
    dayEl.appendChild(dayNum);
    
    if (dayEvents.length > 0) {
      const badge = document.createElement('div');
      badge.className = 'calendar-event-badge';
      badge.textContent = dayEvents.length;
      dayEl.appendChild(badge);
    }
    
    dayEl.addEventListener('click', () => showDayEvents(dateStr, dayEvents));
    calendarGrid.appendChild(dayEl);
  }
}

function showDayEvents(dateStr, dayEvents) {
  const dayEventsSection = document.getElementById('day-events-section');
  const dayEventsTitle = document.getElementById('day-events-title');
  const dayEventsList = document.getElementById('day-events-list');
  
  dayEventsTitle.textContent = `Eventos del ${dateStr}`;
  dayEventsList.innerHTML = '';
  
  if (dayEvents.length === 0) {
    dayEventsList.innerHTML = '<p>No hay eventos en este día.</p>';
  } else {
    dayEvents.forEach(ev => {
      const card = document.createElement('div');
      card.className = 'event-card';
      
      const info = document.createElement('div');
      info.className = 'event-info';
      
      const titleEl = document.createElement('div');
      titleEl.className = 'event-title';
      titleEl.textContent = ev.title;
      
      const metaEl = document.createElement('div');
      metaEl.className = 'event-meta';
      metaEl.textContent = ev.time ? `Hora: ${ev.time}` : 'Sin hora especificada';
      
      info.appendChild(titleEl);
      info.appendChild(metaEl);
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = 'Eliminar';
      deleteBtn.addEventListener('click', () => {
        deleteEvent(ev.id);
        renderCalendar();
        showDayEvents(dateStr, getEvents().filter(e => e.date === dateStr));
      });
      
      card.appendChild(info);
      card.appendChild(deleteBtn);
      dayEventsList.appendChild(card);
    });
  }
}

function previousMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
}

function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
}
