(function () {
  const apiKey = 'ec04a7b6f1eb47a5bbe728e05bffed59';
  const apiUrl = 'https://news-api-v2.herokuapp.com';
  const form = document.forms['newsControls'];
  const searchInput = form.elements['search'];
  const selectCategory = document.querySelector('.filter-select #category');

  async function displayNews(mode, value) {
    try {
      toggleLoadingAnimation(true);

      let url;
      if (mode === 'category') {
        url = `${apiUrl}/top-headlines?country=us&category=${value}&apiKey=${apiKey}`;
      } else {
        // mode === 'search'
        url = `${apiUrl}/everything?q=${value}&apiKey=${apiKey}`;
      }

      const response = await fetch(url).then((res) => res.json());

      renderNews(response.articles, value);
    } catch (error) {
      console.error('Error happened during news fetching:', error);
      // TODO: display error message
    } finally {
      toggleLoadingAnimation(false);
    }
  }

  function toggleLoadingAnimation(isVisible) {
    const newsLoader = document.querySelector('.news-loader');
    if (isVisible) {
      newsLoader.classList.add('flex');
      newsLoader.classList.remove('hidden');
    } else {
      newsLoader.classList.add('hidden');
      newsLoader.classList.remove('flex');
    }
  }

  function renderNews(news, newsCategory) {
    if (!news.length) {
      console.error('No news');
      return;
    }

    const newsContainer = document.querySelector('.news-container');
    let fragment = '';

    news.forEach((newsItem) => {
      const template = renderNewsTemplate(newsItem, newsCategory);
      fragment += template;
    });

    newsContainer.innerHTML = fragment;
  }

  function renderNewsTemplate(newsItem, newsCategory) {
    let months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    let date = new Date(Date.parse(newsItem.publishedAt));
    let monthsName = months[date.getMonth()];

    return `
    <div class="py-8 px-6 lg:w-1/3">
        <div class="h-full flex items-start">
            <div class="w-12 flex-shrink-0 flex flex-col text-center leading-none">
                <span class="text-gray-500 pb-2 mb-2 border-b-2 border-gray-200">${monthsName}</span>
                <span class="font-medium text-lg text-gray-800 title-font leading-none">${date.getDay()}</span>
            </div>
            <div class="flex-grow pl-6">
                <h2 class="tracking-widest text-xs title-font font-medium text-indigo-500 uppercase mb-1">${newsCategory}</h2>
                <h1 class="title-font text-xl font-medium text-gray-900 mb-3">${
                  newsItem.title
                }</h1>
                <p class="leading-relaxed mb-5">
                    ${newsItem.description} 
                    <a class="text-indigo-500 inline-flex items-center" 
                        target="_blank" href="${newsItem.url}">Read more
                        <svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
                    </a>
                </p>
                <a class="inline-flex items-center">
                    <img alt="blog" src="${
                      newsItem.urlToImage || 'https://picsum.photos/286/160'
                    }" class="w-10 h-10 rounded-full flex-shrink-0 object-cover object-center">
                    <span class="pl-3 break-all title-font font-medium text-gray-900">${
                      newsItem.author || 'no author'
                    }</span>
                </a>
            </div>
        </div>
    </div>
  `;
  }

  // Change category
  selectCategory.addEventListener('change', () => {
    searchInput.value = '';
    void displayNews('category', selectCategory.value);
  });

  // Search
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    void displayNews('search', searchInput.value);
  });

  void displayNews('category', 'general');
})();
