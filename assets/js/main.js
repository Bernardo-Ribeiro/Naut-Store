// main.js — Naut Store

document.addEventListener("DOMContentLoaded", () => {
  const baseURL = "https://cdn.jsdelivr.net/gh/Bernardo-Ribeiro/Naut-Store@main/assets/img/";
  const productList = document.getElementById("product-list");
  const buttons = document.querySelectorAll(".category-btn");
  const searchInput = document.getElementById("searchInput");

  let allProducts = [];

  // === Carregar JSON de produtos ===
  fetch("data/products.json")
    .then(response => response.json())
    .then(products => {
      allProducts = products;
      renderProducts(products);
    })
    .catch(err => {
      productList.innerHTML = "<p>Erro ao carregar produtos.</p>";
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
      const matchesCat = category === "all" || p.category === category;
      const matchesText =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.shortDesc.toLowerCase().includes(query);
      return matchesCat && matchesText;
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

      card.innerHTML = `
        <div class="card-img" style="background-image: url('${imgURL}')"></div>
        <div class="card-body">
          <h3 class="card-title">${p.name}</h3>
          <p class="card-desc">${p.shortDesc}</p>
          <div class="card-footer">
            <span class="price">R$ ${p.price}</span>
            <a class="details" href="product.html?id=${p.id}">Ver</a>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });
  }

});
