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