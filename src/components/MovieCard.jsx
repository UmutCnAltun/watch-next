import React from 'react';

const MovieCard = ({ movie, openModal, toggleFavorite, isFavorite }) => {
  // Puan rengini belirleyen fonksiyon
  const getRatingColor = (rating) => {
    if (rating >= 7) return 'bg-green-600';
    if (rating >= 5) return 'bg-yellow-500';
    return 'bg-red-600';
  };

  return (
    <div 
      onClick={() => openModal(movie)} 
      className="bg-gray-900 rounded-xl overflow-hidden hover:scale-105 transition-all cursor-pointer relative group shadow-2xl border border-transparent hover:border-red-600"
    >
      {/* PUAN ROZETİ */}
      <div className={`absolute top-2 left-2 px-2 py-1 rounded-md text-[10px] font-black z-10 shadow-md text-white ${getRatingColor(movie.vote_average)}`}>
        {movie.vote_average?.toFixed(1) || '0.0'}
      </div>

      {/* FİLM POSTERİ */}
      <img 
        src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750'} 
        className="w-full h-auto" 
        alt={movie.title} 
      />
      
      {/* ALT BİLGİ ALANI */}
      <div className="p-3 bg-gradient-to-t from-black to-gray-900">
        <h3 className="text-sm font-bold truncate text-white">{movie.title}</h3>
        <p className="text-[10px] text-gray-500 font-semibold">
          {movie.release_date ? movie.release_date.split('-')[0] : 'Belirsiz'}
        </p>
      </div>

      {/* FAVORİ BUTONU */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(movie);
        }} 
        className="absolute top-2 right-2 text-xl drop-shadow-md hover:scale-125 transition-transform"
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>
    </div>
  );
};

export default MovieCard;