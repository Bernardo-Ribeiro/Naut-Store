// product.js — Naut Store

document.addEventListener("DOMContentLoaded", async () => {
  const baseURL = "https://cdn.jsdelivr.net/gh/Bernardo-Ribeiro/Naut-Store@main/assets/img/";
  const galleryContainer = document.querySelector(".gallery");
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  if (!productId) return;

  // If the image is already a full URL, don't prepend the baseURL
  const resolveURL = (path) => (path.startsWith("http") ? path : baseURL + path);

  // Helpers for price/free items
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

    // --- Update main information ---
    document.title = `${product.name} — Naut Store`;
    document.querySelector("h2").textContent = product.name;
    document.querySelector(".long-desc").textContent = product.description;
    document.querySelector(".price-large").textContent = isFree(product) ? "Free" : `US$ ${product.price}`;

    // --- Update main image ---
    const media = document.querySelector(".product-media");
    media.innerHTML = `<img src="${resolveURL(product.gallery[0])}" alt="${product.name}">`;

    // --- Build gallery ---
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

    // --- Update purchase / download area ---
    const priceBuyContainer = document.querySelector(".price-buy");
    const form = priceBuyContainer.querySelector("form");
    const button = priceBuyContainer.querySelector("button.buy-button");

    // If the product is free, remove the PayPal form and show a download button
    if (isFree(product)) {
      form?.remove();

      // Use product.downloadUrl if available; otherwise try a GitHub releases pattern by id
      const downloadUrl = "https://cdn.jsdelivr.net/gh/Bernardo-Ribeiro/Naut-Store@main/assets/files/" + (product.downloadUrl || product.download || product.file || null);

      const cta = document.createElement("a");
      cta.className = "buy-button download-button";
      cta.textContent = "Download for free";
      cta.setAttribute("rel", "noopener noreferrer");
      cta.setAttribute("target", "_blank");

      if (downloadUrl) {
        cta.href = downloadUrl;
      } else {
        // Keep the button disabled if no download URL is defined
        cta.href = "#";
        cta.setAttribute("aria-disabled", "true");
        cta.style.opacity = "0.7";
        cta.style.pointerEvents = "none";
        cta.textContent = "Download unavailable";
      }
      priceBuyContainer.appendChild(cta);

    } else {
      if (!form) return;

      const hostedButtonIdMatch = product.button?.match(/name=['"]hosted_button_id['"][^>]*value=['"]([^'"]+)['"]/i);
      const hostedButtonId = hostedButtonIdMatch?.[1];

      if (hostedButtonId) {
        form.action = "https://www.paypal.com/cgi-bin/webscr";
        form.querySelector('input[name="cmd"]').value = "_s-xclick";
        let hostedButtonInput = form.querySelector('input[name="hosted_button_id"]');
        if (!hostedButtonInput) {
          hostedButtonInput = document.createElement("input");
          hostedButtonInput.type = "hidden";
          hostedButtonInput.name = "hosted_button_id";
          form.appendChild(hostedButtonInput);
        }
        hostedButtonInput.value = hostedButtonId;
      } else {
        form.querySelector('input[name="cmd"]').value = "_xclick";
        form.querySelector('input[name="business"]').value = "YOUR_PAYPAL_EMAIL";
        form.querySelector('input[name="item_name"]').value = product.name;
        form.querySelector('input[name="amount"]').value = product.price;
      }

      if (button) {
        button.textContent = "Buy with PayPal";
      }
    }

  } catch (err) {
    console.error("Error loading product:", err);
  }
});
