class UI {
  constructor() {
    this.budgetFeedback = document.querySelector(".budget-feedback");
    this.expenseFeedback = document.querySelector(".expense-feedback");
    this.budgetForm = document.getElementById("budget-form");
    this.budgetInput = document.getElementById("budget-input");
    this.budgetAmount = document.getElementById("budget-amount");
    this.expenseAmount = document.getElementById("expense-amount");
    this.balance = document.getElementById("balance");
    this.balanceAmount = document.getElementById("balance-amount");
    this.expenseForm = document.getElementById("expense-form");
    this.expenseInput = document.getElementById("expense-input");
    this.amountInput = document.getElementById("amount-input");
    this.expenseList = document.getElementById("expense-list");
    this.itemList = [];
    this.itemID = 0;
  }
  // Submit budget method
  submitBudgetForm() {
    const value = this.budgetInput.value;
    if (value === "" || value < 0) {
      this.budgetFeedback.classList.add("showItem");
      this.budgetFeedback.innerHTML = `<p>value cannot be empty or negetive</p>`;
      const self = this;

      //If use arrow function in the setTimeout then no need to use outside stored 'this' valu into any var instade of directly use 'this' keyword.
      setTimeout(function () {
        self.budgetFeedback.classList.remove("showItem");
      }, 3000);
    }
    this.budgetAmount.textContent = value;
    this.budgetInput.value = "";
    this.showBalance();
  }

  // Submit Expense method
  submitExpenseForm() {
    const expenseValue = this.expenseInput.value;
    const amountValue = this.amountInput.value;

    if (expenseValue === "" || amountValue < 0 || amountValue === "") {
      this.expenseFeedback.classList.add("showItem");
      this.expenseFeedback.innerHTML = `<p>Form cannot be empty or negetive value</p>`;

      setTimeout(() => {
        this.expenseFeedback.classList.remove("showItem");
      }, 3000);
    } else {
      const amount = parseInt(amountValue);
      this.expenseInput.value = "";
      this.amountInput.value = "";

      const exprense = {
        id: this.itemID,
        title: expenseValue,
        amount,
      };
      this.itemID++;
      this.itemList.push(exprense);
      console.log(this.itemList);
      this.addExpense(exprense);
      this.showBalance();
    }
  }

  //Show Balance
  showBalance() {
    const expense = this.totalExpense();
    const total = parseInt(this.budgetAmount.textContent) - expense;
    this.balanceAmount.textContent = total;
    if (total < 0) {
      this.balance.classList.remove("showGreen", "showBlack");
      this.balance.classList.add("showRed");
    }
    if (total > 0) {
      this.balance.classList.remove("showRed", "showBlack");
      this.balance.classList.add("showGreen");
    }
    if (total === 0) {
      this.balance.classList.remove("showRed", "showGreen");
      this.balance.classList.add("showBlack");
    }
  }
  // Expense Amount
  totalExpense() {
    let total = 0;
    if (this.itemList.length > 0) {
      total = this.itemList.reduce((accumulate, current) => {
        // console.log(`The acc value is ${accumulate} and current value is ${current.amount}`);
        accumulate = accumulate + current.amount;
        return accumulate;
      }, 0);
    }
    this.expenseAmount.textContent = total;
    return total;
  }

  // Expense List
  addExpense(expense) {
    const div = document.createElement("div");
    div.classList.add("expense");
    div.innerHTML = `
      <div
        class="expense-item d-flex justify-content-between align-items-baseline"
      >
        <h6 class="expense-title mb-0 text-uppercase list-item">
          - ${expense.title}
        </h6>
        <h5 class="expense-amount mb-0 list-item">${expense.amount}</h5>

        <div class="expense-icons list-item">
          <a
            href="#"
            class="edit-icon mx-2"
            data-id="${expense.id}"
          >
            <i class="fas fa-edit"></i>
          </a>
          <a href="#" class="delete-icon" data-id="${expense.id}">
            <i class="fas fa-trash"></i>
          </a>
        </div>
      </div>

    `;
    this.expenseList.appendChild(div);
  }
  // Edit Expense
  editExpense(element) {
    const id = parseInt(element.dataset.id);
    const parent = element.parentElement.parentElement.parentElement;
    this.expenseList.removeChild(parent);
    const expense = this.itemList.filter((item) => item.id === id);
    this.expenseInput.value = expense[0].title;
    this.amountInput.value = expense[0].amount;

    let tempList = this.itemList.filter((item) => item.id !== id);
    this.itemList = tempList;

    this.showBalance();
  }
  // Delete Expense
  deleteExpense(element) {
    let id = parseInt(element.dataset.id);
    console.log(id);
    let parent = element.parentElement.parentElement.parentElement;
    // remove from dom
    // this.expenseList.removeChild(parent);
    const expense = this.expenseList.querySelectorAll(".expense");
    expense.forEach((item) => {
      item.remove(parent);
    });

    // delete item
    let tempList = this.itemList.filter(function (expense) {
      return expense.id !== id;
    });

    this.itemList = tempList;
    this.showBalance();
  }
}

const eventListeners = () => {
  const budgetForm = document.getElementById("budget-form");
  const expenseForm = document.getElementById("expense-form");
  const expenseList = document.getElementById("expense-list");

  const ui = new UI();

  budgetForm.addEventListener("submit", (e) => {
    e.preventDefault();
    ui.submitBudgetForm();
  });
  expenseForm.addEventListener("submit", (e) => {
    e.preventDefault();
    ui.submitExpenseForm();
  });
  expenseList.addEventListener("click", (e) => {
    if (e.target.parentElement.classList.contains("edit-icon")) {
      ui.editExpense(e.target.parentElement);
    } else if (e.target.parentElement.classList.contains("delete-icon")) {
      ui.deleteExpense(e.target.parentElement);
    }
  });
};

window.addEventListener("DOMContentLoaded", () => {
  eventListeners();
});
