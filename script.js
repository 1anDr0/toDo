const addToList = document.getElementById("addToList");
const taskList = document.getElementById("taskList");
const doneList = document.getElementById("doneList");
const myBtn = document.getElementById("myBtn");
const clearBtn = document.getElementById("clearAll");

const warning = document.createElement("p");
warning.id = "warning";
warning.style.color = "red";
warning.style.display = "none";
addToList.parentElement.appendChild(warning);

class TaskPro {
  constructor() {
    clearBtn.disabled = true;
  }

  addTask() {
    const inputText = addToList.value;

    if (!inputText) {
      warning.innerHTML = "Please add something to your list.";
      warning.style.display = "block";
      setTimeout(() => (warning.style.display = "none"), 3000);
      return;
    }
    const task = {
      text: inputText,
      completed: false,
    };

    this.renderTask(task, taskList);
    addToList.value = "";
    this.toggleClearBtn();
  }

  renderTask(task, listElement) {
    const taskItem = this.createTaskItem(task);
    listElement.appendChild(taskItem);
  }

  createTaskItem(task) {
    const taskItem = document.createElement("li");
    taskItem.innerHTML = `<span>${task.text}</span>`;

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    buttonContainer.appendChild(
      this.createButton("Edit", () => this.startEdit(task, taskItem))
    );
    buttonContainer.appendChild(
      this.createButton("Completed", () => this.markAsCompleted(task, taskItem))
    );
    buttonContainer.appendChild(
      this.createButton("Delete", () => this.removeTask(taskItem))
    );

    taskItem.appendChild(buttonContainer);
    return taskItem;
  }

  createButton(text, onClick) {
    const button = document.createElement("button");
    button.textContent = text;
    button.addEventListener("click", onClick);

    if (text === "Edit") button.classList.add("edit-button");
    else if (text === "Completed") button.classList.add("completed-button");
    else if (text === "Delete") button.classList.add("delete-button");

    return button;
  }

  startEdit(task, taskItem) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = task.text;

    taskItem.innerHTML = "";
    taskItem.appendChild(input);

    const saveButton = this.createButton("Save", () =>
      this.saveEdit(task, taskItem, input)
    );
    saveButton.classList.add("edit-button");
    taskItem.appendChild(saveButton);

    const cancelButton = this.createButton("Cancel", () =>
      this.updateTaskDisplay(task, taskItem)
    );
    cancelButton.classList.add("edit-button");
    taskItem.appendChild(cancelButton);
  }

  saveEdit(task, taskItem, input) {
    const newText = input.value;

    if (!newText) {
      warning.innerHTML = "You must have something to do?";
      warning.style.display = "block";
      setTimeout(() => (warning.style.display = "none"), 3000);
      return;
    }

    task.text = newText;
    this.updateTaskDisplay(task, taskItem);
  }

  updateTaskDisplay(task, taskItem) {
    taskItem.innerHTML = `<span>${task.text}</span>`;

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    buttonContainer.appendChild(
      this.createButton("Edit", () => this.startEdit(task, taskItem))
    );

    if (!task.completed) {
      buttonContainer.appendChild(
        this.createButton("Completed", () =>
          this.markAsCompleted(task, taskItem)
        )
      );
    }

    buttonContainer.appendChild(
      this.createButton("Delete", () => this.removeTask(taskItem))
    );

    taskItem.appendChild(buttonContainer);
  }

  removeTask(taskItem) {
    taskItem.remove();
    this.toggleClearBtn();
  }

  markAsCompleted(task, taskItem) {
    task.completed = true;
    taskItem.remove();
    this.updateTaskDisplay(task, taskItem);
    doneList.appendChild(taskItem);
    this.toggleClearBtn();
  }

  clearAllTasks() {
    taskList.innerHTML = "";
    doneList.innerHTML = "";
    this.toggleClearBtn();
  }

  toggleClearBtn() {
    clearBtn.disabled =
      taskList.children.length === 0 && doneList.children.length === 0;
  }
}

const taskManager = new TaskPro();

myBtn.addEventListener("click", () => taskManager.addTask());
clearBtn.addEventListener("click", () => taskManager.clearAllTasks());
