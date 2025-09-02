import trash from "../asset/trash-can-outline.svg"
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
                <li data-filter="All Tasks">All Tasks</li>
                <li data-filter="Today">Today</li>
                <li data-filter="Upcoming">Upcoming</li>
                <li data-filter="Overdue">Overdue</li>
            </ul>
            <h3>Projects</h3>
            <ul id="project-list"></ul>
            <button id="add-project-btn">+ Add Project</button>
        `;

        this.root.appendChild(sidebar);
        this.bindSidebarEvents();
    }

    renderProjects() {
        const ul = document.getElementById("project-list");
        if (!ul) return;

        ul.innerHTML = ""; // clear existing list

        logic.projects.forEach(project => {
            const li = document.createElement("li");
            li.classList.add("project-item");
            li.dataset.id = project.id;

            // project name span
            const nameSpan = document.createElement("span");
            nameSpan.textContent = project.name;

            // delete button
            const deleteBtn = document.createElement("div");
            deleteBtn.classList.add("delete-project-btn");

            // clicking project name loads tasks
            nameSpan.addEventListener("click", () => {
                const tasks = logic.getTasksByProject(project.id);
                this.renderTasks(tasks, project.name);
            });

            // clicking delete button removes project
            deleteBtn.addEventListener("click", (e) => {
                e.stopPropagation(); // don’t trigger li click
                logic.removeProject(project.id);
                this.renderProjects();
                this.refresh() // re-render project list
            });

            li.appendChild(nameSpan);
            li.appendChild(deleteBtn);
            ul.appendChild(li);
        });
    }

    createTaskElement(task) {
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

        const dot = document.createElement("span");
        dot.classList.add("priority-dot", `priority-${task.priority || "default"}`);

        label.appendChild(dot);
        label.appendChild(document.createTextNode(`${task.title} - ${task.dueDate || "No Date"}`));

        if (task.completed) label.classList.add("completed");

        // buttons
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.dataset.id = task.id;

        const viewBtn = document.createElement("button");
        viewBtn.textContent = "View";
        viewBtn.classList.add("view-btn");
        viewBtn.dataset.id = task.id;

        // attach event listeners
        input.addEventListener("change", () => {
            const isCompleted = logic.toggleTaskCompletion(task.id);
            label.classList.toggle("completed", isCompleted);
        });

        deleteBtn.addEventListener("click", () => {
            logic.removeTask(task.id);
            this.refresh(); // re-render after delete
        });

        viewBtn.addEventListener("click", () => {
            this.viewTask(task); // custom modal function
        });

        li.appendChild(input);
        li.appendChild(label);
        li.appendChild(deleteBtn);
        li.appendChild(viewBtn);

        return li;
    }

    viewTask(task){
        const existingTaskModal = document.querySelector('.view-todo-modal');
        if (existingTaskModal) existingTaskModal.remove();
    
        // Modal overlay
        const overlay = document.createElement('div');
        overlay.classList.add('modal-overlay');
    
        // Modal content
        const viewModal = document.createElement('div');
        viewModal.classList.add('view-todo-modal');
    
        // Priority color
        const priorityDot = `<span class="priority-dot priority-${task.priority || "default"}"></span>`;
    
        viewModal.innerHTML = `
            <div class="modal-header">
                <h2>${priorityDot}${task.title}</h2>
                <button class="close-modal-btn" title="Close">&times;</button>
            </div>
            <div class="modal-body">
                <div><strong>Details:</strong></div>
                <div>${task.details || "No details provided."}</div>
                <div style="margin-top:1em;"><strong>Due Date:</strong> ${task.dueDate || "No date"}</div>
                <div><strong>Priority:</strong> ${task.priority}</div>
                ${task.projectId ? `<div><strong>Project:</strong> ${logic.getProjectName(task.projectId)}</div>` : ""}
            </div>
        `;
    
        overlay.appendChild(viewModal);
        document.body.appendChild(overlay);
    
        // Close button event
        viewModal.querySelector('.close-modal-btn').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });
    }

    renderTasks(tasks, headerText = 'All Tasks') {
        const main = document.querySelector(".main") || document.createElement("div");
        main.classList.add("main")
        if(!main) return;

        main.innerHTML = "";

        // Header
        const header = document.createElement("h2");
        header.textContent = headerText;
        main.appendChild(header);

        // Task list
        const ul = document.createElement("ul");
        ul.classList.add("task-list");

        tasks.forEach(task => {
            ul.appendChild(this.createTaskElement(task));
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
                this.renderTasks(tasks, filter);
        });


        
            document.getElementById("add-todo-btn").addEventListener("click", () => {
            this.addTodoModal();
        });
    });
    }

    addTodoModal() {
        const existingModal = document.querySelector(".todo-modal");
        if (existingModal) existingModal.remove();

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
                    <option value="" selected disable hidden>Priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <label for="todo-due">Due Date:</label>
                <input type="date" id="todo-due" />
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

        modal.querySelector("#cancel-todo-btn").addEventListener('click', () => modal.remove());

        modal.querySelector("#todo-form").addEventListener('submit', (e) => {
            e.preventDefault();
            const title = modal.querySelector("#todo-title").value.trim();
            const details = modal.querySelector("#todo-details").value.trim();
            const priority =modal.querySelector("#todo-priority").value;
            const dueDate = modal.querySelector("#todo-due").value;
            const projectId = modal.querySelector("#todo-project").value || null;

            if (!title || !priority || !dueDate) return;

            logic.addTask(title, details, dueDate, priority, projectId);
            modal.remove();
            this.refresh();
        });
    }

    refresh() {
        this.root.innerHTML = "";
        this.renderSidebar();
        this.renderProjects();
        this.renderTasks(logic.tasks);
    }
}
