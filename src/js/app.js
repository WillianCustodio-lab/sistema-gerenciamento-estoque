const { InventoryError, InventoryService } = window.InventoryDomain;
const { LocalStorageRepository } = window.InventoryStorage;
const byId = (id) => document.getElementById(id);
const numberFormat = new Intl.NumberFormat("pt-BR");
const dateFormat = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" });

function setMessage(element, text, type = "") {
  element.className = type ? "message " + type : "message";
  element.textContent = text;
}

function cell(value, className = "") {
  const element = document.createElement("td");
  element.className = className;
  element.append(value);
  return element;
}

function badge(text, tone) {
  const element = document.createElement("span");
  element.className = "badge " + tone;
  element.textContent = text;
  return element;
}

function row(...cells) {
  const element = document.createElement("tr");
  element.append(...cells);
  return element;
}

function searchKey(text) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
}

function setupNavigation() {
  const sections = ["visao-geral", "produtos", "movimentacoes"];
  const links = document.querySelectorAll("nav a");
  function navigate(moveFocus) {
    const target = window.location.hash.slice(1);
    const current = sections.includes(target) ? target : sections[0];
    sections.forEach((id) => { byId(id).hidden = id !== current; });
    links.forEach((link) => {
      if (link.hash === "#" + current) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    if (moveFocus) byId(current).querySelector("h1").focus();
  }
  window.addEventListener("hashchange", () => navigate(true));
  navigate(false);
}

function movementRow(movement) {
  const date = new Date(movement.createdAt);
  const when = Number.isNaN(date.getTime()) ? "Data indisponível" : dateFormat.format(date);
  const isExit = movement.type === "Saída";
  return row(
    cell(when),
    cell(movement.productName + " (" + movement.productCode + ")"),
    cell(badge(movement.type, isExit ? "negative" : "positive")),
    cell(numberFormat.format(movement.quantity), "numeric"),
  );
}

function renderMovementTable(prefix, movements) {
  byId(prefix + "-list").replaceChildren(...movements.map(movementRow));
  byId(prefix + "-table").hidden = movements.length === 0;
  byId(prefix + "-empty").hidden = movements.length !== 0;
}

function setupInventory() {
  const service = new InventoryService(new LocalStorageRepository());
  const productDialog = byId("product-dialog");
  const productForm = byId("product-form");
  const productSearch = byId("product-search");
  const movementForm = byId("movement-form");
  const movementProduct = byId("movement-product");

  function renderProducts() {
    const products = service.getProducts();
    const query = searchKey(productSearch.value);
    const matches = products.filter(({ code, name }) =>
      searchKey(code).includes(query) || searchKey(name).includes(query),
    );
    byId("product-list").replaceChildren(...matches.map((product) => row(
      cell(product.code),
      cell(product.name),
      cell(product.category || "Sem categoria"),
      cell(numberFormat.format(product.quantity), "numeric"),
      cell(product.quantity === 0 ? badge("Sem estoque", "negative") : badge("Disponível", "positive")),
    )));
    byId("product-count").textContent = matches.length + (matches.length === 1 ? " produto" : " produtos");
    byId("products-empty").textContent = products.length
      ? "Nenhum produto corresponde à pesquisa."
      : "Nenhum produto cadastrado. Use Novo produto para começar.";
    byId("products-empty").hidden = matches.length !== 0;
    byId("product-table").hidden = matches.length === 0;
  }

  function updateBalance() {
    const product = service.getProducts().find(({ code }) => code === movementProduct.value);
    byId("movement-balance").textContent = product
      ? "Saldo disponível: " + numberFormat.format(product.quantity)
      : "";
  }

  function render() {
    const products = service.getProducts();
    const movements = service.getMovements();
    byId("total-products").textContent = numberFormat.format(products.length);
    byId("total-units").textContent = numberFormat.format(products.reduce((sum, product) => sum + product.quantity, 0));
    byId("total-out").textContent = numberFormat.format(products.filter((product) => product.quantity === 0).length);
    renderProducts();
    renderMovementTable("recent", movements.slice(0, 5));
    renderMovementTable("history", movements);
    const selectedCode = movementProduct.value;
    movementProduct.replaceChildren(
      new Option(products.length ? "Selecione um produto" : "Nenhum produto cadastrado", ""),
      ...products.map(({ name, code }) => new Option(name + " (" + code + ")", code)),
    );
    if (products.some(({ code }) => code === selectedCode)) movementProduct.value = selectedCode;
    byId("movement-fields").disabled = products.length === 0;
    byId("movement-no-products").hidden = products.length !== 0;
    updateBalance();
  }

  function reportError(element, error) {
    const message = error instanceof InventoryError
      ? error.message
      : "Não foi possível salvar os dados. Confira o armazenamento do navegador e tente novamente.";
    setMessage(element, message, "error");
  }

  productSearch.addEventListener("input", renderProducts);
  movementProduct.addEventListener("change", updateBalance);
  byId("new-product").addEventListener("click", () => {
    productForm.reset();
    setMessage(byId("product-message"), "");
    setMessage(byId("product-notice"), "");
    productDialog.showModal();
  });
  byId("cancel-product").addEventListener("click", () => productDialog.close());

  productForm.addEventListener("submit", (event) => {
    event.preventDefault();
    try {
      service.registerProduct(Object.fromEntries(new FormData(productForm)));
    } catch (error) {
      reportError(byId("product-message"), error);
      return;
    }
    productSearch.value = "";
    render();
    productDialog.close();
    setMessage(byId("product-notice"), "Produto cadastrado com sucesso.", "success");
  });

  movementForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const { type, productCode, quantity } = Object.fromEntries(new FormData(movementForm));
    let product;
    try {
      ({ product } = service.registerMovement(type, productCode, quantity));
    } catch (error) {
      reportError(byId("movement-message"), error);
      return;
    }
    render();
    movementForm.elements.namedItem("quantity").value = "1";
    setMessage(byId("movement-message"), type + " registrada para " + product.name + ".", "success");
  });

  render();
}

setupNavigation();
try {
  setupInventory();
} catch (error) {
  const message = byId("startup-error");
  message.hidden = false;
  message.textContent = "Não foi possível carregar os dados do estoque. Confira o armazenamento do navegador.";
  byId("new-product").disabled = true;
  byId("movement-fields").disabled = true;
  console.error(error);
}
