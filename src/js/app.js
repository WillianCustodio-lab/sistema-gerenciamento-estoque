const STORAGE_KEY = "estoque.produtos";

const form = document.querySelector("#product-form");
const message = document.querySelector("#form-message");
const productList = document.querySelector("#product-list");
const productCount = document.querySelector("#product-count");
const emptyState = document.querySelector("#empty-state");
const tableWrapper = document.querySelector("#table-wrapper");

let products = loadProducts();

function loadProducts() {
  try {
    const storedProducts = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(storedProducts) ? storedProducts : [];
  } catch {
    return [];
  }
}

function saveProducts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function showMessage(text, type) {
  message.textContent = text;
  message.className = `message message--${type}`;
}

function createCell(text, className = "") {
  const cell = document.createElement("td");
  cell.textContent = text;

  if (className) {
    cell.className = className;
  }

  return cell;
}

function renderProducts() {
  productList.replaceChildren();

  products.forEach((product) => {
    const row = document.createElement("tr");
    row.append(
      createCell(product.code),
      createCell(product.name, "product-name"),
      createCell(product.category || "Sem categoria", "muted"),
      createCell(String(product.quantity), "quantity-column"),
    );
    productList.append(row);
  });

  const hasProducts = products.length > 0;
  emptyState.hidden = hasProducts;
  tableWrapper.hidden = !hasProducts;
  productCount.textContent = `${products.length} ${
    products.length === 1 ? "produto" : "produtos"
  }`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const code = data.get("code").trim().toUpperCase();
  const name = data.get("name").trim();
  const category = data.get("category").trim();
  const quantity = Number(data.get("quantity"));

  if (!code || !name || !Number.isInteger(quantity) || quantity < 0) {
    showMessage("Preencha código, nome e uma quantidade inteira válida.", "error");
    return;
  }

  const duplicateCode = products.some((product) => product.code === code);

  if (duplicateCode) {
    showMessage("Já existe um produto cadastrado com esse código.", "error");
    return;
  }

  products.push({ code, name, category, quantity });
  saveProducts();
  renderProducts();
  form.reset();
  document.querySelector("#product-quantity").value = "0";
  document.querySelector("#product-code").focus();
  showMessage("Produto cadastrado com sucesso.", "success");
});

renderProducts();

