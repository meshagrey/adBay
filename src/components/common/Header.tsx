import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  MapPin,
  Plus,
  PlusCircle,
  Heart,
  MessageSquare,
  Sun,
  Moon,
  MoreVertical,
  User,
  ShieldCheck,
  Store,
  Layers,
  ChevronDown,
  X,
  History,
  TrendingUp,
  LogIn,
  LogOut,
  LayoutDashboard,
  FileText,
  Lock,
  PhoneCall,
  ShieldAlert,
  CheckCircle,
  Bell,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import { UserRole } from '../../types';

export const Header: React.FC = () => {
  const {
    activeView,
    setActiveView,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedCounty,
    selectedTown,
    setIsLocationPickerOpen,
    setIsPostAdOpen,
    setIsAuthModalOpen,
    currentUser,
    currentRole,
    switchRole,
    logoutUser,
    favorites,
    conversations,
    isDarkMode,
    toggleTheme,
    categories,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    showToast,
  } = useApp();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isGuestAuthPromptOpen, setIsGuestAuthPromptOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Welcome to adBay Kenya!',
      desc: 'Browse verified listings, contact local sellers, or post your first free ad.',
      time: 'Just now',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'M-Pesa Fast Boost Active',
      desc: 'Feature your advertisements to reach 10x more buyers across all 47 counties.',
      time: '2h ago',
      read: false,
    },
    {
      id: 'notif-3',
      title: 'Safety Tip: Meet in Public',
      desc: 'Always verify goods in person before paying. Stay safe with adBay verified sellers.',
      time: '1d ago',
      read: true,
    },
  ]);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  // Close search suggestions, user menu, and notifications on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addRecentSearch(searchQuery.trim());
      setIsSearchFocused(false);
      setIsMobileSearchOpen(false);
      setActiveView('search');
    }
  };

  const handleSuggestionClick = (term: string) => {
    setSearchQuery(term);
    addRecentSearch(term);
    setIsSearchFocused(false);
    setIsMobileSearchOpen(false);
    setActiveView('search');
  };

  // Handle Post an Ad click: check if user is a guest, prompt to authenticate/choose role
  const handlePostAdClick = () => {
    if (currentRole === 'guest' || !currentUser) {
      setIsGuestAuthPromptOpen(true);
    } else {
      setIsPostAdOpen(true);
    }
  };

  // Complete guest login and redirect immediately into listing creation flow
  const handleGuestLogin = (roleToSelect: UserRole = 'seller') => {
    switchRole(roleToSelect);
    setIsGuestAuthPromptOpen(false);
    showToast(`Signed in as ${roleToSelect.toUpperCase()}. Opening listing creation...`, 'success');
    setTimeout(() => {
      setIsPostAdOpen(true);
    }, 200);
  };

  const unreadMessagesCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const rolesList: { role: UserRole; label: string; desc: string; icon: string }[] = [
    { role: 'buyer', label: 'Registered Buyer', desc: 'Browse, save ads, chat with sellers, make offers', icon: '🛒' },
    { role: 'seller', label: 'Individual Seller', desc: 'Post ads, manage listings, chat, mark sold', icon: '👤' },
    { role: 'business', label: 'Business Merchant', desc: 'Verified store, manage catalog, promote listings', icon: '🏪' },
    { role: 'admin', label: 'System Admin', desc: 'Approve ads, moderate scam reports, edit pricing', icon: '🛡️' },
    { role: 'guest', label: 'Guest User', desc: 'Unauthenticated public visitor', icon: '👀' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#00A859] dark:bg-[#075e37] text-white border-b border-[#00924c] dark:border-[#05482b] shadow-sm">
      {/* =========================================================================
          MOBILE HEADER ROW (Active on mobile < 768px)
          - Top row of sticky header
          - Friendly solid brand color styling
          - Increased Logo font size, no site description
          - Right group: Post button -> Notification icon right of post button -> Three-dot menu
         ========================================================================= */}
      <div className="flex md:hidden items-center justify-between h-[42px] px-2 w-full max-w-full m-[1px]">
        {/* 1. Logo: Distinctive adBay brand typography with Kenyan market badge, enlarged font, no site description */}
        <button
          onClick={() => {
            setActiveView('home');
            setSearchQuery('');
            setSelectedCategory('all');
          }}
          className="flex items-center gap-1 text-left shrink-0 focus:outline-none h-[34px] px-1 rounded-[5px] active:opacity-80 transition group"
          aria-label="adBay Home - Buy and Sell Online"
        >
          <div className="flex items-center">
            <span className="font-black text-[20px] tracking-tight text-white leading-none adbay-mobile-logo drop-shadow-xs">
              ad<span className="text-[#FFD166]">Bay</span>
            </span>
            <span className="ml-1 text-[9px] px-1 py-0.2 bg-white/20 text-white rounded-[3px] font-bold border border-white/30 leading-tight">
              KE
            </span>
          </div>
        </button>

        {/* Right group with 5px gap: Post button -> Notification icon right of Post -> Three-dot menu */}
        <div className="flex items-center gap-[5px] shrink-0">
          {/* Post button (Reduced height: 28px, 13px bold text, 5px radius) */}
          <button
            onClick={handlePostAdClick}
            className="h-[28px] px-2.5 bg-[#F59E0B] hover:bg-[#d97706] active:scale-95 text-gray-950 font-bold rounded-[5px] text-[13px] flex items-center justify-center gap-1 shadow-xs transition"
            aria-label="Post an ad on adBay"
            title="Post an ad"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Post</span>
          </button>

          {/* Notification Icon directly to the right of Post button */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="w-[32px] h-[28px] flex items-center justify-center rounded-[5px] text-white hover:bg-white/20 transition active:scale-95 border border-white/30 relative"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-white" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white font-bold text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center ring-1 ring-[#00A859]">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div
                ref={notificationsRef}
                className="absolute right-0 top-full mt-1 w-72 bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl py-2 z-50 text-[12px]"
              >
                <div className="flex items-center justify-between px-3 pb-1.5 border-b border-gray-100 dark:border-gray-800">
                  <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-[#00A859]" /> New Notifications
                  </span>
                  {unreadNotifCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
                      className="text-[10px] text-[#00A859] hover:underline font-semibold"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-60 overflow-y-auto">
                  {notifications.filter((n) => !n.read).length === 0 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-[11px] space-y-1">
                      <CheckCircle className="w-5 h-5 mx-auto text-[#00A859]" />
                      <p className="font-semibold text-gray-800 dark:text-gray-200">No new notifications</p>
                      <p className="text-[10px] text-gray-400">You are completely up to date.</p>
                    </div>
                  ) : (
                    notifications
                      .filter((n) => !n.read)
                      .map((n) => (
                        <div
                          key={n.id}
                          onClick={() =>
                            setNotifications((prev) =>
                              prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
                            )
                          }
                          className="p-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition cursor-pointer bg-emerald-50/20 dark:bg-emerald-950/20"
                          title="Click to mark as read"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-800 dark:text-gray-200 text-[11px] flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#00A859]"></span>
                              {n.title}
                            </span>
                            <span className="text-[10px] text-gray-400">{n.time}</span>
                          </div>
                          <p className="text-gray-500 dark:text-gray-400 text-[11px] mt-0.5">{n.desc}</p>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Three-dot menu (At the far right: 28px height, 5px radius) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-[30px] h-[28px] flex items-center justify-center rounded-[5px] text-white hover:bg-white/20 transition active:scale-95 border border-white/30"
            aria-label="Open Navigation and Account Menu"
            title="Menu"
          >
            <MoreVertical className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          MOBILE SEARCHBAR AT THE BOTTOM OF HEADER AND STICKY
          - Positioned at the bottom of header row
          - Sticky together with the top header bar
          - Friendly solid brand color background
          - Category dropdown left of search bar
          - Search button removed; replaced with search icon inside search bar
         ========================================================================= */}
      <div className="md:hidden px-2 pt-1 pb-1.5 bg-[#00924c] dark:bg-[#064e3b] border-t border-white/15 m-[1px]">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-[5px]">
          {/* Dropdown Categories Left of Search Bar */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              if (activeView !== 'search' && e.target.value !== 'all') {
                setActiveView('search');
              }
            }}
            className="bg-white text-gray-800 text-[11px] font-semibold py-1 px-1.5 rounded-[5px] border-0 shadow-2xs focus:outline-none shrink-0 max-w-[105px] sm:max-w-[125px] truncate"
            aria-label="Filter category"
          >
            <option value="all">All Items</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Search Bar with search icon inside (No external search button) */}
          <div className="relative flex-1 flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, phones, cars, plots..."
              className="w-full bg-white text-gray-900 placeholder-gray-400 pl-2.5 pr-8 py-1 rounded-[5px] text-[11px] font-normal border-0 focus:outline-none shadow-2xs transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-7 text-gray-400 hover:text-gray-600 p-0.5"
                aria-label="Clear search query"
              >
                <X className="w-3 h-3" />
              </button>
            )}
            {/* Search Icon inside the search bar */}
            <button
              type="submit"
              className="absolute right-1 top-0 bottom-0 px-1.5 flex items-center justify-center text-gray-400 hover:text-[#00A859] transition"
              aria-label="Search"
              title="Search"
            >
              <Search className="w-3.5 h-3.5 text-[#00A859]" />
            </button>
          </div>
        </form>
      </div>

      {/* =========================================================================
          DESKTOP HEADER (Active on md screens >= 768px)
          - Fullwidth header
         ========================================================================= */}
      <div className="hidden md:block w-full px-3 sm:px-6 py-1.5">
        <div className="flex items-center justify-between gap-[5px]">
          {/* Logo & Slogan - pure typography with friendly white/yellow branding on solid green */}
          <button
            onClick={() => {
              setActiveView('home');
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="flex items-center text-left shrink-0 group focus:outline-none"
          >
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-[20px] tracking-tight text-white flex items-center drop-shadow-xs">
                ad<span className="text-[#FFD166]">Bay</span>
                <span className="ml-1 text-[9px] px-1 py-0.2 bg-white/20 text-white rounded font-bold border border-white/30">KE</span>
              </span>
              <span className="text-[10px] font-medium text-emerald-100">
                Buy and Sell Online
              </span>
            </div>
          </button>

          {/* Location Selector Button */}
          <button
            onClick={() => setIsLocationPickerOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white/15 hover:bg-white/25 border border-white/25 text-white rounded text-[12px] font-medium shrink-0 transition backdrop-blur-xs"
            title="Choose Kenya Location"
          >
            <MapPin className="w-3.5 h-3.5 text-[#FFD166]" />
            <span className="max-w-[110px] truncate">
              {selectedCounty === 'All Kenya' ? 'All Kenya' : `${selectedCounty}${selectedTown !== 'All Towns' ? `, ${selectedTown}` : ''}`}
            </span>
            <ChevronDown className="w-3 h-3 text-emerald-100" />
          </button>

          {/* Search Bar with Autocomplete & Recent Searches */}
          <div ref={searchContainerRef} className="flex-1 max-w-2xl relative mx-1">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center shadow-xs">
              <div className="relative flex-1 flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="I am looking for... (e.g. iPhone, Toyota, Sofa, Plot)"
                  className="w-full bg-white text-gray-900 placeholder-gray-400 pl-8 pr-16 py-1.5 rounded-l text-[13px] border-0 focus:outline-none transition"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 pointer-events-none" />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category Quick Select */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="hidden lg:block bg-gray-50 text-gray-800 text-[12px] py-1.5 px-2 border-l border-gray-200 focus:outline-none cursor-pointer max-w-[130px]"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="bg-[#F59E0B] hover:bg-[#d97706] text-gray-950 font-bold px-3 py-1.5 rounded-r text-[13px] transition flex items-center gap-1 shrink-0"
              >
                <Search className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Search</span>
              </button>
            </form>

            {/* Live Search Suggestions Dropdown */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded shadow-lg z-50 overflow-hidden text-[13px]">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="p-2 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between text-[11px] text-gray-400 font-semibold mb-1 uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <History className="w-3 h-3" /> Recent Searches
                      </span>
                      <button
                        type="button"
                        onClick={clearRecentSearches}
                        className="text-[#00A859] hover:underline cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {recentSearches.map((term, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSuggestionClick(term)}
                          className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-[#00A859]/10 hover:text-[#00A859] text-[12px] transition flex items-center gap-1"
                        >
                          <span>{term}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Keywords in Kenya */}
                <div className="p-2">
                  <div className="text-[11px] text-gray-400 font-semibold mb-1 uppercase tracking-wider flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-[#00A859]" /> Trending in Kenya
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[12px]">
                    {[
                      'iPhone 15 Pro Max',
                      'Toyota Land Cruiser Prado',
                      '2 Bedroom Apartment Nairobi',
                      'Samsung 55 inch TV',
                      'HP EliteBook Laptop',
                      'Friesian Dairy Cow',
                    ].map((trend, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSuggestionClick(trend)}
                        className="text-left px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 truncate"
                      >
                        {trend}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons & Buttons with 5px gap */}
          <div className="flex items-center gap-[5px] shrink-0">
            {/* PWA Install Button */}
            <div className="hidden lg:block">
              <PWAInstallButton compact />
            </div>

            {/* Dark / Light Mode Switch */}
            <button
              onClick={toggleTheme}
              className="p-1.5 text-white hover:bg-white/15 rounded transition"
              title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-white" />}
            </button>

            {/* Messages Icon */}
            <button
              onClick={() => setActiveView('messages')}
              className="relative p-1.5 text-white hover:bg-white/15 rounded transition"
              title="In-app Messages"
            >
              <MessageSquare className="w-4 h-4" />
              {unreadMessagesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FFD166] text-gray-950 font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            {/* User Profile / Account Menu */}
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/15 text-white text-[12px] font-medium transition border border-white/25"
              >
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-5 h-5 rounded-full object-cover border border-white/60"
                  />
                ) : (
                  <User className="w-4 h-4 text-emerald-100" />
                )}
                <span className="max-w-[80px] truncate text-white">{currentUser?.name.split(' ')[0] || 'Account'}</span>
                <ChevronDown className="w-3 h-3 text-emerald-100" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-1 w-56 bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded shadow-lg py-1 z-50 text-[13px]">
                  <div className="px-3 py-1.5 border-b border-gray-100 dark:border-gray-800">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">{currentUser?.name || 'Guest User'}</p>
                    <p className="text-[11px] text-gray-500 truncate">{currentUser?.email || 'Not logged in'}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] px-1.5 py-0.2 bg-[#00A859]/10 text-[#00A859] font-bold rounded">
                        Role: {currentRole.toUpperCase()}
                      </span>
                      {!currentUser && (
                        <button
                          onClick={() => {
                            setIsAuthModalOpen(true);
                            setIsUserMenuOpen(false);
                          }}
                          className="text-[10px] text-[#00A859] hover:underline font-bold"
                        >
                          Sign In / Register
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveView('dashboard');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 text-[#00A859] font-bold flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" /> My Dashboard
                  </button>

                  <button
                    onClick={() => {
                      setActiveView('dashboard');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> Saved Advertisements
                    </span>
                    <span className="text-[11px] font-bold text-gray-400">{favorites.length}</span>
                  </button>

                  {/* Only show My Listings for sellers, businesses, and admins */}
                  {(currentRole === 'seller' || currentRole === 'business' || currentRole === 'admin') && (
                    <button
                      onClick={() => {
                        setActiveView('my-ads');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center gap-2"
                    >
                      <Layers className="w-3.5 h-3.5 text-[#00A859]" /> My Listings & Inventory
                    </button>
                  )}

                  {/* Only show Store Profile for business accounts and admins */}
                  {(currentRole === 'business' || currentRole === 'admin') && (
                    <button
                      onClick={() => {
                        setActiveView('storefront');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center gap-2"
                    >
                      <Store className="w-3.5 h-3.5 text-amber-500" /> Store Profile
                    </button>
                  )}

                  {/* Only show Admin Dashboard for admins */}
                  {currentRole === 'admin' && (
                    <button
                      onClick={() => {
                        setActiveView('admin');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center gap-2 font-medium text-emerald-600 dark:text-emerald-400"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" /> Admin Dashboard
                    </button>
                  )}

                  <div className="border-t border-gray-100 dark:border-gray-800 my-1"></div>

                  <div className="px-3 py-1 text-[11px] text-gray-400 uppercase font-semibold">Switch Role Preview</div>
                  {rolesList.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => {
                        switchRole(r.role);
                        setIsUserMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1 text-[12px] flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 ${
                        currentRole === r.role ? 'font-bold text-[#00A859]' : 'text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      <span>
                        {r.icon} {r.label}
                      </span>
                      {currentRole === r.role && <span className="text-[10px]">✓</span>}
                    </button>
                  ))}

                  <div className="border-t border-gray-100 dark:border-gray-800 my-1"></div>

                  {currentUser ? (
                    <button
                      onClick={() => {
                        logoutUser();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-[12px] font-semibold flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-[#00A859] hover:bg-[#00A859]/10 text-[12px] font-bold flex items-center gap-2"
                    >
                      <LogIn className="w-3.5 h-3.5" /> Sign In / Create Account
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Desktop Orange "Post an Ad" Button */}
            <button
              onClick={handlePostAdClick}
              className="bg-[#F59E0B] hover:bg-[#d97706] text-gray-950 font-bold px-2.5 py-1.5 rounded text-[13px] shadow-xs flex items-center gap-1 transition shrink-0"
              title="Post an Advertisement on adBay"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post an Ad</span>
            </button>

            {/* Notification Icon directly right of Post button (Desktop) */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-1.5 rounded text-white hover:bg-white/15 transition relative border border-white/25"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-white" />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white font-bold text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center ring-1 ring-[#00A859]">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              {isNotificationsOpen && (
                <div
                  ref={notificationsRef}
                  className="absolute right-0 top-full mt-1.5 w-80 bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl py-2 z-50 text-[12px]"
                >
                  <div className="flex items-center justify-between px-3 pb-1.5 border-b border-gray-100 dark:border-gray-800">
                    <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-[#00A859]" /> New Notifications
                    </span>
                    {unreadNotifCount > 0 && (
                      <button
                        type="button"
                        onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
                        className="text-[10px] text-[#00A859] hover:underline font-semibold"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-64 overflow-y-auto">
                    {notifications.filter((n) => !n.read).length === 0 ? (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-[11px] space-y-1">
                        <CheckCircle className="w-5 h-5 mx-auto text-[#00A859]" />
                        <p className="font-semibold text-gray-800 dark:text-gray-200">No new notifications</p>
                        <p className="text-[10px] text-gray-400">You are completely up to date.</p>
                      </div>
                    ) : (
                      notifications
                        .filter((n) => !n.read)
                        .map((n) => (
                          <div
                            key={n.id}
                            onClick={() =>
                              setNotifications((prev) =>
                                prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
                              )
                            }
                            className="p-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition cursor-pointer bg-emerald-50/20 dark:bg-emerald-950/20"
                            title="Click to mark as read"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-gray-800 dark:text-gray-200 text-[11px] flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00A859]"></span>
                                {n.title}
                              </span>
                              <span className="text-[10px] text-gray-400">{n.time}</span>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-[11px] mt-0.5">{n.desc}</p>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Guest Authentication Prompt Modal */}
      {isGuestAuthPromptOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded-lg p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-[#F59E0B] text-gray-950 font-extrabold text-xs flex items-center justify-center">
                  +
                </div>
                <h3 className="font-bold text-[14px] text-gray-900 dark:text-white">
                  Sign In to Post an Ad
                </h3>
              </div>
              <button
                onClick={() => setIsGuestAuthPromptOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[13px] text-gray-600 dark:text-gray-300">
              To post advertisements and manage inquiries on adBay, please sign in or choose your seller profile below:
            </p>

            <div className="space-y-1.5">
              <button
                onClick={() => handleGuestLogin('seller')}
                className="w-full p-2 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-[#00A859] hover:bg-[#00A859]/5 text-left flex items-center justify-between transition text-[13px]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">👤</span>
                  <div>
                    <span className="font-bold text-gray-900 dark:text-white block">Sign in as Individual Seller</span>
                    <span className="text-[11px] text-gray-500">Faith Mwangi (Westlands, Nairobi)</span>
                  </div>
                </div>
                <span className="text-[#00A859] font-bold text-[12px]">Continue →</span>
              </button>

              <button
                onClick={() => handleGuestLogin('business')}
                className="w-full p-2 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-[#00A859] hover:bg-[#00A859]/5 text-left flex items-center justify-between transition text-[13px]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">🏪</span>
                  <div>
                    <span className="font-bold text-gray-900 dark:text-white block">Sign in as Business Merchant</span>
                    <span className="text-[11px] text-gray-500">Apex Mobiles & Tech Kenya Ltd</span>
                  </div>
                </div>
                <span className="text-[#00A859] font-bold text-[12px]">Continue →</span>
              </button>

              <button
                onClick={() => handleGuestLogin('buyer')}
                className="w-full p-2 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-[#00A859] hover:bg-[#00A859]/5 text-left flex items-center justify-between transition text-[13px]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">🛒</span>
                  <div>
                    <span className="font-bold text-gray-900 dark:text-white block">Sign in as Registered Buyer</span>
                    <span className="text-[11px] text-gray-500">Brian Otieno (Milimani, Kisumu)</span>
                  </div>
                </div>
                <span className="text-[#00A859] font-bold text-[12px]">Continue →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu (Three-dot menu) - Dashed border design */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex justify-end md:hidden">
          <div className="w-80 max-w-[85vw] bg-white dark:bg-[#131c31] h-full shadow-2xl p-3 flex flex-col justify-between overflow-y-auto border-l-2 border-dashed border-gray-400 dark:border-gray-600">
            <div>
              {/* Header without logo icon badge, dashed bottom border */}
              <div className="flex items-center justify-between pb-2.5 border-b border-dashed border-gray-300 dark:border-gray-700">
                <div>
                  <h3 className="font-extrabold text-gray-900 dark:text-white text-[14px] tracking-tight">
                    ad<span className="text-[#F59E0B]">Bay</span> Kenya
                  </h3>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-[5px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 border border-dashed border-gray-300 dark:border-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* User Identity & Auth Button with dashed border */}
              <div className="my-2 p-2 bg-gray-50 dark:bg-gray-800/60 rounded-[5px] border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-bold text-gray-900 dark:text-white">
                    {currentUser?.name || 'Guest Visitor'}
                  </p>
                  <p className="text-[13px] font-medium text-gray-500 uppercase">Role: {currentRole}</p>
                </div>

                <div className="flex items-center gap-[5px]">
                  <button
                    onClick={toggleTheme}
                    className="p-1.5 rounded-[5px] bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-[13px] border border-dashed border-gray-300 dark:border-gray-600"
                    title="Toggle Theme"
                  >
                    {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
                  </button>

                  {!currentUser ? (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsAuthModalOpen(true);
                      }}
                      className="px-2 py-0.5 rounded-[5px] bg-[#00A859] text-white text-[13px] font-bold border border-dashed border-[#00924c]"
                    >
                      Sign In
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        logoutUser();
                        setIsMobileMenuOpen(false);
                      }}
                      className="px-2 py-0.5 rounded-[5px] border border-dashed border-red-300 dark:border-red-900/60 text-red-600 dark:text-red-400 text-[13px] font-semibold"
                    >
                      Logout
                    </button>
                  )}
                </div>
              </div>

              {/* Main Account & Navigation Links with dashed borders */}
              <div className="space-y-[5px] text-[13px]">
                <button
                  onClick={() => {
                    setActiveView('dashboard');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-[5px] border border-dashed border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/20 hover:bg-gray-100 dark:hover:bg-gray-800 text-[#00A859] font-bold flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>User Dashboard</span>
                  </span>
                  <span className="text-[13px] font-semibold px-1 py-0.2 bg-[#00A859]/10 rounded-[5px]">Hub</span>
                </button>

                <button
                  onClick={() => {
                    setActiveView('dashboard');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-[5px] border border-dashed border-gray-200 dark:border-gray-700/80 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    <span className="font-medium">Saved Advertisements</span>
                  </span>
                  <span className="text-[13px] font-bold text-gray-500">{favorites.length}</span>
                </button>

                {/* Only show My Listings for sellers, businesses, and admins */}
                {(currentRole === 'seller' || currentRole === 'business' || currentRole === 'admin') && (
                  <button
                    onClick={() => {
                      setActiveView('my-ads');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-[5px] border border-dashed border-gray-200 dark:border-gray-700/80 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 flex items-center gap-2"
                  >
                    <Layers className="w-4 h-4 text-[#00A859]" />
                    <span className="font-medium">My Listings & Inventory</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setActiveView('messages');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-[5px] border border-dashed border-gray-200 dark:border-gray-700/80 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">Chats & Inquiries</span>
                  </span>
                  {unreadMessagesCount > 0 && (
                    <span className="text-[13px] bg-[#00A859] text-white px-1.5 py-0.2 rounded-[5px] font-bold">
                      {unreadMessagesCount}
                    </span>
                  )}
                </button>

                {/* Only show Store Profile for business and admin */}
                {(currentRole === 'business' || currentRole === 'admin') && (
                  <button
                    onClick={() => {
                      setActiveView('storefront');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-[5px] border border-dashed border-gray-200 dark:border-gray-700/80 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 flex items-center gap-2"
                  >
                    <Store className="w-4 h-4 text-amber-500" />
                    <span className="font-medium">Store Profile</span>
                  </button>
                )}

                {/* Only show Admin Moderation for admin */}
                {currentRole === 'admin' && (
                  <button
                    onClick={() => {
                      setActiveView('admin');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-[5px] border border-dashed border-purple-500/30 hover:bg-gray-100 dark:hover:bg-gray-800 text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Moderation</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsLocationPickerOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-[5px] border border-dashed border-gray-200 dark:border-gray-700/80 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-[#00A859]" />
                  <span className="truncate font-medium">Location: {selectedCounty}</span>
                </button>
              </div>

              {/* Important Footer Items with dashed dividers */}
              <div className="mt-3 pt-2.5 border-t border-dashed border-gray-300 dark:border-gray-700 space-y-[5px] text-[13px]">
                <p className="text-[13px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">
                  Safety, Legal & Support
                </p>

                <button
                  onClick={() => {
                    setActiveView('safety');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-2 py-1 rounded-[5px] border border-dashed border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center gap-2 text-[13px] font-normal"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Buyer Safety Guidelines</span>
                </button>

                <button
                  onClick={() => {
                    setActiveView('terms');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-2 py-1 rounded-[5px] border border-dashed border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center gap-2 text-[13px] font-normal"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-500" />
                  <span>Terms & User Agreement</span>
                </button>

                <button
                  onClick={() => {
                    setActiveView('privacy');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-2 py-1 rounded-[5px] border border-dashed border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center gap-2 text-[13px] font-normal"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Privacy Policy (Kenya Act 2019)</span>
                </button>

                <button
                  onClick={() => {
                    setActiveView('prohibited');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-2 py-1 rounded-[5px] border border-dashed border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center gap-2 text-[13px] font-normal"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                  <span>Prohibited & Restricted Items</span>
                </button>

                <button
                  onClick={() => {
                    setActiveView('android-guide');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-2 py-1 rounded-[5px] border border-dashed border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center gap-2 text-[13px] font-normal"
                >
                  <span className="text-[13px]">📱</span>
                  <span>Android App & TWA Guide</span>
                </button>

                {/* Support Contact Info for Mobile Users (Address removed) - Dashed box */}
                <div className="p-2 mt-1.5 rounded-[5px] bg-gray-50 dark:bg-gray-800/40 border border-dashed border-gray-300 dark:border-gray-700 text-[13px] text-gray-600 dark:text-gray-400 space-y-0.5">
                  <p className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1 text-[13px]">
                    <PhoneCall className="w-3.5 h-3.5 text-[#00A859]" /> adBay Kenya Support Hub
                  </p>
                  <p className="text-[13px] font-medium text-[#00A859]">Hotline: +254 (0) 700 000 000</p>
                  <p className="text-[13px] font-normal">Email: support@adbay.co.ke</p>
                </div>
              </div>

              {/* Role Switcher in Mobile Drawer with dashed border */}
              <div className="mt-2.5 pt-2 border-t border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-[13px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">
                  Preview as Role:
                </p>
                <div className="grid grid-cols-1 gap-[5px]">
                  {rolesList.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => {
                        switchRole(r.role);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`text-left px-2 py-1 rounded-[5px] text-[13px] flex items-center justify-between border border-dashed transition ${
                        currentRole === r.role
                          ? 'border-[#00A859] bg-[#00A859] text-white font-bold'
                          : 'border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium'
                      }`}
                    >
                      <span>
                        {r.icon} {r.label}
                      </span>
                      {currentRole === r.role && <span>✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions with dashed border */}
            <div className="pt-2 border-t border-dashed border-gray-300 dark:border-gray-700 space-y-[5px]">
              <PWAInstallButton />
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handlePostAdClick();
                }}
                className="w-full bg-[#F59E0B] text-gray-950 font-bold py-1.5 rounded-[5px] text-[13px] flex items-center justify-center gap-1 shadow-xs border border-dashed border-amber-600"
              >
                <PlusCircle className="w-4 h-4" /> Post an Ad
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
