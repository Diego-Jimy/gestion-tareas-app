const STORAGE_KEY = 'taskflow';

let tasks = [];
let filter = 'todas';
let searchQuery = '';
let isDark = false;

// ─ PERSISTENCIA ─
function save() {
localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function load() {
try {
    const raw = localStorage.getItem(STORAGE_KEY);
    tasks = raw ? JSON.parse(raw) : [];
} catch { tasks = []; }
}
