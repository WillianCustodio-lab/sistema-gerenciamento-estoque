const assert = require("node:assert/strict");
const { test } = require("node:test");

global.window = {};
require("../src/js/inventory.js");
require("../src/js/storage.js");
const { InventoryService } = window.InventoryDomain;
const { LocalStorageRepository } = window.InventoryStorage;

function memoryStorage(entries = []) {
  const values = new Map(entries);
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

test("cadastro, duplicidade, entrada, saída, saldo e recarga", () => {
  const repository = new LocalStorageRepository(memoryStorage());
  const service = new InventoryService(repository);
  service.registerProduct({ code: "P1", name: "Caixa", quantity: 10 });
  assert.throws(() => service.registerProduct({ code: "p1", name: "Outra", quantity: 2 }), /cadastrado/);
  assert.equal(service.registerEntry("P1", 5).product.quantity, 15);
  assert.equal(service.registerExit("P1", 3).product.quantity, 12);
  assert.throws(() => service.registerExit("P1", 13), /Saldo insuficiente/);
  const reloaded = new InventoryService(repository);
  assert.equal(reloaded.getProducts()[0].quantity, 12);
  assert.deepEqual(reloaded.getMovements().map(({ type, quantity }) => [type, quantity]), [
    ["Saída", 3], ["Entrada", 5],
  ]);
});

test("lê dados da Sprint 4 e grava o próximo estado em uma única chave", () => {
  const previous = { productCode: "P1", productName: "Caixa", type: "Entrada", quantity: 2 };
  const storage = memoryStorage([
    ["estoque.produtos", JSON.stringify([{ code: "P1", name: "Caixa", quantity: 10 }])],
    ["estoque.movimentacoes", JSON.stringify([previous])],
  ]);
  const writes = [];
  const repository = new LocalStorageRepository({
    getItem: storage.getItem,
    setItem(key, value) {
      writes.push(key);
      storage.setItem(key, value);
    },
  });
  const service = new InventoryService(repository);
  assert.deepEqual(service.getMovements(), [previous]);
  service.registerExit("P1", 3);
  assert.deepEqual(writes, ["estoque.inventario"]);
  const reloaded = new InventoryService(repository);
  assert.equal(reloaded.getProducts()[0].quantity, 7);
  assert.equal(reloaded.getMovements().length, 2);
});

test("uma falha de gravação não altera saldo nem histórico", () => {
  const storage = memoryStorage();
  let fail = false;
  const repository = new LocalStorageRepository({
    getItem: storage.getItem,
    setItem(key, value) {
      if (fail) throw new Error("Falha simulada");
      storage.setItem(key, value);
    },
  });
  const service = new InventoryService(repository);
  service.registerProduct({ code: "P1", name: "Caixa", quantity: 10 });
  fail = true;
  assert.throws(() => service.registerExit("P1", 3), /Falha simulada/);
  assert.throws(() => service.registerProduct({ code: "P2", name: "Papel", quantity: 1 }), /Falha simulada/);
  assert.equal(service.getProducts().length, 1);
  assert.equal(service.getProducts()[0].quantity, 10);
  assert.equal(service.getMovements().length, 0);
  const persisted = repository.load();
  assert.equal(persisted.products[0].quantity, 10);
  assert.equal(persisted.movements.length, 0);
});
