import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-gray-800/30 rounded-xl overflow-hidden animate-pulse relative border border-gray-800">
      {/* Poster Alanı */}
      <div className="aspect-[2/3] bg-gray-700/50"></div>
      
      {/* Yazı Alanları */}
      <div className="p-3">
        <div className="h-4 bg-gray-700/50 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-700/50 rounded w-1/4"></div>
      </div>
      
      {/* Sol Üstteki Puan Rozeti Yeri */}
      <div className="absolute top-2 left-2 w-8 h-5 bg-gray-700/50 rounded"></div>
    </div>
  );
};

export default SkeletonCard;