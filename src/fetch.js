import axios from 'axios';

export class PicApiService {
    constructor() {
        this.searchValue = '';
        this.page = 1;
        this.totalHits = 0;
    }
        
        async fetchPic() {
            const BASE_URL = 'https://pixabay.com/api/';
            const API_KEY = '31623736-4a8fa2402be59476e61396bec';
            const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;

            const response = await axios.get(url);
            this.totalHits = response.data.totalHits;
            return (response.data.hits);
    }
    
  get value() {
    return this.searchValue;
    }
    
  set value(newValue) {
    this.searchValue = newValue;
    }
    
  getMorePics() {
    return this.page < Math.ceil(this.totalHits/40)
    }
    
  incrementPage() {
    this.page += 1;
    }
    
  resetPage() {
    this.page = 1;
    }
    
}
 
        

    
