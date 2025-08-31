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
                <li data-filter="all">All Tasks</li>
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

            const input = document.createElement("input");
            input.type = "checkbox";
            input.checked = task.completed;
            input.id = `task-${task.id}`;
            input.dataset.id = task.id;
            input.classList.add("task-checkbox");

            const label = document.createElement("label");
            label.classList.add("task-text");
            label.setAttribute("for", `task-${task.id}`);
            label.textContent = `${task.title} (${task.priority}) - ${task.dueDate || "No Date"}`;

            input.addEventListener("change", () => {
                const isCompleted = logic.toggleTaskCompletion(task.id);
                if (isCompleted) {
                    label.classList.add("completed");
                } else {
                    label.classList.remove("completed");
                }
            })

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.classList.add("delete-btn");
            deleteBtn.dataset.id = task.id;

            const editBtn = document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.classList.add("edit-btn");
            editBtn.dataset.id = task.id;

            const viewBtn = document.createElement("button");
            viewBtn.textContent = "View";
            viewBtn.classList.add("view-btn");
            viewBtn.dataset.id = task.id;

            li.appendChild(input);
            li.appendChild(label);
            li.appendChild(deleteBtn);
            li.appendChild(editBtn);
            li.appendChild(viewBtn);

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
        
            document.getElementById("add-todo-btn").addEventListener("click", () => {
            this.addTodoModal();
        });
    });
    }

    addTodoModal() {
        const modal = document.createElement("div");
        modal.classList.add("todo-modal");
        modal.innerHTML = `
            <form id="todo-form" class="todo-form">
                <h2>Add Todo</h2>
                <label for="todo-title">Title:</label>
                <input type="text" id="todo-title" placeholder="Title" required />
                <label for="todo-details">Details:</label>
                <textarea id="todo-details" placeholder="Description"></textarea>
                <label for="todo-priority">Priority:</label>
                <select id="todo-priority" required>
                    <option value="">Priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <label for="todo-due">Due Date:</label>
                <input type="datetime-local" id="todo-due" />
                <label for="todo-project">Project:</label>
                <select id="todo-project">
                    <option value="">Assign to Project (optional)</option>
                    ${logic.projects.map(p => `<option value="${p.id}">${p.name}</option>`).join("")}
                </select>
                <div class="todo-btn-div">
                    <button type="button" id="cancel-todo-btn" class="cancel-btn">Cancel</button>
                    <button type="submit" class="add-btn">Add</button>
                </div>
            </form>`;

        document.body.appendChild(modal);

        document.getElementById("cancel-todo-btn").onclick = () => modal.remove();

        document.getElementById("todo-form").onsubmit = (e) => {
            e.preventDefault();
            const title = document.getElementById("todo-title").value.trim();
            const details = document.getElementById("todo-details").value.trim();
            const priority = document.getElementById("todo-priority").value;
            const dueDate = document.getElementById("todo-due").value;
            const projectId = document.getElementById("todo-project").value || null;

            if (!title || !priority) return;

            logic.addTask(title, details, dueDate, priority, projectId);
            modal.remove();
            this.refresh();
        };
    }

    refresh() {
        this.root.innerHTML = "";
        this.renderSidebar();
        this.renderTasks(logic.tasks);
    }
}
