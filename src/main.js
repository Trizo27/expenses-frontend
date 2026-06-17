const API = '/api/expenses';

const form = document.getElementById('expense-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const dateInput = document.getElementById('date');
const expensesList = document.getElementById('expenses-list');
const totalEl = document.getElementById('total');

fetchExpenses();

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  await addExpense();
});

async function fetchExpenses() {
  try {
    const res = await fetch(API);
    const expenses = await res.json();
    renderExpenses(expenses);
  } catch (error) {
    expensesList.innerHTML = '<div class="empty">Error al cargar los gastos</div>';
  }
}

async function addExpense() {
  const expense = {
    description: descriptionInput.value,
    amount: parseFloat(amountInput.value),
    category: categoryInput.value,
    date: dateInput.value,
  };
  try {
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense),
    });
    form.reset();
    fetchExpenses();
  } catch (error) {
    console.error('Error al agregar gasto:', error);
  }
}

async function deleteExpense(id) {
  try {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    fetchExpenses();
  } catch (error) {
    console.error('Error al eliminar gasto:', error);
  }
}

function formatAmount(amount) {
  return parseFloat(amount).toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function renderExpenses(expenses) {
  if (expenses.length === 0) {
    expensesList.innerHTML = '<div class="empty">No hay gastos registrados todavía</div>';
    totalEl.textContent = '$0,00';
    return;
  }

  const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  totalEl.textContent = `$${formatAmount(total)}`;

  expensesList.innerHTML = expenses.map(e => `
    <div class="expense-item">
      <div class="expense-info">
        <span class="expense-description">${e.description}</span>
        <span class="expense-meta">${e.category} · ${formatDate(e.date)}</span>
      </div>
      <div class="expense-right">
        <span class="expense-amount">$${formatAmount(e.amount)}</span>
        <button class="delete-btn" onclick="deleteExpense(${e.id})">🗑️</button>
      </div>
    </div>
  `).join('');
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

window.deleteExpense = deleteExpense;
