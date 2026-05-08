// ─ MODELO ─
  function createTask(name, priority) {
    return {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      name,
      priority,
      done: false,
      createdAt: new Date().toISOString()
    };
  }
 
  function addTask() {
    const name = document.getElementById('taskInput').value.trim();
    if (!name) { document.getElementById('taskInput').focus(); return; }
    const priority = document.getElementById('prioritySelect').value;
    tasks.unshift(createTask(name, priority));
    document.getElementById('taskInput').value = '';
    save();
    render();
  }
 
  function toggleTask(id) {
    const t = tasks.find(t => t.id === id);
    if (t) { t.done = !t.done; save(); render(); }
  }
 
  function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    save();
    render();
  }