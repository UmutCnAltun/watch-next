import React from 'react';

const Hero = ({ movie, openModal }) => {
  if (!movie) return null;

  return (
    <div className="relative h-[70vh] w-full mb-10 group cursor-pointer" onClick={() => openModal(movie)}>
      {/* Arka Plan Görseli */}
      <div className="absolute inset-0">
        <img 
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} 
          alt={movie.title}
          className="w-full h-full object-cover rounded-3xl"
        />
        {/* Karartma Efekti (Overlay) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/20 to-transparent rounded-3xl"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-transparent to-transparent rounded-3xl"></div>
      </div>

      {/* Film Bilgileri */}
      <div className="absolute bottom-10 left-10 max-w-2xl">
        <h2 className="text-5xl md:text-7xl font-black mb-4 drop-shadow-2xl">{movie.title}</h2>
        <p className="text-gray-200 text-lg line-clamp-3 mb-6 drop-shadow-md">
          {movie.overview}
        </p>
        <div className="flex gap-4">
          <button className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-red-600 hover:text-white transition-all">
            Detayları Gör
          </button>
          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg border border-gray-700">
             <span className="text-yellow-500 font-bold">★</span>
             <span className="font-bold">{movie.vote_average.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;