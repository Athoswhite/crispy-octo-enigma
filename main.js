
var loadMoreButton = document.querySelector("#load-more");
// API client class to handle fetching data from the API
class APIClient {
    constructor(apiKey) {
      this.API_KEY = apiKey;
    }
  
    async fetchImages(url) {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: this.API_KEY
          }
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }
  
        const data = await response.json();
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  }
  
  // DOM manipulation class to handle rendering images in the gallery
  class GalleryRenderer {
    constructor(galleryElement) {
      this.galleryElement = galleryElement;
    }
  
    renderPhotos(photos) {
      photos.forEach((photo) => {
        const item = document.createElement('div');
        item.classList.add('item');
        item.innerHTML = `
          <a href='${photo.src.original}' target="_blank">
            <img src="${photo.src.medium}">
            <h3>${photo.photographer}</h3>
          </a>
          `;
        this.galleryElement.appendChild(item);
      });
    }
  
    clearGallery() {
      this.galleryElement.innerHTML = '';
    }
  }
  
  // PhotoGallery class to handle the overall logic of the photo gallery application
  class PhotoGallery {
    constructor() {
      this.API_KEY = API_KEY;
      this.galleryDiv = document.querySelector('.gallery');
      this.searchForm = document.querySelector('.header form');
      this.loadMore = document.querySelector('.load-more');
      this.logo = document.querySelector('.logo');
      this.pageIndex = 1;
      this.searchValueGlobal = '';
  
      this.apiClient = new APIClient(this.API_KEY);
      this.galleryRenderer = new GalleryRenderer(this.galleryDiv);
  
      this.eventHandle();
    }
  
    eventHandle() {
      document.addEventListener('DOMContentLoaded', () => {
        this.getImages();
      });
  
      this.searchForm.addEventListener('submit', (e) => {
        this.pageIndex = 1;
        this.getSearchedImages(e);
      });
  
      this.loadMore.addEventListener('click', (e) => {
        this.loadMoreImages(e);
      });
  
      this.logo.addEventListener('click', () => {
        this.pageIndex = 1;
        this.clearGallery();
        this.getImages();
      });
    }
  
    async getImages() {
      try {
        const url = `https://api.pexels.com/v1/curated?page=${this.pageIndex}&per_page=12`;
        const data = await this.apiClient.fetchImages(url);
        this.galleryRenderer.renderPhotos(data.photos);
        console.log(data);
      } catch (error) {
        // Handle error
      }
    }
  
    async getSearchedImages(e) {
      try {
        e.preventDefault();
        this.clearGallery();
        const searchValue = e.target.querySelector('input').value;
        this.searchValueGlobal = searchValue;
        const url = `https://api.pexels.com/v1/search?query=${searchValue}&page=1&per_page=12`;
        const data = await this.apiClient.fetchImages(url);
        this.galleryRenderer.renderPhotos(data.photos);
        e.target.reset();
      } catch (error) {
        // Handle error
      }
    }
  
    async loadMoreImages(e) {
      try {
        this.pageIndex++;
        const loadMoreData = e.target.getAttribute('data-img');
        this.clearGallery();
  
        if (loadMoreData === 'curated') {
          await this.getImages();
        } else {
          const url = `https://api.pexels.com/v1/search?query=${this.searchValueGlobal}&page=${this.pageIndex}&per_page=12`;
          const data = await this.apiClient.fetchImages(url);
          this.galleryRenderer.renderPhotos(data.photos);
        }
      } catch (error) {
        // Handle error
      }
    }
  
    clearGallery() {
      this.galleryRenderer.clearGallery();
    }
  }
  
  const gallery = new PhotoGallery();
  