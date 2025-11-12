document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const toggle = document.querySelector(".darkmode-toggle");
  const input = document.querySelector('input[type="text"]');
  const footerCount = document.querySelector(".footer div:first-child");
  const filterLinks = document.querySelectorAll(".filter a");
  const clearBtn = document.querySelector(".footer a:last-child");
  const listContainer = document.querySelector(".list"); // container correto para os itens

  let items = [];
  let currentFilter = "todos";

 
  const applyThemeFromStorage = () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      body.classList.add("darkmode");
      toggle.classList.add("active");
    }
  };

  const toggleTheme = () => {
    body.classList.toggle("darkmode");
    toggle.classList.toggle("active");

    const theme = body.classList.contains("darkmode") ? "dark" : "light";
    localStorage.setItem("theme", theme);
  };

  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    toggleTheme();
  });

  applyThemeFromStorage();

  
  const saveItems = () => {
    localStorage.setItem("todoItems", JSON.stringify(items));
  };

  const loadItems = () => {
    const saved = localStorage.getItem("todoItems");
    if (saved) {
      items = JSON.parse(saved);
    } else {
      const htmlItems = document.querySelectorAll(".item");
      items = Array.from(htmlItems).map((item) => ({
        text: item.querySelector("span").textContent,
        done: item.querySelector("input").checked,
      }));
      saveItems();
    }
  };

  
  const renderItems = () => {
    listContainer.innerHTML = ""; 
    items.forEach((todo, index) => {
      const div = document.createElement("div");
      div.className = "item";
      if (todo.done) div.classList.add("item-checked");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = todo.done;
      checkbox.dataset.index = index;

      const span = document.createElement("span");
      span.textContent = todo.text;

      div.appendChild(checkbox);
      div.appendChild(span);
      listContainer.appendChild(div);
    });

    applyFilter(currentFilter);
    updateCounter();
  };


  const updateCounter = () => {
    const ativos = items.filter((i) => !i.done).length;
    footerCount.textContent = `${ativos} item${ativos !== 1 ? "s" : ""} restantes`;
  };

 
  listContainer.addEventListener("change", (e) => {
    if (e.target.matches('input[type="checkbox"]')) {
      const index = e.target.dataset.index;
      items[index].done = e.target.checked;
      saveItems();
      renderItems();
    }
  });

  
  const applyFilter = (type) => {
    currentFilter = type;
    filterLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === "#" + type;
      link.classList.toggle("active", isActive);
      link.setAttribute("aria-pressed", isActive);
    });

    document.querySelectorAll(".item").forEach((item, i) => {
      const isDone = items[i].done;
      switch (type) {
        case "ativos":
          item.style.display = isDone ? "none" : "";
          break;
        case "concluidos":
          item.style.display = isDone ? "" : "none";
          break;
        default:
          item.style.display = "";
      }
    });
  };

  filterLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const tipo = link.getAttribute("href").replace("#", "");
      applyFilter(tipo);
    });
  });

  
  clearBtn.addEventListener("click", (e) => {
    e.preventDefault();
    items = items.filter((item) => !item.done);
    saveItems();
    renderItems();
  });

  
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && input.value.trim() !== "") {
      const text = input.value.trim();
      items.push({ text, done: false });
      input.value = "";
      saveItems();
      renderItems();
    }
  });


  loadItems();
  renderItems();
});
