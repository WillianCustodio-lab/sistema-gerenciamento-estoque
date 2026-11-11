const { InventoryError, InventoryService } = window.InventoryDomain;
const { LocalStorageRepository } = window.InventoryStorage;


const service = new InventoryService(new LocalStorageRepository());

const elements = {
  productForm: document.querySelector("#product-form"),
  productMessage: document.querySelector("#form-message"),
  productList: document.querySelector("#product-list"),
  productCount: document.querySelector("#product-count"),
  productEmptyState: document.querySelector("#empty-state"),
  productTableWrapper: document.querySelector("#table-wrapper"),
  entryForm: document.querySelector("#entry-form"),
  entryMessage: document.querySelector("#entry-message"),
  entryProduct: document.querySelector("#entry-product"),
  entryQuantity: document.querySelector("#entry-quantity"),
  entrySubmit: document.querySelector("#entry-submit"),
  movementList: document.querySelector("#movement-list"),
  movementCount: document.querySelector("#movement-count"),
  movementEmptyState: document.querySelector("#movement-empty-state"),
  movementTableWrapper: document.querySelector("#movement-table-wrapper"),
};

function showMessage(element, text, type) {
  element.textContent = text;
  element.className = `message message--${type}`;
}

function createCell(text, className = "") {
  const cell = document.createElement("td");
  cell.textContent = text;
  cell.className = className;
  return cell;
}

function renderProducts(products) {
  elements.productList.replaceChildren();
  products.forEach((product) => {
    const row = document.createElement("tr");
    row.append(
      createCell(product.code),
      createCell(product.name, "product-name"),
      createCell(product.category || "Sem categoria", "muted"),
      createCell(String(product.quantity), "quantity-column"),
    );
    elements.productList.append(row);
  });

  const hasProducts = products.length > 0;
  elements.productEmptyState.hidden = hasProducts;
  elements.productTableWrapper.hidden = !hasProducts;
  elements.productCount.textContent = `${products.length} ${products.length === 1 ? "produto" : "produtos"}`;
}

function renderProductOptions(products) {
  const selectedCode = elements.entryProduct.value;
  elements.entryProduct.replaceChildren();
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = products.length
    ? "Selecione um produto"
    : "Cadastre um produto primeiro";
  elements.entryProduct.append(placeholder);

  products.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.code;
    option.textContent = `${product.name} (${product.code}) — saldo ${product.quantity}`;
    elements.entryProduct.append(option);
  });

  if (products.some((product) => product.code === selectedCode)) {
    elements.entryProduct.value = selectedCode;
  }

  const hasProducts = products.length > 0;
  elements.entryProduct.disabled = !hasProducts;
  elements.entryQuantity.disabled = !hasProducts;
  elements.entrySubmit.disabled = !hasProducts;
}

function renderMovements(movements) {
  elements.movementList.replaceChildren();
  movements.forEach((movement) => {
    const date = new Date(movement.createdAt);
    const formattedDate = Number.isNaN(date.getTime())
      ? "Data indisponível"
      : date.toLocaleString("pt-BR");
    const row = document.createElement("tr");
    row.append(
      createCell(formattedDate, "muted"),
      createCell(`${movement.productName} (${movement.productCode})`, "product-name"),
      createCell(movement.type, "movement-type"),
      createCell(String(movement.quantity), "quantity-column"),
    );
    elements.movementList.append(row);
  });

  const hasMovements = movements.length > 0;
  elements.movementEmptyState.hidden = hasMovements;
  elements.movementTableWrapper.hidden = !hasMovements;
  elements.movementCount.textContent = `${movements.length} ${movements.length === 1 ? "movimentação" : "movimentações"}`;
}

function renderApplication() {
  const products = service.getProducts();
  renderProducts(products);
  renderProductOptions(products);
  renderMovements(service.getMovements());
}

function handleError(messageElement, error) {
  const message =
    error instanceof InventoryError ? error.message : "Não foi possível concluir a operação.";
  showMessage(messageElement, message, "error");
}

elements.productForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(elements.productForm);
  try {
    service.registerProduct(Object.fromEntries(data));
    renderApplication();
    elements.productForm.reset();
    document.querySelector("#product-quantity").value = "0";
    document.querySelector("#product-code").focus();
    showMessage(elements.productMessage, "Produto cadastrado com sucesso.", "success");
  } catch (error) {
    handleError(elements.productMessage, error);
  }
});

elements.entryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(elements.entryForm);
  try {
    const { product } = service.registerEntry(
      data.get("productCode"),
      data.get("quantity"),
    );
    renderApplication();
    elements.entryQuantity.value = "1";
    showMessage(elements.entryMessage, `Entrada registrada para ${product.name}.`, "success");
  } catch (error) {
    handleError(elements.entryMessage, error);
  }
});

renderApplication();
