document.addEventListener("DOMContentLoaded", function () {
    var taskInput = document.getElementById("taskInput");
    var addButton = document.querySelector(".input-container button");

    /*if (!taskInput || !addButton) {
        console.error("Task input or button not found. Check your selectors.");
        return;
    }*/

    taskInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            addTask();
        }
    });

    addButton.addEventListener("click", addTask);
    addButton.setAttribute('aria-label', 'Add a task');

    var savedTasks = getSavedTasks();
    var taskList = document.getElementById("taskList");

    if (!taskList) {
        console.error("Lista di task non trovata.");
        return;
    }

    taskList.innerHTML = "";

    savedTasks.forEach(function (task) {
        if (task.trim() !== "") {
            var li = document.createElement("li");
            var taskText = task.replace(/ 🗑️ \(completata\) 🗑️/g, "");
            li.innerHTML = taskText + ' <button class="delete-button" aria-label="Delete Task" onclick="removeCompletedTask(this)">Delete</button>';
            taskList.appendChild(li);
        }
    });

    checkAndShowCompletedTasks();

    var resetButton = document.getElementById("resetButton");

    if (resetButton) {
        resetButton.addEventListener("click", resetPage);
        resetButton.setAttribute('aria-label', 'Reset the page');
    }
});

function getSavedTasks() {
    var savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
}

function saveTasks(tasks) {
    // Rimuove l'emoji del cestino per tutti i task
    tasks = tasks.map(task => task.replace(/ 🗑️ \(completata\) 🗑️/g, ""));

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function allTasksCompleted() {
    var taskList = document.getElementById("taskList");

    if (!taskList) {
        console.error("Task list not found. Check your selector.");
        return false;
    }

    var tasks = taskList.getElementsByTagName("li");

    if (tasks.length === 0) {
        return false;
    }

    for (var i = 0; i < tasks.length; i++) {
        if (!tasks[i].classList.contains("completed")) {
            return false;
        }
    }

    return true;
}

function showCompletedTasks() {
    var checklistContainer = document.querySelector(".checklist-container");
    var completedTasksContainer = document.getElementById("completedTasksContainer");

    if (!checklistContainer || !completedTasksContainer) {
        console.error("Containers not found. Check your selectors.");
        return;
    }

    checklistContainer.style.display = "none";
    completedTasksContainer.style.display = "block";

    var completedTaskList = document.getElementById("completedTaskList");

    if (!completedTaskList) {
        console.error("CompletedTaskList not found. Check your selector.");
        return;
    }

    completedTaskList.innerHTML = "";

    var savedTasks = getSavedTasks();
    savedTasks.forEach(function (task) {
        if (task.trim() !== "") {
            var li = document.createElement("li");
            // Remove the " 🗑️" and " (completata)" from the task string
            var taskText = task.replace(" 🗑️", '').replace(" (completata)", '');
            li.textContent = taskText;
            completedTaskList.appendChild(li);
        }
    });
}

function removeCompletedTask(element) {
    var li = element.parentElement;
    li.remove();

    var savedTasks = getSavedTasks();
    var taskText = li.textContent.trim().replace(" (completata)", "");

    var taskIndex = savedTasks.indexOf(taskText);
    if (taskIndex !== -1) {
        savedTasks.splice(taskIndex, 1);
        saveTasks(savedTasks);
        checkAndShowCompletedTasks();
    }
}

function checkAndShowCompletedTasks() {
    var deleteButtons = document.querySelectorAll('.delete-button');
    var allCompleted = allTasksCompleted();

    deleteButtons.forEach(function (button) {
        button.style.display = allCompleted ? 'none' : 'inline-block';
    });

    if (allCompleted) {
        showCompletedTasks();
    }
}

function addTask() {
    var taskInput = document.getElementById("taskInput");
    var taskList = document.getElementById("taskList");

    if (taskInput.value.trim() !== "") {
        var li = document.createElement("li");
        li.classList.add("task-item"); // Add a class to the li for styling
        li.innerHTML = `<div>${taskInput.value}</div>
                        <span class="delete-icon" aria-label="Remove Task" onclick="removeTask(this)">🗑️</span>`;
        li.onclick = function () {
            toggleTaskCompletion(li);
        };
        taskList.appendChild(li);
        taskInput.value = "";

        var savedTasks = getSavedTasks();
        savedTasks.push(li.textContent.trim());
        saveTasks(savedTasks);

        checkAndShowCompletedTasks();
    }
}

function removeTask(element) {
    var li = element.parentElement;
    li.remove();

    var savedTasks = getSavedTasks();
    var taskIndex = savedTasks.indexOf(li.textContent.trim());
    if (taskIndex !== -1) {
        savedTasks.splice(taskIndex, 1);
        saveTasks(savedTasks);
        checkAndShowCompletedTasks();
    }
}

function toggleTaskCompletion(li) {
    li.classList.toggle("completed");

    var savedTasks = getSavedTasks();
    var taskIndex = savedTasks.indexOf(li.textContent.trim());

    if (taskIndex !== -1) {
        if (li.classList.contains("completed")) {
            savedTasks[taskIndex] = li.textContent + " (completata)";
        } else {
            savedTasks[taskIndex] = li.textContent.replace(" (completata)", "");
        }
        saveTasks(savedTasks);
        checkAndShowCompletedTasks();
    }
}

function resetPage() {
    localStorage.clear();
    location.reload();
}