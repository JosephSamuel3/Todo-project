// tasks.js
export class Task {
  constructor(title, details, dueDate, priority, projectId) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.details = details || "";
    this.dueDate = dueDate || null; // ISO string
    this.priority = priority || "low"; // "low" | "medium" | "high"
    this.completed = false;
    this.projectId = projectId || null;
  }

  toggleComplete() {
    this.completed = !this.completed;
  }

  setPriority(newlevel) {
    const validLevels = ["low", "medium", "high"];
    if (validLevels.includes(newlevel)) {
        this.priority = newlevel;
    }
  }

  updateDetails(details) {
    this.details = details;
  }
}

// Utility helpers
export function isOverdue(task) {
  return task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
}

export function isToday(task) {
  const today = new Date().toDateString();
  return task.dueDate && new Date(task.dueDate).toDateString() === today;
}

export function isUpcoming(task) {
  return task.dueDate && new Date(task.dueDate) > new Date();
}
