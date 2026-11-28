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

function hasMinimum(product) {
  return product.minimum !== null && product.minimum !== undefined;
}

// Estoque baixo: há um mínimo configurado e o saldo está igual ou abaixo dele (US-07).
function isLowStock(product) {
  return hasMinimum(product) && product.quantity <= product.minimum;
}

function stockBadge(product) {
  if (product.quantity === 0) return badge("Sem estoque", "negative");
  if (isLowStock(product)) return badge("Estoque baixo", "warning");
  return badge("Disponível", "positive");
}

function readOptionalInteger(value) {
  return value === "" ? null : Number(value);
}

function searchKey(text) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
}

function setupNavigation() {
  const sections = ["visao-geral", "produtos", "movimentacoes"];
  const links = document.querySelectorAll("nav a");
  document.querySelector(".skip-link").addEventListener("click", (event) => {
    event.preventDefault();
    byId("main-content").focus();
  });
  function navigate(moveFocus) {
    const target = window.location.hash.slice(1);
    const current = sections.includes(target) ? target : sections[0];
    sections.forEach((id) => { byId(id).hidden = id !== current; });
    links.forEach((link) => {
      if (link.hash === "#" + current) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    byId("current-section").textContent = byId(current).querySelector("h1").textContent;
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
  let hasLoaded = false;
  let editingCode = "";
  const productDialog = byId("product-dialog");
  const productForm = byId("product-form");
  const minimumDialog = byId("minimum-dialog");
  const minimumForm = byId("minimum-form");
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
      cell(hasMinimum(product) ? numberFormat.format(product.minimum) : "—", "numeric"),
      cell(stockBadge(product)),
      cell(minimumButton(product)),
    )));
    byId("product-count").textContent = matches.length + (matches.length === 1 ? " produto" : " produtos");
    byId("products-empty").textContent = products.length
      ? "Nenhum produto corresponde à pesquisa."
      : "Nenhum produto cadastrado.";
    byId("products-empty").hidden = matches.length !== 0;
    byId("product-table").hidden = matches.length === 0;
  }

  function minimumButton(product) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "compact";
    button.dataset.minimum = product.code;
    button.textContent = "Definir estoque mínimo";
    button.setAttribute("aria-label", "Definir estoque mínimo de " + product.name + " (" + product.code + ")");
    button.disabled = !hasCurrentData || loading || saving;
    button.addEventListener("click", () => openMinimumDialog(product));
    return button;
  }

  function openMinimumDialog(product) {
    editingCode = product.code;
    minimumForm.reset();
    minimumForm.elements.namedItem("minimum").value = hasMinimum(product) ? String(product.minimum) : "";
    byId("minimum-product").textContent = product.name + " (" + product.code + ") · Saldo atual: "
      + numberFormat.format(product.quantity);
    setMessage(byId("minimum-message"), "");
    setMessage(byId("product-notice"), "");
    minimumDialog.showModal();
  }

  function focusMinimumButton() {
    const button = [...document.querySelectorAll("[data-minimum]")].find((item) => item.dataset.minimum === editingCode);
    (button || productSearch).focus();
  }

  function updateBalance() {
    const product = products.find(({ code }) => code === movementProduct.value);
    byId("movement-balance").textContent = product
      ? "Saldo disponível: " + numberFormat.format(product.quantity)
      : "";
  }

  function renderReplenishment() {
    const lowProducts = products.filter(isLowStock);
    byId("replenishment-list").replaceChildren(...lowProducts.slice(0, 5).map((product) => {
      const item = document.createElement("li");
      const details = document.createElement("div");
      const name = document.createElement("strong");
      name.textContent = product.name;
      const balance = document.createElement("small");
      balance.textContent = "Saldo " + numberFormat.format(product.quantity)
        + " · Mínimo " + numberFormat.format(product.minimum);
      details.append(name, balance);
      item.append(details, stockBadge(product));
      return item;
    }));
    byId("replenishment-list").hidden = lowProducts.length === 0;
    byId("replenishment-empty").hidden = lowProducts.length > 0;
    byId("replenishment-empty").textContent = products.some(hasMinimum)
      ? "Nenhum produto abaixo do limite."
      : "Defina o mínimo dos produtos para acompanhar a reposição.";
  }

  function updateConnection(state) {
    document.body.dataset.stockState = state;
    byId("connection-status").dataset.state = state;
    const messages = {
      loading: hasLoaded ? "Atualizando estoque" : "Carregando estoque",
      ready: "Estoque atualizado",
      error: hasLoaded ? "Dados desatualizados" : "Estoque indisponível",
    };
    byId("connection-text").textContent = messages[state];
    if (!hasLoaded) {
      const text = state === "error" ? "Dados indisponíveis." : "Carregando estoque…";
      for (const id of ["recent-empty", "history-empty", "products-empty", "replenishment-empty"]) {
        byId(id).textContent = text;
      }
    }
  }

  function render() {
    byId("total-products").textContent = numberFormat.format(products.length);
    const totalUnits = products.reduce((sum, product) => sum + BigInt(product.quantity), 0n);
    byId("total-units").textContent = numberFormat.format(totalUnits);
    byId("total-out").textContent = numberFormat.format(products.filter((product) => product.quantity === 0).length);
    const configured = products.filter(hasMinimum);
    byId("total-low").textContent = configured.length
      ? numberFormat.format(configured.filter(isLowStock).length)
      : "—";
    byId("low-help").textContent = configured.length
      ? "Saldo igual ou abaixo do mínimo em " + configured.length
        + (configured.length === 1 ? " produto com limite." : " produtos com limite.")
      : "Defina o estoque mínimo em Produtos.";
    byId("recent-empty").textContent = "Nenhuma movimentação registrada.";
    byId("history-empty").textContent = "Nenhuma movimentação registrada.";
    renderProducts();
    renderReplenishment();
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
    byId("submit-minimum").disabled = disabled;
    byId("cancel-minimum").disabled = saving;
    document.querySelectorAll("[data-minimum]").forEach((button) => { button.disabled = disabled; });
    byId("movement-fields").disabled = disabled || products.length === 0;
    byId("retry-load").disabled = loading || saving;
  }

  async function refresh(errorMessage) {
    loading = true;
    updateConnection("loading");
    updateControls();
    try {
      ({ products, movements } = await api.load());
      hasCurrentData = true;
      hasLoaded = true;
      render();
      updateConnection("ready");
      byId("load-error-panel").hidden = true;
    } catch {
      hasCurrentData = false;
      updateConnection("error");
      byId("load-error").textContent = errorMessage;
      byId("load-error-panel").hidden = false;
    } finally {
      loading = false;
      updateControls();
    }
  }

  const refreshMessage = "Não foi possível carregar o estoque. Tente atualizar.";
  byId("retry-load").addEventListener("click", () => refresh(refreshMessage));
  for (const dialog of [productDialog, minimumDialog]) {
    dialog.addEventListener("cancel", (event) => {
      if (saving) event.preventDefault();
    });
  }

  async function save(write, onSaved, errorElement) {
    if (saving || loading || !hasCurrentData) return;
    saving = true;
    updateControls();
    try {
      const result = await write();
      await refresh("Operação registrada. Atualize o estoque para ver os dados atuais.");
      onSaved(result);
    } catch (error) {
      if (error instanceof api.InventoryApiError) {
        await refresh(refreshMessage);
        setMessage(errorElement, error.message, "error");
      } else {
        await refresh("Não foi possível confirmar a operação. Atualize o estoque antes de repetir.");
        setMessage(errorElement, "Confira a lista ou o histórico antes de repetir a operação.", "error");
      }
    } finally {
      saving = false;
      updateControls();
      if (!productDialog.open && errorElement === byId("product-message")) {
        byId("new-product").focus();
      }
      if (!minimumDialog.open && errorElement === byId("minimum-message")) {
        focusMinimumButton();
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
    data.minimum = readOptionalInteger(data.minimum);
    void save(() => api.registerProduct(data), () => {
      productSearch.value = "";
      renderProducts();
      productDialog.close();
      setMessage(byId("product-notice"), "Produto cadastrado.", "success");
    }, byId("product-message"));
  });

  byId("cancel-minimum").addEventListener("click", () => minimumDialog.close());
  minimumForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const minimum = readOptionalInteger(minimumForm.elements.namedItem("minimum").value);
    void save(() => api.setMinimum(editingCode, minimum), (product) => {
      minimumDialog.close();
      const text = minimum === null
        ? "Estoque mínimo removido de " + product.name + "."
        : "Estoque mínimo de " + product.name + " definido em " + numberFormat.format(minimum) + ".";
      setMessage(byId("product-notice"), text, "success");
    }, byId("minimum-message"));
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
