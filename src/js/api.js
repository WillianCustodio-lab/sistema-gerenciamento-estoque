(function () {
  class InventoryApiError extends Error {}

  async function request(path, payload) {
    const options = payload === undefined ? {} : {
      method: "POST",
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
    registerMovement: (movement) => request("/api/movements", movement),
  };
})();
