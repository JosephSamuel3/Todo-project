import "./styles.css";
import { DOMManager } from "./modules/domManager.js";
import { logic } from "./modules/logic.js";

const appRoot = document.getElementById("app");

const domManager = new DOMManager(appRoot);

// Initial setup
logic.addProject("Default Project");

logic.addTask("Sample Task 1", "do simple task 1 asap", "2024-12-31", "High", logic.projects[0].id);

domManager.refresh();