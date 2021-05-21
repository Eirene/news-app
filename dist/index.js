(function (){
    const apiKey = 'ec04a7b6f1eb47a5bbe728e05bffed59';
    const apiUrl = 'https://news-api-v2.herokuapp.com';
    const form = document.forms['newsControls'];
    const searchInput = form.elements['search'];

    const selectCategory = document.querySelector('.filter-select #category');
    let newsCategory = 'general';

    function newsService(url, callback) {
        toggleLoadingAnimation(true);
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);

        xhr.addEventListener('load', () => {
            const response = JSON.parse(xhr.responseText);
            callback(response.articles);
            toggleLoadingAnimation(false);
        });
        xhr.addEventListener('error', () => {
            toggleLoadingAnimation(false);
            console.log('error');
        });

        xhr.send();
    }

    function toggleLoadingAnimation(isVisible){
        const newsLoader = document.querySelector('.news-loader');
        if (isVisible) {
            newsLoader.classList.add('flex');
            newsLoader.classList.remove('hidden');
        } else {
            newsLoader.classList.add('hidden');
            newsLoader.classList.remove('flex');
        }
    }

    setTimeout(newsService, 2500,
        `${apiUrl}/top-headlines?country=us&category=${newsCategory}&apiKey=${apiKey}`, renderNews);

    function renderNews(news){
        if (!news.length) {
            console.error('No news');
            return;
        }

        const newsContainer = document.querySelector('.news-container');
        let fragment = '';

        news.forEach( newsItem => {
            const template = renderNewsTemplate(newsItem);
            fragment += template;
        });

        newsContainer.insertAdjacentHTML('afterbegin', fragment);
    }

    function renderNewsTemplate(newsItem) {
        let months = [ "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December" ];

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
                <h1 class="title-font text-xl font-medium text-gray-900 mb-3">${newsItem.title}</h1>
                <p class="leading-relaxed mb-5">
                    ${newsItem.description} 
                    <a class="text-indigo-500 inline-flex items-center" 
                        target="_blank" href="${newsItem.url}">Read more
                        <svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
                    </a>
                </p>
                <a class="inline-flex items-center">
                    <img alt="blog" src="${newsItem.urlToImage || 'https://picsum.photos/286/160'}" class="w-10 h-10 rounded-full flex-shrink-0 object-cover object-center">
                    <span class="pl-3 break-all title-font font-medium text-gray-900">${newsItem.author || 'no author'}</span>
                </a>
            </div>
        </div>
    </div>
  `;
    }

    //Change category
    selectCategory.addEventListener('change', selectCategoryHandler);

    function selectCategoryHandler(){
        newsCategory = selectCategory.value;
        newsService(`${apiUrl}/top-headlines?country=us&category=${newsCategory}&apiKey=${apiKey}`, renderNews);
    }

    form.addEventListener('submit', e => {
        e.preventDefault();
        newsService(`${apiUrl}/everything?q=${searchInput.value}&apiKey=${apiKey}`, renderNews);
    });
})();


// publishedAt: "2021-05-18T15:52:05Z"
// url: "https://www.cnbc.com/2021/05/18/covid-vaccine-cdc-study-finds-disparities-in-coverage-between-rural-and-urban-areas.html"