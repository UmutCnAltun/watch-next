import React, { useEffect, useState } from 'react';
import tmdbApi, { getPopularMovies, getMovieVideos, getMoviesByGenre, getSimilarMovies, getMovieCast } from './api/tmdb';
import MovieCard from './components/MovieCard';
import SkeletonCard from './components/SkeletonCard';
import Hero from './components/Hero'; // Hero bileşenini içeri aktardık

const genres = [
  { id: 28, name: 'Aksiyon' }, { id: 35, name: 'Komedi' },
  { id: 18, name: 'Dram' }, { id: 27, name: 'Korku' }, { id: 878, name: 'Bilim Kurgu' },
];

function App() {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [cast, setCast] = useState([]); 
  const [trailerKey, setTrailerKey] = useState(null);
  const [view, setView] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeGenre, setActiveGenre] = useState(null);
  const [isTrailerActive, setIsTrailerActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [heroMovie, setHeroMovie] = useState(null); // Hero için seçilen film

  useEffect(() => {
    if (view === 'all') fetchMovies();
    const saved = JSON.parse(localStorage.getItem('my-favorites')) || [];
    setFavorites(saved);
  }, [currentPage, activeGenre, view]);

  useEffect(() => {
    localStorage.setItem('my-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const fetchMovies = async () => {
    setIsLoading(true);
    const data = activeGenre 
      ? await getMoviesByGenre(activeGenre, currentPage) 
      : await getPopularMovies(currentPage);
    
    setMovies(data.results || []);
    
    // YENİ: Eğer ilk sayfadaysak ve kategori seçili değilse ilk filmi Hero yap
    if (data.results && data.results.length > 0 && currentPage === 1 && !activeGenre) {
      setHeroMovie(data.results[0]); 
    }
    
    setTotalPages(data.total_pages > 500 ? 500 : data.total_pages);
    setIsLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openModal = async (movie) => {
    setSelectedMovie(movie);
    setTrailerKey(null); 
    setIsTrailerActive(false); 
    setCast([]); 
    
    const [similar, key, movieCast] = await Promise.all([
      getSimilarMovies(movie.id),
      getMovieVideos(movie.id),
      getMovieCast(movie.id)
    ]);
    
    setSimilarMovies(similar);
    setTrailerKey(key); 
    setCast(movieCast); 
  };

  const handleSurpriseMe = () => {
    if (movies.length > 0) {
      const randomIndex = Math.floor(Math.random() * movies.length);
      openModal(movies[randomIndex]);
    }
  };

  const handleGenreClick = (id) => {
    setActiveGenre(id);
    setCurrentPage(1);
    setView('all');
    setQuery('');
  };

  const toggleFavorite = (movie) => {
    const isFav = favorites.some(f => f.id === movie.id);
    if (isFav) setFavorites(favorites.filter(f => f.id !== movie.id));
    else setFavorites([...favorites, movie]);
  };

  const searchMovies = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsLoading(true);
    const response = await tmdbApi.get('/search/movie', { params: { query } });
    setMovies(response.data.results);
    setView('all');
    setActiveGenre(null);
    setTotalPages(1);
    setIsLoading(false);
  };

  const displayedMovies = view === 'all' ? movies : favorites;

  return (
    <div className="min-h-screen bg-[#141414] text-white p-8">
      <header className="flex flex-col items-center mb-10">
        <h1 className="text-6xl font-black text-red-600 mb-6 italic tracking-tighter cursor-pointer" onClick={() => window.location.reload()}>WATCH NEXT</h1>
        
        <div className="flex gap-4 mb-6">
          <button onClick={() => setView('all')} className={`px-6 py-2 rounded-full font-bold transition-colors ${view === 'all' ? 'bg-red-600' : 'bg-gray-800 hover:bg-gray-700'}`}>Tüm Filmler</button>
          <button onClick={() => setView('favs')} className={`px-6 py-2 rounded-full font-bold transition-colors ${view === 'favs' ? 'bg-red-600' : 'bg-gray-800 hover:bg-gray-700'}`}>Favorilerim ({favorites.length})</button>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {genres.map(g => (
            <button key={g.id} onClick={() => handleGenreClick(g.id)} className={`px-4 py-1 rounded border text-sm transition-all ${activeGenre === g.id ? 'bg-white text-black border-white' : 'border-gray-700 text-gray-400 hover:border-red-600'}`}>{g.name}</button>
          ))}
        </div>

        <form onSubmit={searchMovies} className="w-full max-w-md flex gap-2">
          <input type="text" className="flex-1 bg-gray-900 border border-gray-700 focus:border-red-600 rounded-lg px-4 py-2 outline-none" placeholder="Film ara..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <button type="submit" className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-bold transition-colors">Ara</button>
          <button 
            type="button" 
            onClick={handleSurpriseMe} 
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-bold transition-all flex items-center justify-center shadow-lg"
            title="Rastgele Film Seç"
          >
            🎲
          </button>
        </form>
      </header>

      {/* --- HERO SECTION ENTEGRASYONU --- */}
      {!activeGenre && view === 'all' && currentPage === 1 && !isLoading && heroMovie && (
        <Hero movie={heroMovie} openModal={openModal} />
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {isLoading ? (
          [...Array(10)].map((_, i) => <SkeletonCard key={i} />)
        ) : (
          displayedMovies.map(movie => (
            <MovieCard 
              key={movie.id}
              movie={movie}
              openModal={openModal}
              toggleFavorite={toggleFavorite}
              isFavorite={favorites.some(f => f.id === movie.id)}
            />
          ))
        )}
      </div>

      {view === 'all' && movies.length > 0 && !isLoading && (
        <div className="flex justify-center items-center gap-6 mt-12 mb-8">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="bg-gray-800 hover:bg-red-600 disabled:opacity-20 px-6 py-2 rounded-lg font-bold transition-colors">Önceki</button>
          <span className="font-bold text-gray-400">Sayfa {currentPage} / {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="bg-gray-800 hover:bg-red-600 disabled:opacity-20 px-6 py-2 rounded-lg font-bold transition-colors">Sonraki</button>
        </div>
      )}

      {selectedMovie && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-4 z-50 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#181818] max-w-4xl w-full my-auto rounded-2xl overflow-hidden relative flex flex-col md:row shadow-2xl border border-gray-800">
            <button onClick={() => { setSelectedMovie(null); setIsTrailerActive(false); }} className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white w-10 h-10 rounded-full font-bold z-10 transition-colors shadow-lg">✕</button>
            <div className="flex flex-col md:flex-row h-full">
                <div className="md:w-1/3">
                    <img src={selectedMovie.poster_path ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}` : 'https://via.placeholder.com/500x750'} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="p-8 md:w-2/3 overflow-y-auto max-h-[90vh]">
                    {isTrailerActive && trailerKey ? (
                        <div className="aspect-video">
                            <iframe className="w-full h-full rounded-lg shadow-2xl" src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`} allowFullScreen title="trailer"></iframe>
                            <button onClick={() => setIsTrailerActive(false)} className="mt-4 text-red-500 hover:text-red-400 font-bold underline transition-colors">← Bilgilere Geri Dön</button>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-yellow-500 text-black px-2 py-0.5 rounded text-sm font-bold">TMDB {selectedMovie.vote_average?.toFixed(1)}</span>
                                <span className="text-gray-500 font-medium">{selectedMovie.release_date?.split('-')[0]}</span>
                            </div>
                            <h2 className="text-4xl font-black mb-4 tracking-tight">{selectedMovie.title}</h2>
                            <p className="text-gray-400 mb-8 leading-relaxed text-lg">{selectedMovie.overview || "Bu film için henüz bir açıklama girilmemiş."}</p>
                            
                            {trailerKey ? (
                                <button 
                                    onClick={() => setIsTrailerActive(true)}
                                    className="bg-white text-black px-8 py-3 rounded-lg font-bold mb-10 hover:bg-red-600 hover:text-white transition-all transform hover:scale-105"
                                >
                                    ▶ Fragmanı İzle
                                </button>
                            ) : (
                                <div className="bg-gray-800/50 text-gray-400 px-6 py-3 rounded-lg text-sm mb-10 inline-block italic border border-gray-700">
                                    🎬 Bu film için fragman henüz eklenmemiş.
                                </div>
                            )}

                            <div className="mt-4 border-t border-gray-800 pt-6">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-red-600 rounded-full"></span>
                                    Başrol Oyuncuları
                                </h3>
                                <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                                    {cast.length > 0 ? cast.map(person => (
                                        <div key={person.id} className="min-w-[90px] text-center group">
                                            <div className="relative mx-auto w-16 h-16 mb-2">
                                                <img 
                                                    src={person.profile_path ? `https://image.tmdb.org/t/p/w200${person.profile_path}` : 'https://via.placeholder.com/200x200?text=?'} 
                                                    className="w-full h-full object-cover rounded-full border-2 border-gray-700 group-hover:border-red-600 transition-all shadow-md" 
                                                    alt={person.name} 
                                                />
                                            </div>
                                            <p className="text-[10px] font-bold truncate w-full">{person.name}</p>
                                            <p className="text-[9px] text-gray-500 truncate w-full italic">{person.character}</p>
                                        </div>
                                    )) : <p className="text-gray-600 text-sm">Oyuncu bilgisi bulunamadı.</p>}
                                </div>
                            </div>

                            <div className="mt-8 border-t border-gray-800 pt-8">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                  <span className="w-1 h-6 bg-red-600 rounded-full"></span>
                                  Benzer Filmler
                                </h3>
                                <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar">
                                    {similarMovies.length > 0 ? similarMovies.map(sim => (
                                        <div key={sim.id} className="min-w-[130px] cursor-pointer group" onClick={() => openModal(sim)}>
                                            <div className="relative overflow-hidden rounded-lg mb-2 shadow-lg">
                                              <img src={sim.poster_path ? `https://image.tmdb.org/t/p/w200${sim.poster_path}` : 'https://via.placeholder.com/200x300'} className="group-hover:scale-110 transition-transform duration-300" alt="" />
                                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-white text-xs font-bold">İncele</span>
                                              </div>
                                            </div>
                                            <p className="text-[11px] font-bold truncate group-hover:text-red-500 transition-colors">{sim.title}</p>
                                        </div>
                                    )) : <p className="text-gray-600 italic">Benzer film bulunamadı.</p>}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;