const PRODUCTS_STORAGE_KEY = "estoque.produtos";
const MOVEMENTS_STORAGE_KEY = "estoque.movimentacoes";

class Product {
  constructor(code, name, category, quantity) {
    this.code = code;
    this.name = name;
    this.category = category;
    this.quantity = quantity;
  }

  registerEntry(quantity) {
    this.quantity += quantity;
  }
}

class Movement {
  constructor(product, quantity) {
    this.id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    this.productCode = product.code;
    this.productName = product.name;
    this.type = "Entrada";
    this.quantity = quantity;
    this.createdAt = new Date().toISOString();
  }
}

const productForm = document.querySelector("#product-form");
const productMessage = document.querySelector("#form-message");
const productList = document.querySelector("#product-list");
const productCount = document.querySelector("#product-count");
const productEmptyState = document.querySelector("#empty-state");
const productTableWrapper = document.querySelector("#table-wrapper");

const entryForm = document.querySelector("#entry-form");
const entryMessage = document.querySelector("#entry-message");
const entryProduct = document.querySelector("#entry-product");
const entryQuantity = document.querySelector("#entry-quantity");
const entrySubmit = document.querySelector("#entry-submit");

const movementList = document.querySelector("#movement-list");
const movementCount = document.querySelector("#movement-count");
const movementEmptyState = document.querySelector("#movement-empty-state");
const movementTableWrapper = document.querySelector("#movement-table-wrapper");

let products = loadCollection(PRODUCTS_STORAGE_KEY).map(
  (product) =>
    new Product(
      product.code,
      product.name,
      product.category,
      Number(product.quantity),
    ),
);
let movements = loadCollection(MOVEMENTS_STORAGE_KEY);

function loadCollection(key) {
  try {
    const storedItems = JSON.parse(localStorage.getItem(key));
    return Array.isArray(storedItems) ? storedItems : [];
  } catch {
    return [];
  }
}

function saveCollection(key, items) {
  localStorage.setItem(key, JSON.stringify(items));
}

function showMessage(element, text, type) {
  element.textContent = text;
  element.className = `message message--${type}`;
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
  productEmptyState.hidden = hasProducts;
  productTableWrapper.hidden = !hasProducts;
  productCount.textContent = `${products.length} ${
    products.length === 1 ? "produto" : "produtos"
  }`;
}

function renderEntryOptions() {
  const selectedCode = entryProduct.value;
  entryProduct.replaceChildren();

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = products.length
    ? "Selecione um produto"
    : "Cadastre um produto primeiro";
  entryProduct.append(placeholder);

  products.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.code;
    option.textContent = `${product.name} (${product.code}) — saldo ${product.quantity}`;
    entryProduct.append(option);
  });

  if (products.some((product) => product.code === selectedCode)) {
    entryProduct.value = selectedCode;
  }

  const hasProducts = products.length > 0;
  entryProduct.disabled = !hasProducts;
  entryQuantity.disabled = !hasProducts;
  entrySubmit.disabled = !hasProducts;
}

function renderMovements() {
  movementList.replaceChildren();

  movements.forEach((movement) => {
    const date = new Date(movement.createdAt);
    const formattedDate = Number.isNaN(date.getTime())
      ? "Data indisponível"
      : date.toLocaleString("pt-BR");
    const row = document.createElement("tr");
    row.append(
      createCell(formattedDate, "muted"),
      createCell(
        `${movement.productName} (${movement.productCode})`,
        "product-name",
      ),
      createCell(movement.type, "movement-type"),
      createCell(String(movement.quantity), "quantity-column"),
    );
    movementList.append(row);
  });

  const hasMovements = movements.length > 0;
  movementEmptyState.hidden = hasMovements;
  movementTableWrapper.hidden = !hasMovements;
  movementCount.textContent = `${movements.length} ${
    movements.length === 1 ? "movimentação" : "movimentações"
  }`;
}

function renderApplication() {
  renderProducts();
  renderEntryOptions();
  renderMovements();
}

productForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(productForm);
  const code = data.get("code").trim().toUpperCase();
  const name = data.get("name").trim();
  const category = data.get("category").trim();
  const quantity = Number(data.get("quantity"));

  if (!code || !name || !Number.isInteger(quantity) || quantity < 0) {
    showMessage(
      productMessage,
      "Preencha código, nome e uma quantidade inteira válida.",
      "error",
    );
    return;
  }

  const duplicateCode = products.some((product) => product.code === code);

  if (duplicateCode) {
    showMessage(
      productMessage,
      "Já existe um produto cadastrado com esse código.",
      "error",
    );
    return;
  }

  products.push(new Product(code, name, category, quantity));
  saveCollection(PRODUCTS_STORAGE_KEY, products);
  renderApplication();
  productForm.reset();
  document.querySelector("#product-quantity").value = "0";
  document.querySelector("#product-code").focus();
  showMessage(productMessage, "Produto cadastrado com sucesso.", "success");
});

entryForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(entryForm);
  const productCode = data.get("productCode");
  const quantity = Number(data.get("quantity"));
  const product = products.find((item) => item.code === productCode);

  if (!product) {
    showMessage(entryMessage, "Selecione um produto cadastrado.", "error");
    return;
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    showMessage(
      entryMessage,
      "Informe uma quantidade inteira maior que zero.",
      "error",
    );
    return;
  }

  product.registerEntry(quantity);
  movements.unshift(new Movement(product, quantity));
  saveCollection(PRODUCTS_STORAGE_KEY, products);
  saveCollection(MOVEMENTS_STORAGE_KEY, movements);
  renderApplication();
  entryQuantity.value = "1";
  showMessage(
    entryMessage,
    `Entrada de ${quantity} unidade(s) registrada para ${product.name}.`,
    "success",
  );
});

renderApplication();
