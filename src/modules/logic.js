import { Task } from "./tasks.js";
import { Project } from "./project.js";

class Logic {
  constructor() {
    this.projects = [];
    this.tasks = [];
    this.loadFromStorage(); // load data when app starts
  }

  // Project management
  addProject(name) {
    const project = new Project(name);
    this.projects.push(project);
    this.saveToStorage();
    return project;
  }

  removeProject(projectId) {
    this.projects = this.projects.filter(p => p.id !== projectId);
    this.tasks = this.tasks.filter(t => t.projectId !== projectId);
    this.saveToStorage();
  }

  // Task management
  addTask(title, details, dueDate, priority, projectId) {
    const task = new Task(title, details, dueDate, priority, projectId);
    this.tasks.push(task);

    const project = this.projects.find(p => p.id === projectId);
    if (project) project.addTask(task);

    this.saveToStorage();
    return task
  }

  getProjectName(taskId){
    const project = this.projects.find(p => p.id === taskId);
    return project ? project.name : "#default";
  }

  removeTask(taskId) {
    this.tasks = this.tasks.filter(t => t.id !== taskId);
    this.projects.forEach(p => p.removeTask(taskId));
    this.saveToStorage();
  }

  getTasksByProject(projectId){
    return this.tasks.filter(task => task.projectId === projectId)
  }

  getTasksByFilter(filter) {
    const today = new Date().toDateString();
    if (filter === "Today") {
      return this.tasks.filter(t => t.dueDate && new Date(t.dueDate).toDateString() === today);
    }
    if (filter === "Upcoming") {
      return this.tasks.filter(t => t.dueDate && new Date(t.dueDate) > new Date());
    }
    if (filter === "Overdue") {
      return this.tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && !t.completed);
    }
    return this.tasks;
  }

  toggleTaskCompletion(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.setCompletion();
      this.saveToStorage();
      return task.completed;
    }
  }


  // 🔑 Persistence
  saveToStorage() {
    const data = {
      projects: this.projects,
      tasks: this.tasks,
    };
    localStorage.setItem("todoAppData", JSON.stringify(data));
  }

  loadFromStorage() {
    const data = JSON.parse(localStorage.getItem("todoAppData"));
    if (!data) return;

    // Rehydrate Projects
    this.projects = data.projects.map(p => {
      const project = new Project(p.name);
      project.id = p.id;
      project.tasks = p.tasks; // keep task IDs for now
      return project;
    });

    // Rehydrate Tasks
    this.tasks = data.tasks.map(t => {
      const task = new Task(t.title, t.details, t.dueDate, t.priority, t.projectId);
      task.id = t.id;
      task.completed = t.completed;
      return task;
    });
  }
}

export const logic = new Logic();
