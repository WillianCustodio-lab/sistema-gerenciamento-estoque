(function () {
const PRODUCTS_STORAGE_KEY = "estoque.produtos";
const MOVEMENTS_STORAGE_KEY = "estoque.movimentacoes";

class LocalStorageRepository {
  constructor(storage = window.localStorage) {
    this.storage = storage;
  }

  loadProducts() {
    return this.loadCollection(PRODUCTS_STORAGE_KEY);
  }

  loadMovements() {
    return this.loadCollection(MOVEMENTS_STORAGE_KEY);
  }

  saveProducts(products) {
    this.storage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  }

  saveInventory(products, movements) {
    this.saveProducts(products);
    this.storage.setItem(MOVEMENTS_STORAGE_KEY, JSON.stringify(movements));
  }

  loadCollection(key) {
    try {
      const storedItems = JSON.parse(this.storage.getItem(key));
      return Array.isArray(storedItems) ? storedItems : [];
    } catch {
      return [];
    }
  }
}

  window.InventoryStorage = { LocalStorageRepository };
})();
