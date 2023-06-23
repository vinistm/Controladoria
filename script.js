// Código JavaScript corrigido

function addEntry() {
  const description = document.getElementById("description").value;
  const value = parseFloat(document.getElementById("value").value);
  const type = document.getElementById("type").value;

  if (description.trim() === "" || isNaN(value)) {
    return;
  }

  const entry = {
    description,
    value,
    type,
  };

  if (type === "recurring") {
    const recurringEntries =
      JSON.parse(localStorage.getItem("recurringEntries")) || [];
    recurringEntries.push(entry);
    localStorage.setItem("recurringEntries", JSON.stringify(recurringEntries));
    displayRecurring();
  } else {
    const entries = JSON.parse(localStorage.getItem("entries")) || [];
    entries.push(entry);
    localStorage.setItem("entries", JSON.stringify(entries));
    displayEntries();
  }

  calculateTotals();
  updateBalance();

  document.getElementById("description").value = "";
  document.getElementById("value").value = "";
}

function deleteEntry(index) {
  const entries = JSON.parse(localStorage.getItem("entries")) || [];
  entries.splice(index, 1);
  localStorage.setItem("entries", JSON.stringify(entries));
  displayEntries();
  calculateTotals();
  updateBalance();
}

function deleteRecurring(index) {
  const recurringEntries =
    JSON.parse(localStorage.getItem("recurringEntries")) || [];
  recurringEntries.splice(index, 1);
  localStorage.setItem("recurringEntries", JSON.stringify(recurringEntries));
  displayRecurring();
}

function displayEntries() {
  const entriesDiv = document.querySelector(".entries");
  const expensesDiv = document.querySelector(".expenses");
  entriesDiv.innerHTML = "";
  expensesDiv.innerHTML = "";

  const entries = JSON.parse(localStorage.getItem("entries")) || [];
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const entryDiv = document.createElement("div");
    entryDiv.textContent = `${entry.description} - ${entry.value.toFixed(2)}`;
    if (entry.type === "income") {
      entriesDiv.appendChild(entryDiv);
    } else if (entry.type === "expense") {
      expensesDiv.appendChild(entryDiv);
    }
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.addEventListener("click", () => deleteEntry(i));
    entryDiv.appendChild(deleteButton);
  }
}

function displayRecurring() {
  const recurringDiv = document.querySelector(".recurring");
  recurringDiv.innerHTML = "";

  const recurringEntries =
    JSON.parse(localStorage.getItem("recurringEntries")) || [];
  for (let i = 0; i < recurringEntries.length; i++) {
    const recurringEntry = recurringEntries[i];
    const recurringEntryDiv = document.createElement("div");
    recurringEntryDiv.textContent = `${
      recurringEntry.description
    } - ${recurringEntry.value.toFixed(2)}`;
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.addEventListener("click", () => deleteRecurring(i));
    recurringEntryDiv.appendChild(deleteButton);
    recurringDiv.appendChild(recurringEntryDiv);
  }
}

function calculateTotals() {
  const entries = JSON.parse(localStorage.getItem("entries")) || [];
  let totalEntries = 0;
  let totalExpenses = 0;

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (entry.type === "income") {
      totalEntries += entry.value;
    } else if (entry.type === "expense") {
      totalExpenses += entry.value;
    }
  }

  document.getElementById("total-entries").textContent =
    totalEntries.toFixed(2);
  document.getElementById("total-expenses").textContent =
    totalExpenses.toFixed(2);
}

function updateBalance() {
  const totalEntries = parseFloat(
    document.getElementById("total-entries").textContent
  );
  const totalExpenses = parseFloat(
    document.getElementById("total-expenses").textContent
  );
  const balance = totalEntries - totalExpenses;
  const balanceDiv = document.getElementById("balance");

  if (balance > 0) {
    balanceDiv.textContent = `Sobra de R$ ${balance.toFixed(2)}`;
    balanceDiv.style.color = "green";
  } else if (balance < 0) {
    balanceDiv.textContent = `Falta de R$ ${Math.abs(balance).toFixed(2)}`;
    balanceDiv.style.color = "red";
  } else {
    balanceDiv.textContent = "";
  }
}

function loadEntries() {
  const entries = JSON.parse(localStorage.getItem("entries")) || [];
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const descriptionInput = document.getElementById("description");
    const valueInput = document.getElementById("value");
    const typeInput = document.getElementById("type");

    descriptionInput.value = entry.description;
    valueInput.value = entry.value;
    typeInput.value = entry.type;
  }
}

function loadRecurring() {
  const recurringEntries =
    JSON.parse(localStorage.getItem("recurringEntries")) || [];
  if (recurringEntries.length > 0) {
    const recurringEntry = recurringEntries[0]; // Acessa apenas a primeira entrada recorrente
    const descriptionInput = document.getElementById("description");
    const valueInput = document.getElementById("value");
    const typeInput = document.getElementById("type");

    descriptionInput.value = recurringEntry.description;
    valueInput.value = recurringEntry.value;
    typeInput.value = "recurring";
  }
}

function revealValues() {
  displayEntries();
  displayRecurring();
  calculateTotals();
  updateBalance();
}

// Carrega as entradas ao iniciar a página
loadEntries();
loadRecurring();
