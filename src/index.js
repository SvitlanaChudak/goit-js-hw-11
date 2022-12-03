import './css/style.css';
import { Notify } from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { PicApiService } from './fetch';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const load = document.querySelector('.load-more');

const picApiService = new PicApiService();

form.addEventListener('submit', onSearch);
load.addEventListener('click', onLoad);

async function onSearch(evt) {
    evt.preventDefault();

    const query = evt.currentTarget.elements.searchQuery.value.trim();
    picApiService.searchValue = query;

    if (!query) {
        Notify.info('Empty request');
        gallery.innerHTML = '';
        load.classList.add('is-hidden');
        return
    }
        picApiService.resetPage();
    load.classList.add('is-hidden');
  gallery.innerHTML = '';

        try {
          const { hits, totalHits } = await picApiService.fetchPic();

        if (!hits.length) {
            Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            return
        }
          createMarkup(hits);
            const Showload = picApiService.getMorePics();
            if (Showload) {
            Notify.success(`Hooray! We found ${totalHits} images.`)
              load.classList.remove('is-hidden');
          }

    } catch (error) {Notify.failure(`${error}`);}
}

const simpleligthbox = new SimpleLightbox('.gallery-item', {
    captionsData: "alt",
    captionDelay: 250,
    captionPosition: "bottom",
});

function createMarkup(data) {
    let markup = data
        .map(item => {
            return `
    <div class="photo-card">
    <a class="gallery-item" href="${item.largeImageURL}">
  <img src="${item.webformatURL}" alt="${item.tags}" width="300" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes: </b>${item.likes}
    </p>
    <p class="info-item">
      <b>Views: </b>${item.views}
    </p>
    <p class="info-item">
      <b>Comments: </b> ${item.comments}
    </p>
    <p class="info-item">
      <b>Downloads: </b>${item.downloads}
    </p>
  </div>
</div>`;
}).join('');
    gallery.insertAdjacentHTML('beforeend', markup);
    simpleligthbox.refresh()
}

async function onLoad() {
  picApiService.incrementPage();
  const Showload = picApiService.getMorePics();

  if (!Showload) {
    load.classList.add('is-hidden');
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
  try {
    const { hits } = await picApiService.fetchPic();
    console.log(hits);
    createMarkup(hits);

    if (picApiService.page > 1) {
      smoothScroll();
    }
    
  } catch (error) {Notify.failure(`${error}`);}
}

    function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}


