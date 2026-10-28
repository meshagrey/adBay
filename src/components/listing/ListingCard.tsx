import React from 'react';
import { Heart, MapPin, ShieldCheck, Sparkles, Clock, CheckCircle } from 'lucide-react';
import { Listing } from '../../types';
import { useApp } from '../../context/AppContext';

interface ListingCardProps {
  listing: Listing;
  layout?: 'grid' | 'list';
}

export { ListingCardSkeleton, ListingCardSkeletonItem } from './ListingCardSkeleton';

export const ListingCard: React.FC<ListingCardProps> = ({ listing, layout = 'grid' }) => {
  const { setActiveListingId, toggleFavorite, isFavorite, addToRecentlyViewed } = useApp();

  const handleCardClick = () => {
    addToRecentlyViewed(listing.id);
    setActiveListingId(listing.id);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(listing.id);
  };

  const isFav = isFavorite(listing.id);

  // Format currency in Kenyan Shillings
  const formattedPrice = `KES ${listing.price.toLocaleString('en-KE')}`;

  // Time format helper
  const getTimeAgo = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  if (layout === 'list') {
    return (
      <div
        onClick={handleCardClick}
        className="adbay-card group flex items-start gap-2 p-1.5 cursor-pointer hover:border-[#00A859] relative transition rounded-[7px]"
      >
        {/* Thumbnail Image (3:4 portrait aspect ratio) */}
        <div className="relative w-24 sm:w-28 aspect-[3/4] max-h-[160px] shrink-0 rounded-[7px] overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={listing.images[0] || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400&auto=format&fit=crop&q=80'}
            alt={listing.title}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
          />
          {listing.promotionTier === 'featured' && (
            <span className="absolute top-1 left-1 bg-amber-500 text-gray-950 font-bold text-[9px] px-1 py-0.2 rounded shadow-xs uppercase tracking-tight flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" /> Featured
            </span>
          )}
          {listing.promotionTier === 'boosted' && (
            <span className="absolute top-1 left-1 bg-emerald-600 text-white font-bold text-[9px] px-1 py-0.2 rounded shadow-xs uppercase tracking-tight">
              Boosted
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
          <div>
            <div className="flex items-center justify-between gap-1">
              <span className="text-[#00A859] dark:text-[#10b981] font-semibold text-[13px] md:text-[14px] tracking-tight">
                {formattedPrice}
              </span>
              <button
                type="button"
                onClick={handleFavoriteClick}
                className="p-1 text-gray-400 hover:text-red-500 transition"
                aria-label="Save listing"
              >
                <Heart className={`w-4 h-4 ${isFav ? 'text-red-500 fill-red-500' : ''}`} />
              </button>
            </div>

            <h4 className="adbay-listing-title text-[11px] md:text-[12px] font-normal text-gray-900 dark:text-gray-100 line-clamp-2 md:line-clamp-3 leading-snug group-hover:text-[#00A859] transition">
              {listing.title}
            </h4>

            <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
              {listing.description}
            </p>
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 pt-1 border-t border-gray-100 dark:border-gray-800">
            <span className="flex items-center gap-1 truncate max-w-[140px]">
              <MapPin className="w-3 h-3 text-[#00A859] shrink-0" />
              <span className="truncate">{listing.county}, {listing.town}</span>
            </span>

            <div className="flex items-center gap-1.5 shrink-0">
              {listing.isNegotiable && (
                <span className="text-amber-600 dark:text-amber-400 font-medium">Negotiable</span>
              )}
              <span>•</span>
              <span>{getTimeAgo(listing.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid layout (Standard 5px gap adBay grid, cards taller than wide, consistent row heights)
  return (
    <div
      onClick={handleCardClick}
      className={`adbay-card group flex flex-col h-full justify-between cursor-pointer hover:border-[#00A859] relative transition overflow-hidden rounded-[7px] ${
        listing.promotionTier === 'featured' ? 'border-amber-400 dark:border-amber-500/60 ring-1 ring-amber-400/30' : ''
      }`}
    >
      {/* Product Image Container (3:4 portrait aspect ratio, target ~150-170px mobile, ~190-220px desktop) */}
      <div className="relative aspect-[3/4] w-full min-h-[145px] max-h-[175px] md:min-h-[190px] md:max-h-[220px] bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-t-[7px]">
        <img
          src={listing.images[0] || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400&auto=format&fit=crop&q=80'}
          alt={listing.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
        />

        {/* Promotion Badge */}
        {listing.promotionTier === 'featured' && (
          <span className="absolute top-1 left-1 bg-amber-500 text-gray-950 font-extrabold text-[9px] px-1.5 py-0.5 rounded shadow-xs uppercase tracking-tight flex items-center gap-0.5 z-10">
            <Sparkles className="w-2.5 h-2.5" /> Featured
          </span>
        )}

        {listing.promotionTier === 'boosted' && (
          <span className="absolute top-1 left-1 bg-[#00A859] text-white font-bold text-[9px] px-1.5 py-0.5 rounded shadow-xs uppercase tracking-tight z-10">
            Top Ad
          </span>
        )}

        {/* Condition Badge */}
        <span className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-xs text-white text-[9px] font-medium px-1.5 py-0.2 rounded uppercase">
          {listing.condition}
        </span>

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          className="absolute top-1 right-1 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition backdrop-blur-xs z-10"
          aria-label="Save listing"
        >
          <Heart className={`w-3.5 h-3.5 ${isFav ? 'text-red-500 fill-red-500' : 'text-white'}`} />
        </button>
      </div>

      {/* Card Content with unbolded 11px mobile title and prominent price */}
      <div className="p-1.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Price (visually prominent) & Negotiable tag */}
          <div className="flex items-baseline justify-between gap-1 mb-0.5">
            <span className="font-semibold text-[13px] md:text-[14px] tracking-tight text-[#00A859] dark:text-[#10b981]">
              {formattedPrice}
            </span>
            {listing.isNegotiable && (
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium shrink-0">
                Negotiable
              </span>
            )}
          </div>

          {/* Title: strictly unbold (font-normal), 11px mobile / 12px desktop, clamped to 2-3 lines */}
          <h4 className="adbay-listing-title text-[11px] md:text-[12px] font-normal text-gray-900 dark:text-gray-100 line-clamp-2 md:line-clamp-3 leading-snug group-hover:text-[#00A859] transition">
            {listing.title}
          </h4>
        </div>

        {/* Seller & Location Footer */}
        <div className="mt-1.5 pt-1 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1 truncate max-w-[130px]">
            <MapPin className="w-3 h-3 text-[#00A859] shrink-0" />
            <span className="truncate">{listing.county}, {listing.town}</span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {listing.isVerifiedSeller && (
              <span title="Verified Business Store" className="text-blue-500">
                <CheckCircle className="w-3 h-3 inline" />
              </span>
            )}
            <span>{getTimeAgo(listing.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
