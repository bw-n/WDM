const grid = document.getElementById('grid');
const filtersWrapper = document.getElementById('filters');

fetch('data.json')
  .then(res => res.json())
  .then(data => {
    for (let i = data.length; i < 100; i++) {
      data.push({ id: i });
    }

    data.forEach(entry => {
      const div = document.createElement('div');
      div.className = 'slot';

      // Ajoute les tags
      if (entry.tag) {
        const tags = Array.isArray(entry.tag) ? entry.tag : [entry.tag];
        div.setAttribute('data-tag', tags.join(','));
      }

      // TOOLTIP
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      let tooltipText = entry.label || 'Emplacement libre';
      if (entry.tag) {
        tooltipText += ` (${Array.isArray(entry.tag) ? entry.tag.join(', ') : entry.tag})`;
      }
      tooltip.textContent = tooltipText;

      // Slot avec image et lien
      if (entry.href && entry.image) {
        const link = document.createElement('a');
        link.href = entry.href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        const img = document.createElement('img');
        img.src = entry.image;
        img.alt = entry.label || '';
        link.appendChild(img);

        div.appendChild(link);
        div.appendChild(tooltip);
      } else if (entry.image) {
        const img = document.createElement('img');
        img.src = entry.image;
        img.alt = entry.label || '';
        div.appendChild(img);
        div.appendChild(tooltip);
      } else {
        div.classList.add('empty');
        div.textContent = '+';
        div.appendChild(tooltip);
      }

      grid.appendChild(div);
    });

    // ✅ Filtrage
    const filterButtons = document.querySelectorAll('#filters button[data-tag]');
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const selectedTag = button.getAttribute('data-tag');

        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        document.querySelectorAll('.slot').forEach(slot => {
          const slotTags = (slot.getAttribute('data-tag') || '').split(',').map(t => t.trim());

          if (selectedTag === 'all') {
            slot.classList.remove('tag-active', 'tag-muted');
          } else if (slotTags.includes(selectedTag)) {
            slot.classList.add('tag-active');
            slot.classList.remove('tag-muted');
          } else {
            slot.classList.remove('tag-active');
            slot.classList.add('tag-muted');
          }
        });
      });
    });
  })
  .catch(err => {
    console.error('Erreur JSON :', err);
  });
