import "./styles.css";
import { DOMManager } from "./modules/domManager.js";
import { logic } from "./modules/logic.js";

const appRoot = document.getElementById("app");

const domManager = new DOMManager(appRoot);

// Initial setup



domManager.refresh();