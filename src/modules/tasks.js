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

   setCompletion() {
    this.completed = !this.completed;
    return this.completed;
  }
}