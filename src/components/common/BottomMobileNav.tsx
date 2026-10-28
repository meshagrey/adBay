import React, { useState } from 'react';
import {
  Home,
  Search,
  PlusCircle,
  MessageSquare,
  Heart,
  User,
  ShieldCheck,
  Store,
  Layers,
  X,
  Smartphone,
  LayoutDashboard,
  LogIn,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BottomMobileNav: React.FC = () => {
  const {
    activeView,
    setActiveView,
    favorites,
    conversations,
    setIsPostAdOpen,
    setIsAuthModalOpen,
    currentUser,
    currentRole,
    switchRole,
  } = useApp();

  const [isAccountSheetOpen, setIsAccountSheetOpen] = useState(false);

  const unreadMessagesCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  return (
    <>
      {/* Fixed Bottom Mobile Menu Bar (99.5% width on mobile) */}
      <nav
        aria-label="Mobile Navigation Bar"
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden w-[99.5%] mx-auto bg-white/95 dark:bg-[#131c31]/95 backdrop-blur-md border-t border-gray-200/80 dark:border-gray-800/80 shadow-[0_-2px_12px_rgba(0,0,0,0.08)] px-1 py-1"
      >
        <div className="flex items-center justify-around">
          {/* Tab 1: Home */}
          <button
            onClick={() => setActiveView('home')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded transition flex-1 ${
              activeView === 'home'
                ? 'text-[#00A859] font-bold'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <Home className="w-6 h-6 mb-0.5 stroke-[2.2]" />
            <span className="text-[10px] leading-tight font-medium">Home</span>
          </button>

          {/* Tab 2: Search */}
          <button
            onClick={() => setActiveView('search')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded transition flex-1 ${
              activeView === 'search'
                ? 'text-[#00A859] font-bold'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <Search className="w-6 h-6 mb-0.5 stroke-[2.2]" />
            <span className="text-[10px] leading-tight font-medium">Search</span>
          </button>

          {/* Tab 3: Center Elevated "Sell" Button */}
          <div className="flex-1 flex justify-center">
            <button
              onClick={() => setIsPostAdOpen(true)}
              className="bg-gradient-to-tr from-[#00A859] to-[#10b981] hover:from-[#00924c] hover:to-[#059669] text-white rounded-full w-12 h-12 flex flex-col items-center justify-center -mt-4 shadow-md border-2 border-white dark:border-[#131c31] active:scale-95 transition"
              title="Post an Advertisement"
            >
              <PlusCircle className="w-6 h-6 stroke-[2.2]" />
              <span className="text-[9px] font-extrabold tracking-tight">Sell</span>
            </button>
          </div>

          {/* Tab 4: Messages */}
          <button
            onClick={() => setActiveView('messages')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded transition flex-1 relative ${
              activeView === 'messages'
                ? 'text-[#00A859] font-bold'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <div className="relative">
              <MessageSquare className="w-6 h-6 mb-0.5 stroke-[2.2]" />
              {unreadMessagesCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#00A859] text-white font-bold text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center ring-1 ring-white dark:ring-[#131c31]">
                  {unreadMessagesCount}
                </span>
              )}
            </div>
            <span className="text-[10px] leading-tight font-medium">Chats</span>
          </button>

          {/* Tab 5: Saved & Account */}
          <button
            onClick={() => setIsAccountSheetOpen(true)}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded transition flex-1 relative ${
              activeView === 'favorites' || activeView === 'my-ads' || activeView === 'admin'
                ? 'text-[#00A859] font-bold'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <div className="relative">
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt=""
                  className="w-6 h-6 rounded-full object-cover border border-[#00A859] mb-0.5"
                />
              ) : (
                <User className="w-6 h-6 mb-0.5 stroke-[2.2]" />
              )}
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white font-bold text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center ring-1 ring-white dark:ring-[#131c31]">
                  {favorites.length}
                </span>
              )}
            </div>
            <span className="text-[10px] leading-tight font-medium">Account</span>
          </button>
        </div>
      </nav>

      {/* Quick Mobile Account Bottom Action Sheet */}
      {isAccountSheetOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex flex-col justify-end md:hidden"
          onClick={() => setIsAccountSheetOpen(false)}
        >
          <div
            className="w-[99.5%] mx-auto bg-white dark:bg-[#131c31] rounded-t-[7px] p-3 shadow-2xl border-t border-gray-200 dark:border-gray-800 max-h-[80vh] overflow-y-auto m-[1px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-[#00A859]" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <h3 className="font-extrabold text-[13px] text-gray-900 dark:text-white">
                    {currentUser?.name || 'Guest Visitor'}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] text-[#00A859] font-bold uppercase">
                      Role: {currentRole}
                    </span>
                    {!currentUser && (
                      <button
                        onClick={() => {
                          setIsAccountSheetOpen(false);
                          setIsAuthModalOpen(true);
                        }}
                        className="text-[13px] text-[#00A859] hover:underline font-bold"
                      >
                        • Sign In / Register
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsAccountSheetOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-[5px]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-2.5 space-y-[5px] text-[13px]">
              <button
                onClick={() => {
                  setActiveView('dashboard');
                  setIsAccountSheetOpen(false);
                }}
                className="w-full text-left p-2 rounded-[5px] hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between text-[#00A859] font-bold border border-emerald-500/30"
              >
                <span className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" /> My Dashboard
                </span>
                <span className="text-[13px] px-1.5 py-0.2 bg-[#00A859]/10 rounded-[5px] font-semibold">Role Hub</span>
              </button>

              <button
                onClick={() => {
                  setActiveView('dashboard');
                  setIsAccountSheetOpen(false);
                }}
                className="w-full text-left p-2 rounded-[5px] hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between text-gray-800 dark:text-gray-200"
              >
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500 fill-red-500" /> Saved Advertisements
                </span>
                <span className="text-[13px] font-bold text-gray-500">{favorites.length}</span>
              </button>

              {/* Only show Inventory for sellers, businesses, and admins */}
              {(currentRole === 'seller' || currentRole === 'business' || currentRole === 'admin') && (
                <button
                  onClick={() => {
                    setActiveView('my-ads');
                    setIsAccountSheetOpen(false);
                  }}
                  className="w-full text-left p-2 rounded-[5px] hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 text-gray-800 dark:text-gray-200"
                >
                  <Layers className="w-4 h-4 text-[#00A859]" /> My Inventory & Ads
                </button>
              )}

              {/* Only show Store Profile for business and admin */}
              {(currentRole === 'business' || currentRole === 'admin') && (
                <button
                  onClick={() => {
                    setActiveView('storefront');
                    setIsAccountSheetOpen(false);
                  }}
                  className="w-full text-left p-2 rounded-[5px] hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 text-gray-800 dark:text-gray-200"
                >
                  <Store className="w-4 h-4 text-amber-500" /> Store Profile & Reviews
                </button>
              )}

              {/* Only show Admin Panel for admin */}
              {currentRole === 'admin' && (
                <button
                  onClick={() => {
                    setActiveView('admin');
                    setIsAccountSheetOpen(false);
                  }}
                  className="w-full text-left p-2 rounded-[5px] hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold"
                >
                  <ShieldCheck className="w-4 h-4" /> Admin & Moderation Panel
                </button>
              )}

              <button
                onClick={() => {
                  setActiveView('android-guide');
                  setIsAccountSheetOpen(false);
                }}
                className="w-full text-left p-2 rounded-[5px] hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 text-gray-800 dark:text-gray-200"
              >
                <Smartphone className="w-4 h-4 text-blue-500" /> Android App & TWA Guide
              </button>
            </div>

            {/* Quick role switcher within mobile action sheet */}
            <div className="mt-2.5 pt-2 border-t border-gray-100 dark:border-gray-800">
              <span className="text-[13px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Preview as Role:
              </span>
              <div className="grid grid-cols-2 gap-[5px] text-[13px]">
                {[
                  { r: 'buyer', label: '🛒 Standard User' },
                  { r: 'seller', label: '👤 Individual Seller' },
                  { r: 'business', label: '🏪 Business Seller' },
                  { r: 'admin', label: '🛡️ Administrator' },
                  { r: 'guest', label: '👀 Guest Visitor' },
                ].map((item) => (
                  <button
                    key={item.r}
                    onClick={() => {
                      switchRole(item.r as any);
                      setIsAccountSheetOpen(false);
                    }}
                    className={`py-1 px-2 rounded-[5px] text-left transition text-[13px] ${
                      currentRole === item.r
                        ? 'bg-[#00A859] text-white font-bold'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


export default BottomMobileNav;

