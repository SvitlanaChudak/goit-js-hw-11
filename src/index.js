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

    const { elements: { searchQuery }, } = evt.currentTarget;
    const query = searchQuery.value.trim();

    if (!query) {
        return Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }
    picApiService.resetPage();
    gallery.innerHTML = '';
    load.classList.add('is-hidden');
    picApiService.searchValue = query;
    try {
        const hits = await picApiService.fetchPic();
        createMarkup(hits);
        const Showload = picApiService.fetchPic();
        if (Showload) {
            load.classList.remove('is-hidden');
        }
    } catch (error) {}
}

const simpleligthbox = new SimpleLightbox('.gallery-item', {
    captions: true,
    captionSelector: "img",
    captionType: "alt",
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

async function onLoad(evt) {
  picApiService.incrementPage();
  const Showload = picApiService.getMorePics();
  if (!Showload) {
    load.classList.add('is-hidden');
  }
  try {
    const hits = await picApiService.fetchPic();
    console.log(hits);
    createMarkup(hits);
  } catch (error) {}
}









