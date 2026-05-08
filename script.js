 // ─ STADOS ─
  function updateStats() {
    const total = tasks.length;
    const done = tasks.filter(t => t.done).length;
    const urgent = tasks.filter(t => t.priority === 'alta' && !t.done).length;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
 
    document.getElementById('statTotal').textContent = total;
    document.getElementById('statProgress').textContent = pct + '%';
    document.getElementById('progressBar').style.width = pct + '%';
    document.getElementById('statUrgent').textContent = urgent;
  }
 
  // ─ RENDER ─
  function getFiltered() {
    return tasks.filter(t => {
      const matchFilter =
        filter === 'todas' ? true :
        filter === 'pendientes' ? !t.done :
        t.done;
      const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchFilter && matchSearch;
    });
  }
 
  function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
  }
 
  function priorityLabel(p) {
    return p === 'alta' ? 'Alta' : p === 'media' ? 'Media' : 'Baja';
  }
 
  function priorityClass(p) {
    return p === 'alta' ? 'badge-high' : p === 'media' ? 'badge-med' : 'badge-low';
  }
 
  function render() {
    updateStats();
    const list = document.getElementById('taskList');
    const filtered = getFiltered();
 
    if (filtered.length === 0) {
      const msg = searchQuery
        ? `No hay tareas que coincidan con "<strong>${searchQuery}</strong>"`
        : filter === 'completadas' ? 'Aún no has completado tareas 💪'
        : filter === 'pendientes' ? '¡Todo al día! No hay pendientes.'
        : 'Agrega tu primera tarea arriba ↑';
      list.innerHTML = `<div class="empty-state">
        <span class="empty-icon">${searchQuery ? '🔍' : filter === 'completadas' ? '🏆' : '📋'}</span>
        <div class="empty-title">${searchQuery ? 'Sin resultados' : 'Sin tareas'}</div>
        <div class="empty-sub">${msg}</div>
      </div>`;
      return;
    }
 
    list.innerHTML = filtered.map(t => `
      <div class="task-item${t.done ? ' done' : ''}" role="listitem" data-id="${t.id}">
        <div class="task-check${t.done ? ' checked' : ''}" role="checkbox" aria-checked="${t.done}"
             tabindex="0" aria-label="Marcar tarea ${t.done ? 'como pendiente' : 'como completada'}"
             onclick="toggleTask('${t.id}')" onkeydown="if(event.key==='Enter'||event.key===' ')toggleTask('${t.id}')">
          <span class="check-icon">✓</span>
        </div>
        <div class="task-body">
          <div class="task-name" title="${escHtml(t.name)}">${escHtml(t.name)}</div>
          <div class="task-meta">
            <span class="priority-badge ${priorityClass(t.priority)}">${priorityLabel(t.priority)}</span>
            <span class="task-date">${formatDate(t.createdAt)}</span>
          </div>
        </div>
        <button class="btn-delete" title="Eliminar tarea" aria-label="Eliminar tarea ${escHtml(t.name)}"
                onclick="deleteTask('${t.id}')">🗑</button>
      </div>
    `).join('');
  }
 
  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }