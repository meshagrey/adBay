import React from 'react';
import { Heart, Search, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ListingCard, ListingCardSkeleton } from '../listing/ListingCard';

export const FavoritesView: React.FC = () => {
  const { listings, isListingsLoading, favorites, setActiveView } = useApp();

  const favoriteListings = listings.filter((l) => favorites.includes(l.id));

  return (
    <div className="max-w-[1250px] mx-auto px-2 sm:px-3 py-3 space-y-3">
      <div className="flex items-center justify-between p-3 bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('home')}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 sm:hidden"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded bg-red-500/10 text-red-500 flex items-center justify-center">
            <Heart className="w-4 h-4 fill-red-500" />
          </div>
          <div>
            <h2 className="font-bold text-[16px] text-gray-900 dark:text-white">
              Saved Advertisements
            </h2>
            <p className="text-[12px] text-gray-500">
              You have {favoriteListings.length} saved item{favoriteListings.length === 1 ? '' : 's'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveView('search')}
          className="px-3 py-1.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-[12px] font-semibold hover:bg-gray-200 flex items-center gap-1"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Explore More</span>
        </button>
      </div>

      {isListingsLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-[5px]">
          <ListingCardSkeleton count={6} />
        </div>
      ) : favoriteListings.length === 0 ? (
        <div className="border border-gray-200 dark:border-gray-800 rounded p-12 text-center bg-white dark:bg-[#131c31] space-y-2">
          <Heart className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="font-bold text-[15px] text-gray-900 dark:text-white">No saved ads yet</h3>
          <p className="text-[13px] text-gray-500">
            Click the heart icon on any ad to bookmark it and compare later.
          </p>
          <button
            onClick={() => setActiveView('home')}
            className="mt-2 px-4 py-1.5 rounded bg-[#00A859] text-white font-bold text-[12px]"
          >
            Browse Today's Deals
          </button>
        </div>
      ) : (
        /* Strict 5px grid: 2 cols on mobile, 5-6 cols on desktop */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-[5px]">
          {favoriteListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};
