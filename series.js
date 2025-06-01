fetch('series.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('series-container');

    Object.keys(data).sort((a, b) => b - a).forEach(year => {
      const yearSection = document.createElement('div');
      yearSection.className = 'series-year';

      const yearHeader = document.createElement('h3');
      yearHeader.textContent = year;
      yearHeader.style.cursor = 'pointer';

      const list = document.createElement('ul');
      list.className = 'series-list';
      list.style.display = 'none';

      yearHeader.addEventListener('click', () => {
        list.style.display = list.style.display === 'none' ? 'block' : 'none';
      });

      const sorted = data[year].sort((a, b) => b.rating - a.rating);

      sorted.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
          <div class="series-card">
            <img src="${item.image}" alt="${item.title}" class="series-image">
            <div class="series-content">
              <div class="series-title">${item.title}</div>
              <div class="series-rating">${'★'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)}</div>
              <div class="series-review">${item.review}</div>
            </div>
          </div>
        `;
        list.appendChild(li);
      });

      yearSection.appendChild(yearHeader);
      yearSection.appendChild(list);
      container.appendChild(yearSection);
    });
  });
