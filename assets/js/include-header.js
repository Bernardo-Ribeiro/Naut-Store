document.addEventListener("DOMContentLoaded", async () => {
  const mountPoints = document.querySelectorAll("[data-include='header']");
  if (!mountPoints.length) return;

  try {
    const response = await fetch("header.html");
    const headerHTML = await response.text();
    mountPoints.forEach((mountPoint) => {
      mountPoint.innerHTML = headerHTML;
    });
  } catch (error) {
    console.error("Error loading shared header:", error);
  }
});