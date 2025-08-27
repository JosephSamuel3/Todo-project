// project.js
import { Task } from './tasks.js';

export class Project {
    constructor(name) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.tasks = [];
    }

    // methods to manage tasks within the project
    addTask(task) {
        if (task instanceof Task) {
            this.tasks.push(task);
        }
    }

    removeTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
    }

    getTasks() {
        return this.tasks;
    }

    getTaskId(taskId) {
        return this.tasks.find(task => task.id === taskId);
    }

    updateTask(taskId, updatedFields) {
        const taskToUpdate = this.getTaskId(taskId);
        if (taskToUpdate) {
            if(updatedFields.title) taskToUpdate.title = updatedFields.title;
            if(updatedFields.details) taskToUpdate.details = updatedFields.details;
            if(updatedFields.dueDate) taskToUpdate.dueDate = updatedFields.dueDate;
            if(updatedFields.priority) taskToUpdate.setPriority(updatedFields.priority);
            return true;
        }
        return false;
    }

}

function createProject(name) {
    return new Project(name);
}

function deleteProject(projects, projectId) {
    return projects.filter(project => project.id !== projectId);
}