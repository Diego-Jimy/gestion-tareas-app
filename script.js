 // ─ TEMA ─
function toggleTheme() {
isDark = !isDark;
document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
document.getElementById('themeToggle').textContent = isDark ? '☀️' : '🌙';
localStorage.setItem('taskflow_theme', isDark ? 'dark' : 'light');
}

function loadTheme() {
const stored = localStorage.getItem('taskflow_theme');
if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark = true;
    document.documentElement.setAttribute('data-theme', 'dark');
    document.getElementById('themeToggle').textContent = '☀️';
}
}
 
// ─ EVENTOS ─
document.getElementById('addBtn').addEventListener('click', addTask);
document.getElementById('taskInput').addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });
document.getElementById('themeToggle').addEventListener('click', toggleTheme);
document.getElementById('searchInput').addEventListener('input', e => {
searchQuery = e.target.value;
render();
});
document.querySelectorAll('.filter-tab').forEach(btn => {
btn.addEventListener('click', () => {
    filter = btn.dataset.filter;
    document.querySelectorAll('.filter-tab').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    render();
});
});

load();
loadTheme();
if (tasks.length === 0) {
tasks = [
    createTask('Crear repositorio en GitHub', 'alta'),
    createTask('Configurar GitHub Pages', 'alta'),
    createTask('Diseñar wireframes de la app', 'media'),
    createTask('Implementar filtros por estado', 'media'),
    createTask('Agregar modo oscuro', 'baja'),
];
tasks[2].done = true;
save();
}
render();
  }
 
  function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
  }
 
  function priorityLabel(p) {
    return p === 'alta' ? 'Alta' : p === 'media' ? 'Media' : 'Baja';
  function addTask() {
    const name = document.getElementById('taskInput').value.trim();
    if (!name) { document.getElementById('taskInput').focus(); return; }
    const priority = document.getElementById('prioritySelect').value;
    tasks.unshift(createTask(name, priority));
    document.getElementById('taskInput').value = '';
    save();
    render();
// ─ PERSISTENCIA ─
  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
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
