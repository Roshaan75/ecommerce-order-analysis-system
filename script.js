const sampleOrders = [
  { orderId: "ORD001", customer: "Alice", product: "Laptop", category: "Electronics", qty: 1, price: 55000, date: "2025-01-05", status: "Delivered" },
  { orderId: "ORD002", customer: "Bob", product: "T-Shirt", category: "Clothing", qty: 3, price: 599, date: "2025-01-12", status: "Delivered" },
  { orderId: "ORD003", customer: "Carol", product: "Python Book", category: "Books", qty: 2, price: 450, date: "2025-02-03", status: "Delivered" },
  { orderId: "ORD004", customer: "Alice", product: "Headphones", category: "Electronics", qty: 1, price: 2999, date: "2025-02-18", status: "Delivered" },
  { orderId: "ORD005", customer: "David", product: "Mixer Grinder", category: "Home Appliances", qty: 1, price: 3200, date: "2025-03-07", status: "Cancelled" },
  { orderId: "ORD006", customer: "Eva", product: "Jeans", category: "Clothing", qty: 2, price: 1299, date: "2025-03-15", status: "Delivered" },
  { orderId: "ORD007", customer: "Frank", product: "Tablet", category: "Electronics", qty: 1, price: 18000, date: "2025-04-01", status: "Delivered" },
  { orderId: "ORD008", customer: "Grace", product: "Novel", category: "Books", qty: 4, price: 300, date: "2025-04-22", status: "Delivered" },
  { orderId: "ORD009", customer: "Henry", product: "Smart TV", category: "Electronics", qty: 1, price: 35000, date: "2025-05-10", status: "Delivered" },
  { orderId: "ORD010", customer: "Iris", product: "Refrigerator", category: "Home Appliances", qty: 1, price: 28000, date: "2025-05-25", status: "Delivered" },
  { orderId: "ORD011", customer: "Bob", product: "Running Shoes", category: "Clothing", qty: 1, price: 2500, date: "2025-06-08", status: "Delivered" },
  { orderId: "ORD012", customer: "Carol", product: "Data Science Book", category: "Books", qty: 1, price: 550, date: "2025-06-20", status: "Cancelled" },
  { orderId: "ORD013", customer: "Jack", product: "Smartphone", category: "Electronics", qty: 2, price: 22000, date: "2025-07-03", status: "Delivered" },
  { orderId: "ORD014", customer: "Karen", product: "Microwave", category: "Home Appliances", qty: 1, price: 8500, date: "2025-07-15", status: "Delivered" },
  { orderId: "ORD015", customer: "Leo", product: "Kurta", category: "Clothing", qty: 5, price: 799, date: "2025-08-05", status: "Delivered" },
  { orderId: "ORD016", customer: "Alice", product: "Washing Machine", category: "Home Appliances", qty: 1, price: 32000, date: "2025-08-28", status: "Delivered" },
  { orderId: "ORD017", customer: "Mia", product: "Bluetooth Speaker", category: "Electronics", qty: 2, price: 1800, date: "2025-09-11", status: "Delivered" },
  { orderId: "ORD018", customer: "Noah", product: "Camera", category: "Electronics", qty: 1, price: 32000, date: "2025-09-19", status: "Delivered" },
  { orderId: "ORD019", customer: "Olivia", product: "Cookbook", category: "Books", qty: 3, price: 350, date: "2025-10-02", status: "Delivered" },
  { orderId: "ORD020", customer: "Paul", product: "Keyboard", category: "Electronics", qty: 1, price: 4500, date: "2025-11-02", status: "Delivered" },
];

let orders = [];

const rupees = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

const form = document.querySelector("#orderForm");
const ordersBody = document.querySelector("#ordersBody");

function formatMoney(value) {
  return `Rs. ${rupees.format(Math.round(value || 0))}`;
}

function revenue(order) {
  return Number(order.qty) * Number(order.price);
}

function groupBy(items, keyFn, valueFn = () => 1) {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    acc[key] = (acc[key] || 0) + valueFn(item);
    return acc;
  }, {});
}

function sortedEntries(group) {
  return Object.entries(group).sort((a, b) => b[1] - a[1]);
}

function monthName(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleString("en-IN", { month: "short", year: "numeric" });
}

function setText(id, value) {
  document.querySelector(`#${id}`).textContent = value;
}

function normalizeStatus(value) {
  const status = String(value || "").trim().toLowerCase();
  if (status === "cancelled" || status === "canceled") return "Cancelled";
  if (status === "returned") return "Returned";
  if (status === "pending") return "Pending";
  return "Delivered";
}

function parseCsvRows(text) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const dataLines = lines[0]?.toLowerCase().startsWith("orderid,") ? lines.slice(1) : lines;

  return dataLines.map((line) => {
    const [orderId, customer, product, category, qty, price, date, status] = line.split(",").map((part) => part.trim());
    return {
      orderId,
      customer,
      product,
      category,
      qty: Number(qty),
      price: Number(price),
      date,
      status: normalizeStatus(status),
    };
  });
}

function isValidOrder(order) {
  return Boolean(
    order.orderId &&
      order.customer &&
      order.product &&
      order.category &&
      order.date &&
      Number.isFinite(order.qty) &&
      Number.isFinite(order.price) &&
      order.qty > 0 &&
      order.price >= 0
  );
}

function renderTable() {
  ordersBody.innerHTML = orders
    .map(
      (order, index) => `
        <tr>
          <td>${order.orderId}</td>
          <td>${order.customer}</td>
          <td>${order.product}</td>
          <td>${order.category}</td>
          <td>${order.qty}</td>
          <td>${formatMoney(order.price)}</td>
          <td>${order.date}</td>
          <td><span class="status ${order.status.toLowerCase()}">${order.status}</span></td>
          <td><button class="icon-button" type="button" data-index="${index}" aria-label="Delete ${order.orderId}">Delete</button></td>
        </tr>
      `
    )
    .join("");

  setText("tableCount", `${orders.length} record${orders.length === 1 ? "" : "s"}`);
}

function renderCategoryChart(delivered) {
  const chart = document.querySelector("#categoryChart");
  const categoryRevenue = sortedEntries(groupBy(delivered, (order) => order.category, revenue));
  const max = Math.max(...categoryRevenue.map(([, value]) => value), 0);

  if (!categoryRevenue.length) {
    chart.className = "empty-state";
    chart.innerHTML = "No delivered orders available for category analysis.";
    return;
  }

  chart.className = "";
  chart.innerHTML = categoryRevenue
    .map(([category, value]) => {
      const width = max ? Math.max((value / max) * 100, 4) : 0;
      return `
        <div class="bar-row">
          <span>${category}</span>
          <div class="bar"><i style="width: ${width}%"></i></div>
          <strong>${rupees.format(Math.round(value))}</strong>
        </div>
      `;
    })
    .join("");
}

function renderMonthlyChart(delivered) {
  const chart = document.querySelector("#monthlyChart");
  const labels = document.querySelector("#monthLabels");
  const monthly = Object.entries(groupBy(delivered, (order) => order.date.slice(0, 7), revenue)).sort();
  const max = Math.max(...monthly.map(([, value]) => value), 0);

  chart.innerHTML = "";
  labels.innerHTML = "";

  if (!monthly.length) {
    chart.innerHTML = '<p class="empty-state">No delivered orders available for monthly trend analysis.</p>';
    setText("monthRange", "No data");
    return;
  }

  chart.innerHTML = monthly
    .map(([month, value]) => {
      const height = max ? Math.max((value / max) * 100, 3) : 3;
      return `<span style="height: ${height}%" title="${monthName(`${month}-01`)}: ${formatMoney(value)}"></span>`;
    })
    .join("");

  labels.innerHTML = monthly.map(([month]) => `<span>${monthName(`${month}-01`)}</span>`).join("");
  setText("monthRange", monthly.length === 1 ? monthName(`${monthly[0][0]}-01`) : `${monthName(`${monthly[0][0]}-01`)} to ${monthName(`${monthly.at(-1)[0]}-01`)}`);
}

function renderSummary() {
  const delivered = orders.filter((order) => order.status === "Delivered");
  const cancelled = orders.filter((order) => order.status === "Cancelled");
  const totalRevenue = delivered.reduce((sum, order) => sum + revenue(order), 0);
  const avgOrderValue = delivered.length ? totalRevenue / delivered.length : 0;

  const categoryRevenue = sortedEntries(groupBy(delivered, (order) => order.category, revenue));
  const productRevenue = sortedEntries(groupBy(delivered, (order) => order.product, revenue));
  const monthlyRevenue = Object.entries(groupBy(delivered, (order) => order.date.slice(0, 7), revenue)).sort((a, b) => b[1] - a[1]);
  const repeatCustomers = sortedEntries(groupBy(delivered, (order) => order.customer)).filter(([, count]) => count > 1);

  const topCategory = categoryRevenue[0];
  const topProduct = productRevenue[0];
  const peakMonth = monthlyRevenue[0];
  const topCategoryPercent = topCategory && totalRevenue ? ((topCategory[1] / totalRevenue) * 100).toFixed(1) : 0;

  setText("heroRevenue", formatMoney(totalRevenue));
  setText("heroAov", formatMoney(avgOrderValue));
  setText("heroAovNote", `${delivered.length} delivered order${delivered.length === 1 ? "" : "s"}`);
  setText("heroTopCategory", topCategory ? topCategory[0] : "None");
  setText("heroTopCategoryNote", topCategory ? `${topCategoryPercent}% of revenue` : "Add data to analyze");
  setText("heroPeakMonth", peakMonth ? monthName(`${peakMonth[0]}-01`) : "None");
  setText("heroPeakMonthNote", peakMonth ? `${formatMoney(peakMonth[1])} revenue` : "Add data to analyze");

  setText("orderCount", orders.length);
  setText("orderStatusSummary", `${delivered.length} delivered, ${cancelled.length} cancelled, ${orders.length - delivered.length - cancelled.length} other`);
  setText("topProduct", topProduct ? topProduct[0] : "None");
  setText("topProductList", productRevenue.length ? productRevenue.slice(0, 3).map(([product, value]) => `${product} (${formatMoney(value)})`).join(", ") : "Add delivered orders to rank products");
  setText("repeatCount", repeatCustomers.length);
  setText("repeatList", repeatCustomers.length ? repeatCustomers.map(([name, count]) => `${name}: ${count}`).join(", ") : "No repeat customers found");

  renderCategoryChart(delivered);
  renderMonthlyChart(delivered);
  renderTable();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const order = {
    orderId: data.get("orderId").trim(),
    customer: data.get("customer").trim(),
    product: data.get("product").trim(),
    category: data.get("category").trim(),
    qty: Number(data.get("qty")),
    price: Number(data.get("price")),
    date: data.get("date"),
    status: data.get("status"),
  };

  if (!isValidOrder(order)) {
    return;
  }

  orders.push(order);
  form.reset();
  document.querySelector("#qty").value = 1;
  renderSummary();
});

document.querySelector("#loadSample").addEventListener("click", () => {
  orders = sampleOrders.map((order) => ({ ...order }));
  renderSummary();
});

document.querySelector("#clearData").addEventListener("click", () => {
  orders = [];
  renderSummary();
});

document.querySelector("#importCsv").addEventListener("click", () => {
  const input = document.querySelector("#csvInput");
  const message = document.querySelector("#csvMessage");
  const parsed = parseCsvRows(input.value);
  const validRows = parsed.filter(isValidOrder);

  if (!validRows.length) {
    message.textContent = "No valid rows found. Check the column order and required values.";
    return;
  }

  orders.push(...validRows);
  input.value = "";
  message.textContent = `${validRows.length} row${validRows.length === 1 ? "" : "s"} imported successfully.`;
  renderSummary();
});

ordersBody.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-index]");
  if (!button) return;
  orders.splice(Number(button.dataset.index), 1);
  renderSummary();
});

orders = sampleOrders.map((order) => ({ ...order }));
renderSummary();
