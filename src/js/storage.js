(function () {
  const INVENTORY_KEY = "estoque.inventario";
  const LEGACY_PRODUCTS_KEY = "estoque.produtos";
  const LEGACY_MOVEMENTS_KEY = "estoque.movimentacoes";

  class LocalStorageRepository {
    constructor(storage = window.localStorage) {
      this.storage = storage;
    }

    load() {
      const snapshot = this.storage.getItem(INVENTORY_KEY);
      if (snapshot !== null) {
        const inventory = JSON.parse(snapshot);
        if (!Array.isArray(inventory?.products) || !Array.isArray(inventory?.movements)) {
          throw new Error("Dados de estoque inválidos.");
        }
        return inventory;
      }
      return {
        products: this.loadLegacyCollection(LEGACY_PRODUCTS_KEY),
        movements: this.loadLegacyCollection(LEGACY_MOVEMENTS_KEY),
      };
    }

    save(inventory) {
      this.storage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
    }

    loadLegacyCollection(key) {
      const stored = this.storage.getItem(key);
      if (stored === null) return [];
      const items = JSON.parse(stored);
      if (!Array.isArray(items)) throw new Error("Dados de estoque inválidos.");
      return items;
    }
  }

  window.InventoryStorage = { LocalStorageRepository };
})();
