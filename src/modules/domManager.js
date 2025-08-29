import { logic } from "./logic.js";

export class DOMManager {
  constructor(rootElement) {
    this.root = rootElement;
  }

  renderSidebar() {
    const sidebar = document.createElement("div");
    sidebar.classList.add("sidebar");

    sidebar.innerHTML = `
      <button id="add-todo-btn">+ Add Todo</button>
      <h3>Views</h3>
      <ul>
        <li data-filter="today">Today</li>
        <li data-filter="upcoming">Upcoming</li>
        <li data-filter="overdue">Overdue</li>
      </ul>
      <h3>Projects</h3>
      <ul id="project-list"></ul>
      <button id="add-project-btn">+ Add Project</button>
    `;

    this.root.appendChild(sidebar);
    this.bindSidebarEvents();
  }

  renderTasks(tasks) {
    const main = document.querySelector(".main") || document.createElement("div");
    main.classList.add("main");
    main.innerHTML = "<h2>Tasks</h2>";

    const ul = document.createElement("ul");
    tasks.forEach(task => {
      const li = document.createElement("li");
      li.textContent = `${task.title} (${task.priority}) - ${task.dueDate || "No Date"}`;
      ul.appendChild(li);
    });

    main.appendChild(ul);
    this.root.appendChild(main);
  }

  bindSidebarEvents() {
    document.getElementById("add-project-btn").addEventListener("click", () => {
      const name = prompt("Project name?");
      if (name) {
        logic.addProject(name);
        this.refresh();
      }
    });

    document.querySelectorAll("[data-filter]").forEach(el => {
      el.addEventListener("click", () => {
        const filter = el.dataset.filter;
        const tasks = logic.getTasksByFilter(filter);
        this.renderTasks(tasks);
      });
    });
  }

  refresh() {
    this.root.innerHTML = "";
    this.renderSidebar();
    this.renderTasks(logic.tasks);
  }
}
