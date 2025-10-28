// product.js — Naut Store

document.addEventListener("DOMContentLoaded", async () => {
  const baseURL = "https://cdn.jsdelivr.net/gh/Bernardo-Ribeiro/Naut-Store@main/assets/img/";
  const galleryContainer = document.querySelector(".gallery");
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  if (!productId) return;

  // Se a imagem já for uma URL completa, não adiciona o baseURL
  const resolveURL = (path) => (path.startsWith("http") ? path : baseURL + path);

  // Helpers para preço/gratuito
  const parsePrice = (value) => {
    if (value === undefined || value === null) return NaN;
    if (typeof value === "number") return value;
    const normalized = String(value).trim().replace(",", ".");
    const num = parseFloat(normalized);
    return isNaN(num) ? NaN : num;
  };
  const isFree = (p) => p?.free === true || parsePrice(p?.price) === 0;

  try {
    const res = await fetch("./data/products.json");
    const products = await res.json();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // --- Atualiza informações principais ---
    document.title = `${product.name} — Naut Store`;
    document.querySelector("h2").textContent = product.name;
    document.querySelector(".long-desc").textContent = product.description;
    document.querySelector(".price-large").textContent = isFree(product) ? "Free" : `US$ ${product.price}`;

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

    // --- Atualiza a área de compra / download ---
    const priceBuyContainer = document.querySelector(".price-buy");

    // Se for grátis, remove PayPal e mostra botão de download
    if (isFree(product)) {
      priceBuyContainer.querySelector("form")?.remove();

      // Usa product.downloadUrl se existir; caso contrário tenta um padrão por id em releases do GitHub
      const downloadUrl = "https://cdn.jsdelivr.net/gh/Bernardo-Ribeiro/Naut-Store@main/assets/files/" + (product.downloadUrl || product.download || product.file || null);

      const cta = document.createElement("a");
      cta.className = "buy-button download-button";
      cta.textContent = "Download for free";
      cta.setAttribute("rel", "noopener noreferrer");
      cta.setAttribute("target", "_blank");

      if (downloadUrl) {
        cta.href = downloadUrl;
      } else {
        // Mantém o botão desabilitado se não tiver URL de download definida
        cta.href = "#";
        cta.setAttribute("aria-disabled", "true");
        cta.style.opacity = "0.7";
        cta.style.pointerEvents = "none";
        cta.textContent = "Download unavailable";
      }
      priceBuyContainer.appendChild(cta);

    } else {
      // Produto pago: usa botão personalizado do JSON se houver, senão preenche formulário padrão
      if (product.button) {
        priceBuyContainer.querySelector("form")?.remove();
        const div = document.createElement("div");
        div.innerHTML = product.button; // HTML vindo do JSON
        priceBuyContainer.appendChild(div);
      } else {
        document.querySelector('input[name="item_name"]').value = product.name;
        document.querySelector('input[name="amount"]').value = product.price;
      }
    }

  } catch (err) {
    console.error("Error loading product:", err);
  }
});
