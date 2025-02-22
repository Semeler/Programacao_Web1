import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const api = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY, language: "pt-BR" },
});

// Buscar filmes por nome
export const searchMovies = async (query) => {
  const response = await api.get(`/search/movie`, { params: { query } });
  return response.data.results;
};

// Obter detalhes do filme
export const getMovieDetails = async (id) => {
  const response = await api.get(`/movie/${id}`);
  return response.data;
};
