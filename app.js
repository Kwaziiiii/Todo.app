const input = document.querySelector(".todo-input");
const submit = document.querySelector(".submit");
const allTodos = document.querySelector(".all-todos");

function deleteTodo(value) {
  let arrayFromLS = JSON.parse(localStorage.getItem("todos")) || [];
  todosArray = arrayFromLS.filter((todo) => todo != value);
  localStorage.setItem("todos", JSON.stringify(todosArray));
  renderTodos(todosArray);
}

function displayTodo(value) {
  const todo = document.createElement("div");
  todo.classList.add("todo");

  const content = document.createElement("p");
  const check = document.createElement("input");
  check.type = "checkbox";

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "×";

  content.textContent = value;

  check.addEventListener("change", () => {
    todo.classList.toggle("checked", check.checked);
  });

  closeBtn.addEventListener("click", () => {
    deleteTodo(value);
  });

  todo.append(check, content, closeBtn);
  allTodos.appendChild(todo);
}

function renderTodos(todos) {
  allTodos.innerHTML = "";
  todos.forEach((item) => {
    displayTodo(item);
  });
}

let todosArray = [];

if (JSON.parse(localStorage.getItem("todos"))) {
  todosArray = JSON.parse(localStorage.getItem("todos"));
  renderTodos(todosArray);
}

submit.addEventListener("click", () => {
  const value = input.value.trim();
  if (!value) return;

  displayTodo(value);
  todosArray.push(value);
  localStorage.setItem("todos", JSON.stringify(todosArray));
  input.value = "";
});
