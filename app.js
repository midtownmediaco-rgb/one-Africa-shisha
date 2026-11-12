const STORAGE_KEYS = { products: 'oneAfrica.products.v2', bills: 'oneAfrica.bills.v1', settings: 'oneAfrica.settings.v2' };
const SHISHA_PRICE = 20000;
const defaultProducts = [{ id: 'shisha-session', name: 'Shisha session', category: 'Shisha', price: SHISHA_PRICE }];
const moneyFormatter = () => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'UGX', maximumFractionDigits: 0 });
const money = value => moneyFormatter().format(Number(value) || 0);
const safeLoad = (key, fallback) => { try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; } catch { return fallback; } };
const state = { products: safeLoad(STORAGE_KEYS.products, defaultProducts), bills: safeLoad(STORAGE_KEYS.bills, []), currency: 'UGX', category: 'All', search: '', cart: [] };
const $ = selector => document.querySelector(selector);
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const save = () => {
  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(state.products));
  localStorage.setItem(STORAGE_KEYS.bills, JSON.stringify(state.bills));
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify({ currency: state.currency }));
};
function totals() {
  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = Math.min(Math.max(0, Number($('#discount').value) || 0), subtotal);
  const taxRate = Math.min(100, Math.max(0, Number($('#tax-rate').value) || 0));
  const tax = (subtotal - discount) * taxRate / 100;
  return { subtotal, discount, tax, total: subtotal - discount + tax };
}
function renderCategories() {
  const categories = ['All', ...new Set(state.products.map(product => product.category))];
  if (!categories.includes(state.category)) state.category = 'All';
  $('#category-tabs').innerHTML = categories.map(category => `<button class="category-tab ${state.category === category ? 'selected' : ''}" data-category="${escapeHTML(category)}">${escapeHTML(category)}</button>`).join('');
}
function renderProducts() {
  renderCategories();
  const query = state.search.trim().toLowerCase();
  const products = state.products.filter(product => (state.category === 'All' || product.category === state.category) && product.name.toLowerCase().includes(query));
  $('#product-grid').innerHTML = products.map(product => `<button class="product-card" data-product="${escapeHTML(product.id)}"><span class="product-category">${escapeHTML(product.category)}</span><strong>${escapeHTML(product.name)}</strong><span class="product-price">${money(product.category === 'Shisha' ? SHISHA_PRICE : product.price)}</span><span class="product-add">＋</span></button>`).join('');
  $('#products-empty').classList.toggle('hidden', products.length > 0);
}
function renderCart() {
  $('#cart-items').innerHTML = state.cart.map(item => `<div class="cart-item"><div class="cart-item-info"><strong>${escapeHTML(item.name)}</strong><span>${money(item.price)} each</span>${item.category === 'Shisha' ? `<label class="flavor-label">Flavor mix<input class="flavor-input" data-flavor="${escapeHTML(item.id)}" value="${escapeHTML(item.flavors || '')}" placeholder="e.g. Mint + Double Apple" list="flavor-suggestions"><small>Enter the flavors requested by the customer.</small></label>` : ''}</div><div class="quantity-control"><button data-quantity="-1" data-id="${escapeHTML(item.id)}" aria-label="Decrease ${escapeHTML(item.name)} quantity">−</button><span>${item.quantity}</span><button data-quantity="1" data-id="${escapeHTML(item.id)}" aria-label="Increase ${escapeHTML(item.name)} quantity">＋</button></div><strong class="line-total">${money(item.price * item.quantity)}</strong></div>`).join('');
  const quantity = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  $('#cart-item-count').textContent = `${quantity} ${quantity === 1 ? 'item' : 'items'}`;
  $('#cart-empty').classList.toggle('hidden', state.cart.length > 0);
  $('#cart-items').classList.toggle('hidden', state.cart.length === 0);
  const bill = totals();
  $('#subtotal').textContent = money(bill.subtotal);
  $('#discount-total').textContent = `−${money(bill.discount)}`;
  $('#tax-total').textContent = money(bill.tax);
  $('#grand-total').textContent = money(bill.total);
  $('#checkout-total').textContent = money(bill.total);
  $('#checkout').disabled = bill.total <= 0;
}
function paymentTime(bill) { return new Date(bill.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }); }
function renderTableRows(bills, includeCustomer) {
  return bills.map(bill => `<tr><td><strong class="invoice-id">${escapeHTML(bill.id)}</strong></td><td>${escapeHTML(paymentTime(bill))}</td>${includeCustomer ? `<td>${escapeHTML(bill.customer || 'Walk-in')}</td>` : ''}<td>${bill.items.reduce((sum, item) => sum + item.quantity, 0)} items</td><td><span class="payment-pill">${escapeHTML(bill.paymentMethod)}</span></td><td class="align-right"><strong>${money(bill.total)}</strong></td><td><button class="text-link view-bill" data-bill="${escapeHTML(bill.id)}">View</button></td></tr>`).join('');
}
function renderDashboard() {
  const today = new Date().toDateString();
  const bills = state.bills.filter(bill => new Date(bill.createdAt).toDateString() === today);
  const sales = bills.reduce((sum, bill) => sum + bill.total, 0);
  $('#sales-today').textContent = money(sales);
  $('#sales-count').textContent = `${bills.length} completed ${bills.length === 1 ? 'bill' : 'bills'}`;
  $('#bills-today').textContent = String(bills.length);
  $('#average-bill').textContent = money(bills.length ? sales / bills.length : 0);
  const recent = [...state.bills].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  $('#recent-table').innerHTML = renderTableRows(recent, false);
  $('#recent-empty').classList.toggle('hidden', recent.length > 0);
}
function renderHistory() {
  const query = $('#history-search').value.trim().toLowerCase();
  const method = $('#payment-filter').value;
  const bills = [...state.bills].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).filter(bill => (method === 'all' || bill.paymentMethod === method) && `${bill.id} ${bill.customer || ''}`.toLowerCase().includes(query));
  $('#history-table').innerHTML = renderTableRows(bills, true);
  $('#history-empty').classList.toggle('hidden', bills.length > 0);
}
function renderAll() { renderProducts(); renderCart(); renderDashboard(); renderHistory(); }
function addToCart(product) {
  const normalizedProduct = { ...product, price: product.category === 'Shisha' ? SHISHA_PRICE : product.price };
  const item = state.cart.find(entry => entry.id === product.id);
  if (item) item.quantity += 1;
  else state.cart.push({ ...normalizedProduct, quantity: 1, flavors: '' });
  renderCart();
}
function showReceipt(bill) {
  $('#receipt-content').innerHTML = `<div class="receipt"><div class="receipt-brand"><span class="brand-mark">OA</span><h2>ONE AFRICA SHISHA</h2><p>SALES RECEIPT</p></div><div class="receipt-meta"><span>Invoice</span><strong>${escapeHTML(bill.id)}</strong><span>Date</span><strong>${escapeHTML(paymentTime(bill))}</strong><span>Customer</span><strong>${escapeHTML(bill.customer || 'Walk-in')}</strong><span>Served by</span><strong>${escapeHTML(bill.servedBy || 'Not recorded')}</strong><span>Payment</span><strong>${escapeHTML(bill.paymentMethod)}</strong></div><div class="receipt-lines">${bill.items.map(item => `<div class="receipt-item"><span>${escapeHTML(item.name)} × ${item.quantity}${item.flavors ? `<small>Flavor mix: ${escapeHTML(item.flavors)}</small>` : ''}</span><strong>${money(item.price * item.quantity)}</strong></div>`).join('')}</div><div class="receipt-totals"><div><span>Subtotal</span><strong>${money(bill.subtotal)}</strong></div><div><span>Discount</span><strong>−${money(bill.discount)}</strong></div><div><span>Tax (${bill.taxRate}%)</span><strong>${money(bill.tax)}</strong></div><div class="grand-total"><span>Total paid</span><strong>${money(bill.total)}</strong></div>${bill.paymentMethod === 'Cash' ? `<div><span>Cash received</span><strong>${money(bill.cashTendered)}</strong></div><div><span>Change</span><strong>${money(bill.change)}</strong></div>` : ''}</div><p class="receipt-thanks">Thank you for visiting One Africa Shisha.</p><p class="receipt-legal">Please follow local age-verification and tobacco regulations.</p></div>`;
  $('#receipt-dialog').showModal();
}
function toast(message) {
  const element = $('#toast'); element.textContent = message; element.classList.add('show');
  window.setTimeout(() => element.classList.remove('show'), 2600);
}
function navigate() {
  const page = location.hash.slice(1) || 'dashboard';
  const valid = ['dashboard', 'billing', 'history'].includes(page) ? page : 'dashboard';
  document.querySelectorAll('.page').forEach(section => section.classList.toggle('active', section.id === `${valid}-page`));
  document.querySelectorAll('.main-nav a').forEach(link => link.classList.toggle('active', link.dataset.page === valid));
  $('#page-title').textContent = { dashboard: 'Dashboard', billing: 'New bill', history: 'Bill history' }[valid];
  $('#sidebar').classList.remove('open');
  if (valid === 'dashboard') renderDashboard();
  if (valid === 'history') renderHistory();
}
$('#date-label').textContent = new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
$('#product-search').addEventListener('input', event => { state.search = event.target.value; renderProducts(); });
$('#category-tabs').addEventListener('click', event => { const button = event.target.closest('[data-category]'); if (!button) return; state.category = button.dataset.category; renderProducts(); });
$('#product-grid').addEventListener('click', event => { const card = event.target.closest('[data-product]'); if (!card) return; const product = state.products.find(entry => entry.id === card.dataset.product); if (product) addToCart(product); });
$('#cart-items').addEventListener('input', event => {
  const field = event.target.closest('[data-flavor]');
  if (!field) return;
  const item = state.cart.find(entry => entry.id === field.dataset.flavor);
  if (item) item.flavors = field.value;
});
$('#cart-items').addEventListener('click', event => { const button = event.target.closest('[data-quantity]'); if (!button) return; const item = state.cart.find(entry => entry.id === button.dataset.id); if (!item) return; item.quantity += Number(button.dataset.quantity); if (item.quantity <= 0) state.cart = state.cart.filter(entry => entry.id !== item.id); renderCart(); });
$('#clear-cart').addEventListener('click', () => { if (!state.cart.length || confirm('Clear all items from this bill?')) { state.cart = []; $('#customer-name').value = ''; $('#discount').value = '0'; $('#tax-rate').value = '0'; renderCart(); } });
$('#discount').addEventListener('input', renderCart);
$('#tax-rate').addEventListener('input', renderCart);
$('#add-product-open').addEventListener('click', () => $('#product-dialog').showModal());
$('#new-category').addEventListener('change', event => {
  const isShisha = event.target.value === 'Shisha';
  $('#new-price').readOnly = isShisha;
  $('#new-price').value = isShisha ? String(SHISHA_PRICE) : '';
  $('#new-price').placeholder = isShisha ? 'Fixed at 20,000 UGX' : 'Enter price in UGX';
});
$('#product-form').addEventListener('submit', event => {
  event.preventDefault();
  const name = $('#new-name').value.trim(), category = $('#new-category').value;
  const price = category === 'Shisha' ? SHISHA_PRICE : Number($('#new-price').value);
  if (!name || !Number.isFinite(price) || price <= 0) return;
  const id = `custom-${Date.now()}`;
  state.products.push({ id, name, category, price }); save(); $('#product-form').reset(); $('#new-price').readOnly = false; $('#new-price').placeholder = 'Enter price in UGX'; $('#product-dialog').close(); state.category = category; renderProducts(); toast('Menu item added');
});
$('#checkout').addEventListener('click', () => { if (!state.cart.length) return; $('#payment-due').textContent = money(totals().total); $('#payment-error').textContent = ''; $('#payment-method').value = 'Cash'; $('#cash-tendered').value = ''; $('#served-by').value = ''; $('#cash-tender-wrap').classList.remove('hidden'); $('#payment-dialog').showModal(); });
$('#payment-method').addEventListener('change', () => { $('#cash-tender-wrap').classList.toggle('hidden', $('#payment-method').value !== 'Cash'); $('#payment-error').textContent = ''; });
$('#cash-tendered').addEventListener('input', () => { const due = totals().total, tendered = Number($('#cash-tendered').value); $('#change-due').textContent = tendered >= due ? money(tendered - due) : '—'; });
$('#payment-form').addEventListener('submit', event => {
  event.preventDefault();
  const servedBy = $('#served-by').value.trim();
  if (!servedBy) { $('#payment-error').textContent = 'Enter the name of the staff member serving this customer.'; $('#served-by').focus(); return; }
  const billTotals = totals(), paymentMethod = $('#payment-method').value;
  const cashTendered = paymentMethod === 'Cash' ? Number($('#cash-tendered').value) : billTotals.total;
  if (paymentMethod === 'Cash' && (!Number.isFinite(cashTendered) || cashTendered < billTotals.total)) { $('#payment-error').textContent = 'Cash received must be at least the total due.'; return; }
  const bill = { id: `OA-${Date.now().toString().slice(-8)}`, createdAt: new Date().toISOString(), customer: $('#customer-name').value.trim(), servedBy, items: state.cart.map(item => ({ ...item })), ...billTotals, taxRate: Math.min(100, Math.max(0, Number($('#tax-rate').value) || 0)), paymentMethod, cashTendered, change: paymentMethod === 'Cash' ? cashTendered - billTotals.total : 0, currency: 'UGX' };
  state.bills.push(bill); state.cart = []; $('#customer-name').value = ''; $('#discount').value = '0'; $('#tax-rate').value = '0'; save(); renderAll(); $('#payment-dialog').close(); showReceipt(bill); toast('Bill completed successfully');
});
document.addEventListener('click', event => {
  const close = event.target.closest('[data-close]');
  if (close) { document.getElementById(close.dataset.close).close(); return; }
  const view = event.target.closest('.view-bill');
  if (view) { const bill = state.bills.find(entry => entry.id === view.dataset.bill); if (bill) showReceipt(bill); }
});
$('#history-search').addEventListener('input', renderHistory);
$('#payment-filter').addEventListener('change', renderHistory);
$('#print-receipt').addEventListener('click', () => window.print());
$('#menu-toggle').addEventListener('click', () => $('#sidebar').classList.toggle('open'));
window.addEventListener('hashchange', navigate);
window.addEventListener('storage', event => { if (Object.values(STORAGE_KEYS).includes(event.key)) location.reload(); });
renderAll(); navigate();
