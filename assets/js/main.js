// main.js — Naut Store

document.addEventListener("DOMContentLoaded", () => {
  const baseURL = "https://cdn.jsdelivr.net/gh/Bernardo-Ribeiro/Naut-Store@main/assets/img/";
  const productList = document.getElementById("product-list");
  const buttons = document.querySelectorAll(".category-btn");
  const searchInput = document.getElementById("searchInput");

  let allProducts = [];

  // Helpers para preço/gratuito
  const parsePrice = (value) => {
    if (value === undefined || value === null) return NaN;
    if (typeof value === "number") return value;
    // normaliza vírgula para ponto
    const normalized = String(value).trim().replace(",", ".");
    const num = parseFloat(normalized);
    return isNaN(num) ? NaN : num;
  };
  const isFree = (p) => p?.free === true || parsePrice(p?.price) === 0;

  // === Carregar JSON de produtos ===
  fetch("data/products.json")
    .then(response => response.json())
    .then(products => {
      allProducts = products;
      renderProducts(products);
    })
    .catch(err => {
      productList.innerHTML = "<p>Error loading products.</p>";
      console.error(err);
    });

  // === Clique nos botões de categoria ===
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelector(".category-btn.active")?.classList.remove("active");
      btn.classList.add("active");
      const category = btn.dataset.category;
      const q = searchInput?.value || "";
      filterAndRender(category, q);
    });
  });

  // === Pesquisa ===
  if (searchInput) {
    searchInput.addEventListener("input", e => {
      const active = document.querySelector(".category-btn.active")?.dataset.category || "all";
      filterAndRender(active, e.target.value);
    });
  }

  // === Filtrar e renderizar ===
  function filterAndRender(category, q) {
    const query = q.trim().toLowerCase();
    const filtered = allProducts.filter(p => {
      const matchesFree = category === "free" ? isFree(p) : true;
      const matchesCat = category === "all" || category === "free" || p.category === category;
      const matchesText =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.shortDesc.toLowerCase().includes(query);
      return matchesCat && matchesFree && matchesText;
    });
    renderProducts(filtered);
  }

  // === Renderizar produtos ===
  function renderProducts(list) {
    const grid = document.querySelector(".grid");
    grid.innerHTML = "";

    list.forEach(p => {
      const card = document.createElement("article");
      card.className = "card";
      card.dataset.category = p.category;

      // Aplica o baseURL à imagem principal
      const imgURL = p.image.startsWith("http") ? p.image : baseURL + p.image;
      const priceLabel = isFree(p) ? "Free" : `US$ ${p.price}`;

      card.innerHTML = `
        <div class="card-img" style="background-image: url('${imgURL}')"></div>
        <div class="card-body">
          <h3 class="card-title">${p.name}</h3>
          <p class="card-desc">${p.shortDesc}</p>
          <div class="card-footer">
            <span class="price">${priceLabel}</span>
            <a class="details" href="product.html?id=${p.id}">View</a>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });
  }

});
