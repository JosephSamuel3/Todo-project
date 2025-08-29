// index.js
import { DOMManager } from "./modules/domManager.js";
import { logic } from "./modules/logic.js";

const appRoot = document.getElementById("app");

const domManager = new DOMManager(appRoot);

// Initial setup
logic.addProject("Personal");
logic.addProject("Work");
logic.addTask("Buy groceries", "Milk, eggs, bread", "2025-08-30", "high", logic.projects[0].id);
logic.addTask("Finish report", "Quarterly report", "2025-08-31", "medium", logic.projects[1].id);

domManager.refresh();