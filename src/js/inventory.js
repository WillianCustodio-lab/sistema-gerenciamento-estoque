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
    const { products, movements } = repository.load();
    this.products = products.map(
      (product) =>
        new Product(
          product.code,
          product.name,
          product.category,
          product.quantity,
        ),
    );
    this.movements = movements;
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
    const products = [...this.products, product];
    this.repository.save({ products, movements: this.movements });
    this.products = products;
    return product;
  }

  registerEntry(productCode, quantity) {
    return this.registerMovement("Entrada", productCode, quantity);
  }

  registerExit(productCode, quantity) {
    return this.registerMovement("Saída", productCode, quantity);
  }

  registerMovement(type, productCode, quantity) {
    const currentProduct = this.products.find((item) => item.code === productCode);
    const normalizedQuantity = Number(quantity);

    if (!currentProduct) {
      throw new InventoryError("Selecione um produto cadastrado.");
    }

    if (!Number.isInteger(normalizedQuantity) || normalizedQuantity <= 0) {
      throw new InventoryError("Informe uma quantidade inteira maior que zero.");
    }

    const { code, name, category, quantity: balance } = currentProduct;
    const product = new Product(code, name, category, balance);
    if (type === "Entrada") {
      product.registerEntry(normalizedQuantity);
    } else if (type === "Saída") {
      product.registerExit(normalizedQuantity);
    } else {
      throw new InventoryError("Tipo de movimentação inválido.");
    }

    const movement = new Movement(product, type, normalizedQuantity);
    const products = this.products.map((item) => item === currentProduct ? product : item);
    const movements = [movement, ...this.movements];
    this.repository.save({ products, movements });
    this.products = products;
    this.movements = movements;
    return { product, movement };
  }
}

  window.InventoryDomain = { InventoryError, Product, Movement, InventoryService };
})();
