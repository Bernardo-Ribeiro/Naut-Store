// filtro por categoria e pesquisa simples
document.addEventListener('DOMContentLoaded', function () {
  const catButtons = document.querySelectorAll('.cat-btn');
  const cards = document.querySelectorAll('.card');
  const searchInput = document.getElementById('searchInput');

  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('.cat-btn.active').classList.remove('active');
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      filter(cat, searchInput.value);
    });
  });

  searchInput.addEventListener('input', e => {
    const active = document.querySelector('.cat-btn.active').dataset.cat;
    filter(active, e.target.value);
  });

  function filter(category, q) {
    const qLower = q.trim().toLowerCase();
    cards.forEach(card => {
      const matchesCat = (category === 'all') || (card.dataset.category === category);
      const title = card.querySelector('.card-title').textContent.toLowerCase();
      const desc = card.querySelector('.card-desc').textContent.toLowerCase();
      const matchesText = !qLower || title.includes(qLower) || desc.includes(qLower);
      card.style.display = (matchesCat && matchesText) ? '' : 'none';
    });
  }
});
