(function () {
  class InventoryApiError extends Error {}

  async function request(path, payload, method = "POST") {
    const options = payload === undefined ? {} : {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };
    const response = await fetch(path, options);
    const data = await response.json();
    if (!response.ok) throw new InventoryApiError(data.message || "Operação indisponível.");
    return data;
  }

  window.InventoryApi = {
    InventoryApiError,
    load: () => request("/api/inventory"),
    registerProduct: (product) => request("/api/products", product),
    setMinimum: (code, minimum) =>
      request("/api/products/" + encodeURIComponent(code) + "/minimum", { minimum }, "PUT"),
    registerMovement: (movement) => request("/api/movements", movement),
  };
})();
