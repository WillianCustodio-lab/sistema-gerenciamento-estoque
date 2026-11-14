const api = window.InventoryApi;
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
  let products = [];
  let movements = [];
  let loading = false;
  let saving = false;
  let hasCurrentData = false;
  const productDialog = byId("product-dialog");
  const productForm = byId("product-form");
  const productSearch = byId("product-search");
  const movementForm = byId("movement-form");
  const movementProduct = byId("movement-product");

  function renderProducts() {
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
    const product = products.find(({ code }) => code === movementProduct.value);
    byId("movement-balance").textContent = product
      ? "Saldo disponível: " + numberFormat.format(product.quantity)
      : "";
  }

  function render() {
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
    byId("movement-no-products").hidden = products.length !== 0;
    updateBalance();
  }

  function updateControls() {
    const disabled = !hasCurrentData || loading || saving;
    byId("new-product").disabled = disabled;
    byId("submit-product").disabled = disabled;
    byId("cancel-product").disabled = saving;
    byId("movement-fields").disabled = disabled || products.length === 0;
    byId("retry-load").disabled = loading || saving;
  }

  async function refresh(errorMessage) {
    loading = true;
    updateControls();
    try {
      ({ products, movements } = await api.load());
      hasCurrentData = true;
      render();
      byId("load-error-panel").hidden = true;
    } catch {
      hasCurrentData = false;
      byId("load-error").textContent = errorMessage;
      byId("load-error-panel").hidden = false;
    } finally {
      loading = false;
      updateControls();
    }
  }

  const refreshMessage = "Não foi possível consultar o estoque. Verifique o servidor Flask e atualize o estoque.";
  byId("retry-load").addEventListener("click", () => refresh(refreshMessage));
  productDialog.addEventListener("cancel", (event) => {
    if (saving) event.preventDefault();
  });

  async function save(write, onSaved, errorElement) {
    if (saving || loading || !hasCurrentData) return;
    saving = true;
    updateControls();
    try {
      const result = await write();
      await refresh("Operação registrada. Atualize o estoque para obter os dados mais recentes.");
      onSaved(result);
    } catch (error) {
      if (error instanceof api.InventoryApiError) {
        await refresh(refreshMessage);
        setMessage(errorElement, error.message, "error");
      } else {
        await refresh("Não foi possível confirmar a operação. Atualize o estoque antes de tentar de novo.");
        setMessage(errorElement, "Confira a lista ou o histórico antes de repetir a operação.", "error");
      }
    } finally {
      saving = false;
      updateControls();
      if (!productDialog.open && errorElement === byId("product-message")) {
        byId("new-product").focus();
      }
    }
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
    const data = Object.fromEntries(new FormData(productForm));
    data.quantity = Number(data.quantity);
    void save(() => api.registerProduct(data), () => {
      productSearch.value = "";
      renderProducts();
      productDialog.close();
      setMessage(byId("product-notice"), "Produto cadastrado com sucesso.", "success");
    }, byId("product-message"));
  });

  movementForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const { type, productCode, quantity } = Object.fromEntries(new FormData(movementForm));
    void save(() => api.registerMovement({ type, productCode, quantity: Number(quantity) }), (movement) => {
      movementForm.elements.namedItem("quantity").value = "1";
      setMessage(byId("movement-message"), type + " registrada para " + movement.productName + ".", "success");
    }, byId("movement-message"));
  });

  void refresh(refreshMessage);
}

setupNavigation();
setupInventory();
