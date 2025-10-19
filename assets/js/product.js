// product.js — Naut Store

document.addEventListener("DOMContentLoaded", async () => {
  const baseURL = "https://cdn.jsdelivr.net/gh/Bernardo-Ribeiro/Naut-Store@main/assets/img/";
  const galleryContainer = document.querySelector(".gallery");
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  if (!productId) return;

  // Se a imagem já for uma URL completa, não adiciona o baseURL
  const resolveURL = (path) => (path.startsWith("http") ? path : baseURL + path);

  try {
    const res = await fetch("./data/products.json");
    const products = await res.json();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // --- Atualiza informações principais ---
    document.title = `${product.name} — Naut Store`;
    document.querySelector("h2").textContent = product.name;
    document.querySelector(".long-desc").textContent = product.description;
    document.querySelector(".price-large").textContent = `US$ ${product.price}`;

    // --- Atualiza imagem principal ---
    const media = document.querySelector(".product-media");
    media.innerHTML = `<img src="${resolveURL(product.gallery[0])}" alt="${product.name}">`;

    // --- Monta galeria ---
    galleryContainer.innerHTML = "";
    product.gallery.forEach((img, index) => {
      const thumb = document.createElement("img");
      thumb.src = resolveURL(img);
      if (index === 0) thumb.classList.add("active");

      thumb.addEventListener("click", () => {
        media.querySelector("img").src = resolveURL(img);
        document.querySelectorAll(".gallery img").forEach(i => i.classList.remove("active"));
        thumb.classList.add("active");
      });

      galleryContainer.appendChild(thumb);
    });

    // --- Atualiza o botão PayPal ---
    const priceBuyContainer = document.querySelector(".price-buy");

    // Se o produto tiver um botão personalizado no JSON, substitui o formulário padrão
    if (product.button) {
      priceBuyContainer.querySelector("form")?.remove();
      const div = document.createElement("div");
      div.innerHTML = product.button; // HTML vindo do JSON
      priceBuyContainer.appendChild(div);
    } else {
      // Caso contrário, preenche o formulário padrão com os dados
      document.querySelector('input[name="item_name"]').value = product.name;
      document.querySelector('input[name="amount"]').value = product.price;
    }

  } catch (err) {
    console.error("Erro ao carregar produto:", err);
  }
});
