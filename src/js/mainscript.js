
const searchlist = document.querySelector('.search__results');
const searchField = document.querySelector('.search__field');
const results = document.querySelector('.results');

const debounce = (fn, debounceTime) => {
    let delay;
    return function() {

        clearTimeout(delay);
        delay = setTimeout(()=>{
            fn.apply(this, arguments);
        }, debounceTime);
    };
};

function clearSearch() {
  searchlist.querySelectorAll('.search__recommend').forEach((item) => {
    item.remove();
  });
}

function findReps(input) {
  let searchUrl = 'https://api.github.com/search/repositories?q='+ input +'+in:name&per_page=5';
  fetch(searchUrl).then( res => res.json())
                  .then( res => {
                    res.items.forEach((item) => {
                      addRecommend(item);
                    });
                  });
}

const finderDebounced = debounce(findReps, 400);

function addRecommend(responseObj) {
  let recommendedCard = document.createElement('div');
  recommendedCard.classList.add('search__recommend');
  recommendedCard.textContent = responseObj.name;
  recommendedCard.setAttribute('objName', responseObj.name);
  recommendedCard.setAttribute('owner', responseObj.owner.login);
  recommendedCard.setAttribute('stars', responseObj.stargazers_count);
  searchlist.append(recommendedCard);
}

function addResult(responseObj) {
  let resultCard = `
        <div class="results__card">
          <ul class="results__list">
            <li class="results__info">Name: ${responseObj.name}</li>
            <li class="results__info">Owner: ${responseObj.owner}</li>
            <li class="results__info">Stars: ${responseObj.stars}</li>
          </ul>
          <button class="results__close">REMOVE</button>
        </div>`;
  results.insertAdjacentHTML('beforeend', resultCard);
}

results.addEventListener('click', (e) => {
  if (e.target.classList.contains('results__close')) {
    e.target.parentElement.remove();
  };
  return;
});

searchField.addEventListener('input', (e) => {
  clearSearch();
  finderDebounced(searchField.value);
});

searchlist.addEventListener('click', (e) => {
  if (e.target.classList.contains('search__recommend')) {
    addResult({ name: e.target.getAttribute('objName'), owner: e.target.getAttribute('owner'), stars: e.target.getAttribute('stars')});
    searchField.value = '';
    clearSearch();
  };
  return;
});
