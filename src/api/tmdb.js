import axios from 'axios';

const API_KEY = 'ENTER_YOUR_KEY_HERE';
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'tr-TR',
  },
});

export const getPopularMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/movie/popular', { params: { page } });
    return response.data;
  } catch (error) {
    return { results: [], total_pages: 1 };
  }
};

export const getMovieVideos = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}/videos`);
    const trailer = response.data.results.find(
      (vid) => vid.type === "Trailer" && vid.site === "YouTube"
    );
    return trailer ? trailer.key : null;
  } catch (error) {
    return null;
  }
};

export const getMoviesByGenre = async (genreId, page = 1) => {
  try {
    const response = await tmdbApi.get('/discover/movie', {
      params: { with_genres: genreId, page }
    });
    return response.data;
  } catch (error) {
    return { results: [], total_pages: 1 };
  }
};

export const getSimilarMovies = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}/similar`);
    return response.data.results.slice(0, 6); 
  } catch (error) {
    return [];
  }
};

// YENİ: Oyuncuları getiren fonksiyon
export const getMovieCast = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}/credits`);
    return response.data.cast.slice(0, 10); // İlk 10 oyuncu yeterli
  } catch (error) {
    return [];
  }
};

export default tmdbApi;