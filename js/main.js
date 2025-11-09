/* js/main.js
   - Loads products.json with skeleton animation
   - Renders cards with micro-interactions (tilt + spring)
   - Search & filter functions
*/

let allProducts = [];
const productSection = document.getElementById('product-section');
const searchBox = document.getElementById('searchBox');

// show skeleton placeholders
function showSkeletons(count = 6) {
  productSection.innerHTML = '';
  for (let i=0;i<count;i++) {
    const s = document.createElement('div');
    s.className = 'skeleton';
    s.innerHTML = `
      <div class="skel-img shimmer"></div>
      <div style="height:12px"></div>
      <div class="skel-line shimmer" style="width:70%"></div>
      <div style="height:10px"></div>
      <div class="skel-line shimmer" style="width:45%"></div>
    `;
    productSection.appendChild(s);
  }
}

// helper: create DOM card
function createCard(p) {
  const card = document.createElement('div');
  card.className = 'card';
  card.setAttribute('data-tilt','true');

  // inner wrapper for tilt transform
  const inner = document.createElement('div');
  inner.className = 'card-inner';

  inner.innerHTML = `
    <div class="badge">Deal</div>
    <div class="img-wrap"><img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.title)}" loading="lazy"/></div>
    <h3>${escapeHTML(p.title)}</h3>
    <p>${escapeHTML(p.description || '')}</p>
    <div class="row">
      <a class="btn" href="${escapeHTML(p.link)}" target="_blank" rel="noopener">View on Amazon</a>
    </div>
  `;
  card.appendChild(inner);

  // micro-interactions: tilt and springy shadow
  attachTilt(card, inner);

  // subtle entrance
  card.style.opacity = 0;
  setTimeout(()=>{ card.style.transition = 'opacity 450ms ease, transform 450ms cubic-bezier(.2,.9,.3,1)'; card.style.opacity = 1 }, 40);

  return card;
}

// escape minimal
function escapeHTML(s='') {
  return String(s).replace(/[&<>"']/g, function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]; });
}

// attach tilt behaviour to card
function attachTilt(card, inner) {
  let rect = null;
  const strength = 12; // degrees
  card.addEventListener('mousemove', e=>{
    rect = rect || card.getBoundingClientRect();
    const rx = (e.clientX - rect.left) / rect.width;
    const ry = (e.clientY - rect.top) / rect.height;
    const dx = (rx - 0.5) * strength;
    const dy = (0.5 - ry) * strength;
    inner.style.transform = `rotateX(${dy}deg) rotateY(${dx}deg) translateZ(6px)`;
  });
  card.addEventListener('mouseleave', ()=>{
    inner.style.transform = 'rotateX(0) rotateY(0) translateZ(0)';
  });
  card.addEventListener('mousedown', ()=>{
    inner.style.transition = 'transform 120ms';
    inner.style.transform += ' scale(0.995)';
    setTimeout(()=> inner.style.transition = '', 160);
  });
}

// load products.json with graceful fallback
async function loadProducts() {
  showSkeletons(6);
  try {
    // small artificial network delay for skeleton demo
    await new Promise(r => setTimeout(r, 600));

    const res = await fetch('products.json', {cache: "no-store"});
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    allProducts = Array.isArray(data) ? data : [];
    renderProducts(allProducts);
  } catch (err) {
    console.error(err);
    productSection.innerHTML = `<p style="text-align:center;color:var(--muted);padding:40px">Unable to load products. Please check products.json</p>`;
  }
}

function renderProducts(list) {
  productSection.innerHTML = '';
  if (!list.length) {
    productSection.innerHTML = `<p style="text-align:center;color:var(--muted);padding:40px">No products yet.</p>`;
    return;
  }
  const frag = document.createDocumentFragment();
  list.forEach(p => frag.appendChild(createCard(p)));
  productSection.appendChild(frag);
}

// filter and search
function filterProducts(cat) {
  if (!allProducts.length) return;
  if (cat === 'all') renderProducts(allProducts);
  else renderProducts(allProducts.filter(x => String(x.category || '').toLowerCase() === cat.toLowerCase()));
}

function searchProducts(q) {
  const ql = String(q || '').trim().toLowerCase();
  if (!ql) renderProducts(allProducts);
  else {
    const filtered = allProducts.filter(p => {
      return (p.title || '').toLowerCase().includes(ql) ||
             (p.description || '').toLowerCase().includes(ql) ||
             (p.category || '').toLowerCase().includes(ql);
    });
    renderProducts(filtered);
  }
}

// wire search input
if (searchBox) searchBox.addEventListener('input', (e)=> searchProducts(e.target.value));

// initial load
loadProducts();

// expose functions for header links (global)
window.filterProducts = filterProducts;
window.searchProducts = searchProducts;
