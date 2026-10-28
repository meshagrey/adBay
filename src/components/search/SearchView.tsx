import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  ArrowUpDown,
  LayoutGrid,
  List,
  X,
  Search as SearchIcon,
  MapPin,
  Check,
  Tag,
  DollarSign,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ListingCard, ListingCardSkeleton } from '../listing/ListingCard';
import { ListingCondition } from '../../types';

export const SearchView: React.FC = () => {
  const {
    listings,
    isListingsLoading,
    categories,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    selectedCounty,
    setSelectedCounty,
    selectedTown,
    setSelectedTown,
    setIsLocationPickerOpen,
  } = useApp();

  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [conditionFilter, setConditionFilter] = useState<'all' | ListingCondition>('all');
  const [sellerTypeFilter, setSellerTypeFilter] = useState<'all' | 'individual' | 'business'>('all');
  const [negotiableOnly, setNegotiableOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'popular'>('newest');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Active Category & Subcategory references
  const currentCategory = categories.find((c) => c.id === selectedCategory);

  // Filter listings
  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      // Must be active
      if (l.status !== 'active') return false;

      // Keyword search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = l.title.toLowerCase().includes(q);
        const matchesDesc = l.description.toLowerCase().includes(q);
        const matchesCat = l.categoryId.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCat) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && l.categoryId !== selectedCategory) {
        return false;
      }

      // Subcategory filter
      if (selectedSubcategory !== 'all' && l.subcategoryId !== selectedSubcategory) {
        return false;
      }

      // County filter
      if (selectedCounty !== 'All Kenya' && l.county !== selectedCounty) {
        return false;
      }

      // Town filter
      if (selectedTown !== 'All Towns' && l.town !== selectedTown) {
        return false;
      }

      // Min price
      if (minPrice && l.price < Number(minPrice)) {
        return false;
      }

      // Max price
      if (maxPrice && l.price > Number(maxPrice)) {
        return false;
      }

      // Condition
      if (conditionFilter !== 'all' && l.condition !== conditionFilter) {
        return false;
      }

      // Seller Type
      if (sellerTypeFilter !== 'all' && l.sellerType !== sellerTypeFilter) {
        return false;
      }

      // Negotiable only
      if (negotiableOnly && !l.isNegotiable) {
        return false;
      }

      return true;
    });
  }, [
    listings,
    searchQuery,
    selectedCategory,
    selectedSubcategory,
    selectedCounty,
    selectedTown,
    minPrice,
    maxPrice,
    conditionFilter,
    sellerTypeFilter,
    negotiableOnly,
  ]);

  // Sort listings
  const sortedListings = useMemo(() => {
    return [...filteredListings].sort((a, b) => {
      // Boosted & Featured items get natural priority in relevance
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'price-asc') {
        return a.price - b.price;
      }
      if (sortBy === 'price-desc') {
        return b.price - a.price;
      }
      if (sortBy === 'popular') {
        return b.viewsCount - a.viewsCount;
      }
      return 0;
    });
  }, [filteredListings, sortBy]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setSelectedCounty('All Kenya');
    setSelectedTown('All Towns');
    setMinPrice('');
    setMaxPrice('');
    setConditionFilter('all');
    setSellerTypeFilter('all');
    setNegotiableOnly(false);
    setSortBy('newest');
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== 'all' ||
    selectedCounty !== 'All Kenya' ||
    minPrice ||
    maxPrice ||
    conditionFilter !== 'all' ||
    sellerTypeFilter !== 'all' ||
    negotiableOnly;

  return (
    <div className="max-w-[1250px] mx-auto px-2 sm:px-3 py-3">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h2 className="font-bold text-[16px] text-gray-900 dark:text-white flex items-center gap-1.5">
            <span>Marketplace Results</span>
            <span className="text-[12px] font-medium text-gray-500">
              ({sortedListings.length} ads found)
            </span>
          </h2>

          {/* Active Breadcrumb / Location Indicator */}
          <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
            <span className="text-[#00A859] font-medium">
              {selectedCategory === 'all' ? 'All Kenya' : currentCategory?.name}
            </span>
            <span>•</span>
            <span>{selectedCounty}</span>
            {searchQuery && (
              <>
                <span>•</span>
                <span>Keyword: "{searchQuery}"</span>
              </>
            )}
          </div>
        </div>

        {/* View toggles & Sort options */}
        <div className="flex items-center gap-1.5">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="md:hidden px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded text-[12px] font-medium flex items-center gap-1"
          >
            <Filter className="w-3.5 h-3.5 text-[#00A859]" />
            <span>Filters {hasActiveFilters ? '(Active)' : ''}</span>
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-1 bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded px-2 py-1 text-[12px]">
            <ArrowUpDown className="w-3 h-3 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none cursor-pointer text-[12px]"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          {/* Grid vs List toggle */}
          <div className="hidden sm:flex items-center border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-[#131c31] overflow-hidden">
            <button
              onClick={() => setLayoutMode('grid')}
              className={`p-1.5 transition ${
                layoutMode === 'grid'
                  ? 'bg-[#00A859] text-white'
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLayoutMode('list')}
              className={`p-1.5 transition ${
                layoutMode === 'list'
                  ? 'bg-[#00A859] text-white'
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Filter + Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
        {/* Left Filter Sidebar (col-span-3) */}
        <aside
          className={`md:col-span-3 space-y-2 text-[13px] ${
            isMobileFilterOpen ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="border border-gray-200 dark:border-gray-800 rounded p-3 bg-white dark:bg-[#131c31] space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-gray-100 dark:border-gray-800">
              <span className="font-bold text-[13px] text-gray-900 dark:text-white flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#00A859]" /> Filter Listings
              </span>
              {hasActiveFilters && (
                <button
                  onClick={resetAllFilters}
                  className="text-[11px] text-[#00A859] hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubcategory('all');
                }}
                className="w-full p-1.5 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[12px] text-gray-900 dark:text-white"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Subcategories if category selected */}
              {currentCategory && currentCategory.subcategories.length > 0 && (
                <div className="mt-1.5 pl-1 space-y-1">
                  <label className="text-[10px] text-gray-400 uppercase font-semibold">Subcategory</label>
                  <select
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                    className="w-full p-1 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[11px] text-gray-900 dark:text-white"
                  >
                    <option value="all">All in {currentCategory.name}</option>
                    {currentCategory.subcategories.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Location Filter */}
            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Location (Kenya)
              </label>
              <button
                onClick={() => setIsLocationPickerOpen(true)}
                className="w-full p-1.5 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[12px] text-left flex items-center justify-between text-gray-800 dark:text-gray-200"
              >
                <span className="flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 text-[#00A859] shrink-0" />
                  <span className="truncate">{selectedCounty}</span>
                </span>
                <span className="text-[10px] text-[#00A859] font-medium shrink-0">Change</span>
              </button>
            </div>

            {/* Price Range Filter (KES) */}
            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Price (KES)
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  placeholder="Min KES"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-2 py-1 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[12px] text-gray-900 dark:text-white"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Max KES"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-2 py-1 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[12px] text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Condition Filter */}
            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Condition
              </label>
              <div className="grid grid-cols-2 gap-1 text-[11px]">
                {['all', 'new', 'used', 'refurbished'].map((cond) => (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => setConditionFilter(cond as any)}
                    className={`py-1 px-1.5 rounded capitalize text-center border transition ${
                      conditionFilter === cond
                        ? 'bg-[#00A859] text-white border-[#00A859] font-semibold'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            {/* Seller Type Filter */}
            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Seller Type
              </label>
              <div className="space-y-1 text-[12px]">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="sellerType"
                    checked={sellerTypeFilter === 'all'}
                    onChange={() => setSellerTypeFilter('all')}
                    className="accent-[#00A859]"
                  />
                  <span>All Sellers</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="sellerType"
                    checked={sellerTypeFilter === 'business'}
                    onChange={() => setSellerTypeFilter('business')}
                    className="accent-[#00A859]"
                  />
                  <span>Verified Business Stores</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="sellerType"
                    checked={sellerTypeFilter === 'individual'}
                    onChange={() => setSellerTypeFilter('individual')}
                    className="accent-[#00A859]"
                  />
                  <span>Individual Sellers</span>
                </label>
              </div>
            </div>

            {/* Negotiable Only Checkbox */}
            <div className="pt-1 border-t border-gray-100 dark:border-gray-800">
              <label className="flex items-center gap-1.5 cursor-pointer text-[12px]">
                <input
                  type="checkbox"
                  checked={negotiableOnly}
                  onChange={(e) => setNegotiableOnly(e.target.checked)}
                  className="accent-[#00A859]"
                />
                <span>Negotiable Price Only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Right Listings Results (col-span-9) */}
        <main className="md:col-span-9">
          {isListingsLoading ? (
            layoutMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[5px]">
                <ListingCardSkeleton count={10} layout="grid" />
              </div>
            ) : (
              <div className="space-y-[5px]">
                <ListingCardSkeleton count={6} layout="list" />
              </div>
            )
          ) : sortedListings.length === 0 ? (
            <div className="border border-gray-200 dark:border-gray-800 rounded p-8 text-center bg-white dark:bg-[#131c31] space-y-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto text-gray-400">
                <SearchIcon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-[15px] text-gray-900 dark:text-white">
                No advertisements match your criteria
              </h3>
              <p className="text-[13px] text-gray-500 max-w-sm mx-auto">
                Try broadening your search keyword, selecting "All Kenya", or clearing your price filters.
              </p>
              <button
                onClick={resetAllFilters}
                className="px-4 py-1.5 rounded bg-[#00A859] text-white font-bold text-[12px] hover:bg-[#00924c]"
              >
                Reset All Filters
              </button>
            </div>
          ) : layoutMode === 'grid' ? (
            /* Strict 5px grid for cards */
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[5px]">
              {sortedListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} layout="grid" />
              ))}
            </div>
          ) : (
            /* Strict 5px gap list */
            <div className="space-y-[5px]">
              {sortedListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} layout="list" />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
