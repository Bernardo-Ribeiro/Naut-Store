// product.js — Naut Store
document.addEventListener("DOMContentLoaded", () => {
  const mainImage = document.querySelector(".product-media img");
  const galleryImages = document.querySelectorAll(".gallery img");

  if (!mainImage || !galleryImages.length) return;

  galleryImages.forEach(img => {
    img.addEventListener("click", () => {
      // Troca a imagem principal pela clicada
      mainImage.src = img.src;

      // Remove destaque das outras miniaturas
      galleryImages.forEach(i => i.classList.remove("active"));
      img.classList.add("active");
    });
  });
});
