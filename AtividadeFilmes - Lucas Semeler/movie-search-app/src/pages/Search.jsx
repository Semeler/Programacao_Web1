import { useState } from "react";
import { searchMovies } from "../api/tmdb";
import { Link } from "react-router-dom";

export default function Search() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError("");
    
    try {
      const results = await searchMovies(query);
      setMovies(results);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Erro ao buscar filmes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>🎬 Buscar Filmes</h1>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Digite o nome do filme..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>

      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="movies-list">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <Link to={`/movie/${movie.id}`}>
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
              <h3>{movie.title} ({movie.release_date?.split("-")[0]})</h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
