import React from 'react';
import {
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  Store,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CategoryBar } from './CategoryBar';
import { ListingCard, ListingCardSkeleton } from '../listing/ListingCard';

export const HomeView: React.FC = () => {
  const {
    listings,
    isListingsLoading,
    categories,
    selectedCounty,
    setSelectedCounty,
    setSelectedCategory,
    setActiveView,
    platformSettings,
  } = useApp();

  // Active listings
  const activeListings = listings.filter((l) => l.status === 'active');

  // Sponsored / Boosted listings
  const boostedListings = activeListings.filter((l) => l.promotionTier === 'boosted');

  // Featured listings
  const featuredListings = activeListings.filter((l) => l.promotionTier === 'featured');

  // Combined priority sponsored & featured for section 4
  const priorityListings = [...boostedListings, ...featuredListings].slice(0, 12);

  // Latest / Recently added listings (Section 5)
  const recentListings = [...activeListings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 18);

  // Location based listings (Section 6)
  const targetCounty = selectedCounty === 'All Kenya' ? 'Nairobi' : selectedCounty;
  const countyListings = activeListings.filter((l) => l.county === targetCounty).slice(0, 12);

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    setActiveView('search');
  };

  return (
    <div className="space-y-2 pb-4">
      {/* 2. Existing compact buyer-safety notice */}
      {platformSettings.showEmergencyBanner && (
        <div className="max-w-[1250px] mx-auto px-2 sm:px-3 pt-1">
          <div className="bg-amber-500/10 border border-amber-500/25 px-2.5 py-1 rounded text-[12px] text-amber-800 dark:text-amber-300 flex items-center justify-between gap-1.5 shadow-2xs">
            <div className="flex items-center gap-1.5 truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="truncate">
                <strong>Safety Notice:</strong> {platformSettings.emergencyBannerText}
              </span>
            </div>
            <button
              onClick={() => setActiveView('safety')}
              className="text-[11px] text-[#00A859] hover:underline font-semibold shrink-0 ml-1 cursor-pointer"
            >
              Tips →
            </button>
          </div>
        </div>
      )}

      {/* 3. Horizontally scrollable product categories */}
      <CategoryBar />

      <div className="max-w-[1250px] mx-auto px-2 sm:px-3 space-y-[6px]">
        {/* 4. Sponsored or featured listings, when available */}
        {priorityListings.length > 0 && (
          <section className="space-y-[5px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="p-0.5 rounded bg-amber-500/10 text-amber-500">
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
                <h2 className="font-bold text-[14px] md:text-[15px] text-gray-900 dark:text-white">
                  Featured & Sponsored Deals
                </h2>
              </div>
              <button
                onClick={() => setActiveView('search')}
                className="text-[12px] font-semibold text-[#00A859] hover:underline flex items-center gap-0.5"
              >
                <span>View all</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Strict 5px grid: 2 cols on mobile, adapting to 5-6 cols on desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-[5px]">
              {isListingsLoading ? (
                <ListingCardSkeleton count={6} />
              ) : (
                priorityListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))
              )}
            </div>
          </section>
        )}

        {/* 5. Latest listings in a responsive product grid */}
        <section className="space-y-[5px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#00A859]" />
              <h2 className="font-bold text-[14px] md:text-[15px] text-gray-900 dark:text-white">
                Latest Listings in Kenya
              </h2>
            </div>
            <button
              onClick={() => setActiveView('search')}
              className="text-[12px] font-semibold text-[#00A859] hover:underline flex items-center gap-0.5"
            >
              <span>See more ({activeListings.length})</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Strict 5px grid: 2 cols on mobile, adapting to 5-6 cols on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-[5px]">
            {isListingsLoading ? (
              <ListingCardSkeleton count={12} />
            ) : (
              recentListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))
            )}
          </div>
        </section>

        {/* 6. Listings in Selected County / Trending */}
        <section className="space-y-[5px] pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#00A859]" />
              <h2 className="font-bold text-[14px] md:text-[15px] text-gray-900 dark:text-white">
                Trending in {targetCounty}
              </h2>
            </div>
            <button
              onClick={() => {
                setSelectedCounty(targetCounty);
                setActiveView('search');
              }}
              className="text-[12px] font-semibold text-[#00A859] hover:underline flex items-center gap-0.5"
            >
              <span>Browse {targetCounty}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Strict 5px grid: 2 cols on mobile, adapting to 5-6 cols on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-[5px]">
            {isListingsLoading ? (
              <ListingCardSkeleton count={6} />
            ) : (
              countyListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
