(function () {
class InventoryError extends Error {}

class Product {
  constructor(code, name, category, quantity) {
    this.code = code;
    this.name = name;
    this.category = category;
    this.quantity = Number(quantity);
  }

  registerEntry(quantity) {
    this.quantity += quantity;
  }

  registerExit(quantity) {
    if (quantity > this.quantity) {
      throw new InventoryError("Saldo insuficiente para registrar a saída.");
    }
    this.quantity -= quantity;
  }
}

class Movement {
  constructor(product, type, quantity) {
    this.id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    this.productCode = product.code;
    this.productName = product.name;
    this.type = type;
    this.quantity = quantity;
    this.createdAt = new Date().toISOString();
  }
}

class InventoryService {
  constructor(repository) {
    this.repository = repository;
    this.products = repository.loadProducts().map(
      (product) =>
        new Product(
          product.code,
          product.name,
          product.category,
          product.quantity,
        ),
    );
    this.movements = repository.loadMovements();
  }

  getProducts() {
    return this.products;
  }

  getMovements() {
    return this.movements;
  }

  registerProduct({ code, name, category, quantity }) {
    const normalizedCode = String(code || "").trim().toUpperCase();
    const normalizedName = String(name || "").trim();
    const normalizedCategory = String(category || "").trim();
    const normalizedQuantity = Number(quantity);

    if (
      !normalizedCode ||
      !normalizedName ||
      !Number.isInteger(normalizedQuantity) ||
      normalizedQuantity < 0
    ) {
      throw new InventoryError(
        "Preencha código, nome e uma quantidade inteira válida.",
      );
    }

    if (this.products.some((product) => product.code === normalizedCode)) {
      throw new InventoryError("Já existe um produto cadastrado com esse código.");
    }

    const product = new Product(
      normalizedCode,
      normalizedName,
      normalizedCategory,
      normalizedQuantity,
    );
    this.products.push(product);
    this.repository.saveProducts(this.products);
    return product;
  }

  registerEntry(productCode, quantity) {
    return this.registerMovement("Entrada", productCode, quantity);
  }

  registerExit(productCode, quantity) {
    return this.registerMovement("Saída", productCode, quantity);
  }

  registerMovement(type, productCode, quantity) {
    const product = this.products.find((item) => item.code === productCode);
    const normalizedQuantity = Number(quantity);

    if (!product) {
      throw new InventoryError("Selecione um produto cadastrado.");
    }

    if (!Number.isInteger(normalizedQuantity) || normalizedQuantity <= 0) {
      throw new InventoryError("Informe uma quantidade inteira maior que zero.");
    }

    if (type === "Entrada") {
      product.registerEntry(normalizedQuantity);
    } else if (type === "Saída") {
      product.registerExit(normalizedQuantity);
    } else {
      throw new InventoryError("Tipo de movimentação inválido.");
    }

    const movement = new Movement(product, type, normalizedQuantity);
    this.movements.unshift(movement);
    this.repository.saveInventory(this.products, this.movements);
    return { product, movement };
  }
}

  window.InventoryDomain = { InventoryError, Product, Movement, InventoryService };
})();
