
const searchlist = document.querySelector('.search__results');
const searchField = document.querySelector('.search__field');
const results = document.querySelector('.results');
let resultsChecker = 0;
let listenerAdd;

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
    item.removeEventListener('click', listenerAdd);
    item.remove();
  });
}

function findReps(input) {
  if (input.trim() == '') return;
  let searchUrl = 'https://api.github.com/search/repositories?q='+ input +'+in:name&per_page=5';
  fetch(searchUrl).then( res => res.json())
                  .then( res => {
                    clearSearch();
                    if (res && res.items) {
                    res.items.forEach((item) => {
                      let card = addRecommend(item);
                      let objectForAdding = {
                        name: item.name,
                        owner: item.owner.login,
                        stars: item.stargazers_count
                      };
                      let listenerAdd = () => {
                        addResult(objectForAdding);
                        searchField.value = '';
                        clearSearch();
                      };
                      card.addEventListener('click', listenerAdd);
                    });
                  };
                  });
}

const finderDebounced = debounce(findReps, 400);

function addRecommend(responseObj) {
  let recommendedCard = document.createElement('div');
  recommendedCard.classList.add('search__recommend');
  recommendedCard.textContent = responseObj.name;
  searchlist.append(recommendedCard);
  return recommendedCard;
}

function addResult(responseObj) {
  let resultCard = `
        <div class="results__card">
          <div class="results__list">
            <div class="results__info">Name: ${responseObj.name}</div>
            <div class="results__info">Owner: ${responseObj.owner}</div>
            <div class="results__info">Stars: ${responseObj.stars}</div>
          </div>
          <button class="results__close">REMOVE</button>
        </div>`;
  results.insertAdjacentHTML('beforeend', resultCard);
  if (resultsChecker == 0) {
    results.addEventListener('click', closer );
  };
  resultsChecker += 1;
}

const closer = (e) => {
  if (e.target.classList.contains('results__close')) {
    e.target.parentElement.remove();
    resultsChecker -= 1;
    if (resultsChecker == 0) {
      results.removeEventListener('click', closer );
    }
  };
  return;
}

searchField.addEventListener('input', (e) => {
  clearSearch();
  finderDebounced(searchField.value);
})
