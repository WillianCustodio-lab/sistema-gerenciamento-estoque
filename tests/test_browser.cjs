const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const { createInterface } = require("node:readline");
const path = require("node:path");
const { once } = require("node:events");
const { test, before, after } = require("node:test");
const { chromium } = require("playwright-core");

let server;
let browser;
let address;

before(async () => {
  server = spawn(process.env.TEST_PYTHON || "python", ["-m", "tests.browser_server"], {
    cwd: path.resolve(__dirname, ".."),
    stdio: ["pipe", "pipe", "inherit"],
  });
  const output = createInterface({ input: server.stdout });
  const [line] = await Promise.race([
    once(output, "line"),
    once(server, "exit").then(([code]) => { throw new Error("Servidor de teste encerrou: " + code); }),
  ]);
  output.close();
  address = line;
  browser = await chromium.launch({
    channel: process.env.TEST_CHROME ? undefined : "chrome",
    executablePath: process.env.TEST_CHROME,
    headless: true,
  });
}, { timeout: 15000 });

after(async () => {
  try {
    if (browser) await browser.close();
  } finally {
    if (server && server.exitCode === null && server.pid) {
      const exited = once(server, "exit");
      server.stdin.end();
      await exited;
    }
  }
});

function navigate(page, name) {
  return page.getByRole("navigation").getByRole("link", { name, exact: true }).click();
}

async function fillProduct(page, code, name, quantity) {
  await page.getByRole("button", { name: "Novo produto" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Código").fill(code);
  await dialog.getByLabel("Nome").fill(name);
  await dialog.getByLabel("Quantidade inicial").fill(String(quantity));
  await dialog.getByRole("button", { name: "Cadastrar", exact: true }).click();
  return dialog;
}

async function move(page, type, quantity, nextMessage) {
  await page.locator("#movement-type").selectOption(type);
  await page.getByLabel("Quantidade", { exact: true }).fill(String(quantity));
  await page.getByRole("button", { name: "Registrar", exact: true }).click();
  await page.getByText(nextMessage, { exact: true }).waitFor();
}

test("CT-07 a CT-09: navegação, operação do estoque e recuperação de conexão", async () => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  try {
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.setDefaultTimeout(5000);
    await page.goto(address);
    await navigate(page, "Movimentações");
    assert.equal(await page.locator("#movement-product").isDisabled(), true);
    await page.evaluate(() => { window.sprintNavigation = true; });
    await navigate(page, "Produtos");
    assert.equal(await page.evaluate(() => window.sprintNavigation), true);
    await page.locator("#products-empty").waitFor();

    let dialog = await fillProduct(page, "ca-01", "Caixa plástica", 10);
    await dialog.waitFor({ state: "hidden" });
    dialog = await fillProduct(page, "CA-01", "Duplicado", 1);
    await dialog.getByText(/Já existe um produto/).waitFor();
    await page.keyboard.press("Escape");
    dialog = await fillProduct(page, "PA-02", "Papel", 0);
    await dialog.waitFor({ state: "hidden" });
    assert.match(await page.locator("#product-list").innerText(), /Sem estoque/);

    const search = page.locator("#product-search");
    for (const term of ["plastica", "ca-01"]) {
      await search.fill(term);
      assert.equal(await page.locator("#product-list tr").count(), 1);
      assert.match(await page.locator("#product-list").innerText(), /Caixa plástica/);
    }
    await search.fill("inexistente");
    await page.getByText(/Nenhum produto corresponde/).waitFor();
    await search.clear();

    await navigate(page, "Movimentações");
    await page.locator("#movement-product").selectOption("CA-01");
    await page.getByText("Saldo disponível: 10").waitFor();
    await move(page, "Entrada", 5, "Saldo disponível: 15");
    await move(page, "Saída", 3, "Saldo disponível: 12");
    await move(page, "Saída", 13, "Saldo insuficiente para registrar a saída.");
    assert.match(await page.locator("#movement-balance").innerText(), /12/);
    assert.equal(await page.locator("#history-list tr").count(), 2);
    assert.match(await page.locator("#history-list tr").first().innerText(), /Caixa plástica.*Saída/s);
    await page.reload();
    await page.locator("#history-list tr").last().waitFor();
    assert.equal(await page.locator("#history-list tr").count(), 2);
    await navigate(page, "Visão geral");
    const metrics = ["#total-products", "#total-units", "#total-out"];
    assert.deepEqual(await Promise.all(metrics.map((id) => page.locator(id).innerText())), ["2", "12", "1"]);

    await page.setViewportSize({ width: 375, height: 812 });
    await navigate(page, "Produtos");
    const table = page.locator("#product-table");
    assert.ok(await table.evaluate((el) => el.scrollWidth > el.clientWidth));
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 375);
    await table.focus();
    await page.keyboard.press("ArrowRight");
    await page.waitForFunction(() => document.getElementById("product-table").scrollLeft > 0);
    assert.deepEqual(errors, []);

    const otherContext = await browser.newContext();
    try {
      const other = await otherContext.newPage();
      other.setDefaultTimeout(5000);
      await other.goto(address);
      await other.locator("#recent-list tr").last().waitFor();
      assert.equal(await other.locator("#total-units").innerText(), "12");
      await other.route("**/api/inventory", (route) => route.abort());
      await other.reload();
      const refresh = other.getByRole("button", { name: "Atualizar estoque" });
      await refresh.waitFor();
      await other.unroute("**/api/inventory");
      await refresh.click();
      await other.locator("#recent-list tr").last().waitFor();
      assert.equal(await refresh.isVisible(), false);
    } finally {
      await otherContext.close();
    }
  } finally {
    await context.close();
  }
});
