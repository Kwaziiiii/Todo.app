const input = document.querySelector(".todo-input");
const submit = document.querySelector(".submit");
const allTodos = document.querySelector(".all-todos");
const trashContainer = document.querySelector(".trash-todos");

let todosArray = JSON.parse(localStorage.getItem("todos")) || [];
let trashArray = JSON.parse(localStorage.getItem("trash")) || [];

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todosArray));
}
function saveTrash() {
  localStorage.setItem("trash", JSON.stringify(trashArray));
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function deleteTodo(timestamp) {
  const index = todosArray.findIndex((todo) => todo.timestamp === timestamp);
  if (index !== -1) {
    const [removed] = todosArray.splice(index, 1);
    trashArray.push(removed);
    saveTodos();
    saveTrash();
    renderAll();
  }
}

function restoreTodo(timestamp) {
  const index = trashArray.findIndex((todo) => todo.timestamp === timestamp);
  if (index !== -1) {
    const [restored] = trashArray.splice(index, 1);
    todosArray.push(restored);
    saveTodos();
    saveTrash();
    renderAll();
  }
}

function permanentlyDelete(timestamp) {
  trashArray = trashArray.filter((todo) => todo.timestamp !== timestamp);
  saveTrash();
  renderAll();
}

function modifyTodo(timestamp, newValue) {
  const index = todosArray.findIndex((todo) => todo.timestamp === timestamp);
  if (index !== -1) {
    todosArray[index].text = newValue;
    saveTodos();
    renderAll();
  }
}

function displayTodo({ text, timestamp }, container, isTrash = false) {
  const todo = document.createElement("div");
  todo.classList.add("todo");

  const topRow = document.createElement("div");
  topRow.classList.add("top-row");

  const content = document.createElement("p");
  content.textContent = text;

  const date = document.createElement("small");
  date.classList.add("date");
  date.textContent = formatDate(timestamp);

  if (!isTrash) {
    const check = document.createElement("input");
    check.type = "checkbox";

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.classList.add("edit-btn");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑";
    deleteBtn.classList.add("delete-btn");

    check.addEventListener("change", () => {
      todo.classList.toggle("checked", check.checked);
    });

    deleteBtn.addEventListener("click", () => {
      deleteTodo(timestamp);
    });

    editBtn.addEventListener("click", () => {
      const editInput = document.createElement("input");
      editInput.type = "text";
      editInput.value = text;
      editInput.classList.add("todo-input");
      content.replaceWith(editInput);
      editInput.focus();

      editInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const newVal = editInput.value.trim();
          if (newVal && newVal !== text) {
            modifyTodo(timestamp, newVal);
          } else {
            renderAll();
          }
        }
      });

      editInput.addEventListener("blur", () => renderAll());
    });

    topRow.append(check, content, editBtn, deleteBtn);
  } else {
    const restoreBtn = document.createElement("button");
    restoreBtn.textContent = "♻️";
    restoreBtn.classList.add("edit-btn");
    restoreBtn.addEventListener("click", () => restoreTodo(timestamp));

    const permDeleteBtn = document.createElement("button");
    permDeleteBtn.textContent = "❌";
    permDeleteBtn.classList.add("delete-btn");
    permDeleteBtn.addEventListener("click", () => permanentlyDelete(timestamp));

    topRow.append(content, restoreBtn, permDeleteBtn);
  }

  todo.append(topRow, date);
  container.appendChild(todo);
}

function renderTodos() {
  allTodos.innerHTML = "";
  todosArray.forEach(todo => displayTodo(todo, allTodos));
}

function renderTrash() {
  trashContainer.innerHTML = "";
  trashArray.forEach(todo => displayTodo(todo, trashContainer, true));
}

function renderAll() {
  renderTodos();
  renderTrash();
}

renderAll();

submit.addEventListener("click", () => {
  const value = input.value.trim();
  if (!value) return;

  const newTodo = {
    text: value,
    timestamp: Date.now()
  };

  todosArray.push(newTodo);
  saveTodos();
  renderAll();
  input.value = "";
});
