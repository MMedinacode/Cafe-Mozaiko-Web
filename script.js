/* ============================================================
   NAVEGACIÓN SPA POR PESTAÑAS
   ============================================================ */
const panels = document.querySelectorAll('.tab-panel');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealObserver.unobserve(e.target); } });
}, { threshold: 0.15 });

function goToTab(tabId) {
  panels.forEach(p => p.classList.toggle('active', p.dataset.tabPanel === tabId));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.tab === tabId));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.getElementById('main-nav').classList.remove('open');
  const activePanel = document.querySelector('.tab-panel.active');
  if (activePanel) activePanel.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

document.querySelectorAll('[data-tab]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    goToTab(el.dataset.tab);
  });
});

document.querySelectorAll('.tab-panel.active .reveal').forEach(el => revealObserver.observe(el));

document.getElementById('navToggle').addEventListener('click', () => {
  document.getElementById('main-nav').classList.toggle('open');
});

/* ---------- LOADER BREVE ---------- */
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('hidden'), 250);
});

/* ============================================================
   CARTA — solo los productos que la propia gente menciona en
   Maps/reseñas como destacados. Sin precios reales disponibles
   en ningún lado (ni Maps ni Instagram) -> todo marcado
   "Consultar", nunca inventado. Carta puramente informativa,
   sin carrito (no hay canal de pedido confirmado).
   ============================================================ */
const MENU = [
  { cat: 'Café', items: [
    { n: 'Espresso', d: 'Uno de los cafés más pedidos según sus propios clientes.' },
    { n: 'Espresso Doble', d: 'Destacado como "Popular" en la ficha de Google del local.' },
    { n: 'Capuchino', d: 'Mencionado seguido en las reseñas como muy rico.' },
    { n: 'Chocolate Caliente', d: 'El producto más destacado de su ficha de Google.' },
  ]},
  { cat: 'Té', items: [
    { n: 'Selección de té', d: '"Muy buena selección de té" es un aspecto destacado real de su ficha de Google — variedad a confirmar en el local.' },
  ]},
  { cat: 'Postres', items: [
    { n: 'Torta del día', d: 'Las reseñas mencionan seguido lo rica que es la torta — variedad a confirmar en el local.' },
    { n: 'Helado', d: 'Otro de los productos "Popular" según su ficha de Google.' },
  ]},
  { cat: 'Salado', items: [
    { n: 'Sándwich', d: 'Uno de los términos más mencionados en las reseñas (24 menciones) — variedad a confirmar en el local.' },
    { n: 'Cositas saladas', d: 'Así las describen sus propios clientes — carta variada, a confirmar en el local.' },
  ]},
];

const tabsEl = document.getElementById('menuTabs');
const panelsEl = document.getElementById('menuPanels');

MENU.forEach((g, i) => {
  const tab = document.createElement('button');
  tab.className = 'menu-tab' + (i === 0 ? ' active' : '');
  tab.textContent = g.cat;
  tab.dataset.key = g.cat;
  tab.addEventListener('click', () => showMenuTab(g.cat));
  tabsEl.appendChild(tab);

  const panel = document.createElement('div');
  panel.className = 'menu-panel' + (i === 0 ? ' active' : '');
  panel.id = 'panel-' + g.cat;

  const grid = document.createElement('div');
  grid.className = 'menu-grid';
  g.items.forEach(item => {
    const row = document.createElement('div');
    row.className = 'menu-item';

    const textWrap = document.createElement('div');
    textWrap.className = 'menu-item-text';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'name';
    nameSpan.textContent = item.n;
    textWrap.appendChild(nameSpan);

    const descDiv = document.createElement('div');
    descDiv.className = 'desc';
    descDiv.textContent = item.d;
    textWrap.appendChild(descDiv);

    const priceDiv = document.createElement('div');
    priceDiv.className = 'price mono';
    priceDiv.textContent = 'Consultar';

    row.appendChild(textWrap);
    row.appendChild(priceDiv);
    grid.appendChild(row);
  });
  panel.appendChild(grid);
  panelsEl.appendChild(panel);
});

function showMenuTab(key) {
  document.querySelectorAll('.menu-tab').forEach(t => t.classList.toggle('active', t.dataset.key === key));
  document.querySelectorAll('.menu-panel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + key));
}

/* ---------- INDICADOR ABIERTO/CERRADO EN VIVO (horario real de Instagram) ---------- */
(function () {
  const dot = document.getElementById('statusDot');
  const text = document.getElementById('statusText');
  const visitStatus = document.getElementById('visit-status');
  const now = new Date();
  const day = now.getDay(); // 0 dom ... 6 sáb
  const minutes = now.getHours() * 60 + now.getMinutes();
  let openMin, closeMin;
  if (day >= 1 && day <= 5) { openMin = 7 * 60 + 30; closeMin = 21 * 60 + 30; } // Lun-Vie
  else { openMin = 9 * 60; closeMin = 21 * 60; } // Sáb-Dom
  const isOpen = minutes >= openMin && minutes < closeMin;
  const label = isOpen ? 'Abierto ahora' : 'Cerrado ahora';
  text.textContent = label;
  dot.classList.toggle('closed', !isOpen);
  if (visitStatus) {
    visitStatus.textContent = label;
    visitStatus.className = 'mono';
    visitStatus.style.cssText = 'font-size:0.72rem; letter-spacing:0.1em; text-transform:uppercase; color:' + (isOpen ? '#6fae66' : '#d9694f') + ';';
  }
})();
