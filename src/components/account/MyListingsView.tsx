import React, { useState } from 'react';
import {
  Layers,
  PlusCircle,
  Eye,
  Heart,
  Edit,
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  Trash2,
  Sparkles,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ListingStatus } from '../../types';

export const MyListingsView: React.FC = () => {
  const {
    listings,
    currentUser,
    setIsPostAdOpen,
    markAsSold,
    togglePauseListing,
    deleteListing,
    setActiveListingId,
    setActiveView,
    setIsPromoteModalOpen,
    setListingToPromote,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | ListingStatus>('all');

  // Filter listings belonging to the current user (or all if demoing as admin/seller)
  const myListings = listings.filter((l) => {
    if (currentUser?.role === 'admin') return true; // Admin can see all listings in inventory
    return l.sellerId === currentUser?.id || l.sellerName === currentUser?.name;
  });

  const tabFiltered = myListings.filter((l) => {
    if (activeTab === 'all') return true;
    return l.status === activeTab;
  });

  const handlePromoteClick = (listing: any) => {
    setListingToPromote(listing);
    setIsPromoteModalOpen(true);
  };

  return (
    <div className="max-w-[1250px] mx-auto px-2 sm:px-3 py-3 space-y-3">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#00A859] text-white flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-[16px] text-gray-900 dark:text-white">
              My Listings & Inventory
            </h2>
            <p className="text-[12px] text-gray-500">
              Manage your active advertisements, view performance, and boost visibility.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsPostAdOpen(true)}
          className="bg-[#F59E0B] hover:bg-[#d97706] text-gray-950 font-bold px-3 py-1.5 rounded text-[13px] flex items-center gap-1 shadow-xs transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Ad</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[12px] font-medium border-b border-gray-200 dark:border-gray-800">
        {[
          { key: 'all', label: `All Ads (${myListings.length})` },
          { key: 'active', label: `Active (${myListings.filter((l) => l.status === 'active').length})` },
          { key: 'pending', label: `Pending Review (${myListings.filter((l) => l.status === 'pending').length})` },
          { key: 'paused', label: `Paused (${myListings.filter((l) => l.status === 'paused').length})` },
          { key: 'sold', label: `Sold (${myListings.filter((l) => l.status === 'sold').length})` },
          { key: 'rejected', label: `Rejected (${myListings.filter((l) => l.status === 'rejected').length})` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`px-3 py-1.5 rounded-t transition whitespace-nowrap ${
              activeTab === t.key
                ? 'bg-white dark:bg-[#131c31] border-t-2 border-t-[#00A859] font-bold text-[#00A859]'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Listings List */}
      <div className="space-y-[5px]">
        {tabFiltered.length === 0 ? (
          <div className="border border-gray-200 dark:border-gray-800 rounded p-8 text-center bg-white dark:bg-[#131c31]">
            <p className="text-gray-500 text-[13px]">No advertisements found in this tab.</p>
            <button
              onClick={() => setIsPostAdOpen(true)}
              className="mt-2 text-[#00A859] font-semibold text-[13px] hover:underline"
            >
              Post an Advertisement now
            </button>
          </div>
        ) : (
          tabFiltered.map((l) => (
            <div
              key={l.id}
              className="border border-gray-200 dark:border-gray-800 rounded p-2.5 bg-white dark:bg-[#131c31] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[13px]"
            >
              <div className="flex items-start gap-2.5 min-w-0 flex-1">
                <img
                  src={l.images[0]}
                  alt={l.title}
                  className="w-16 h-14 rounded object-cover bg-gray-100 shrink-0"
                />

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        l.status === 'active'
                          ? 'bg-[#00A859]/10 text-[#00A859]'
                          : l.status === 'pending'
                          ? 'bg-blue-500/10 text-blue-500'
                          : l.status === 'sold'
                          ? 'bg-gray-200 text-gray-700'
                          : l.status === 'paused'
                          ? 'bg-amber-500/10 text-amber-600'
                          : 'bg-red-500/10 text-red-500'
                      }`}
                    >
                      {l.status}
                    </span>

                    {l.promotionTier === 'featured' && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500 text-gray-950 flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" /> Featured
                      </span>
                    )}

                    {l.promotionTier === 'boosted' && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-600 text-white">
                        Boosted
                      </span>
                    )}
                  </div>

                  <h3
                    onClick={() => {
                      setActiveListingId(l.id);
                    }}
                    className="font-bold text-[13px] text-gray-900 dark:text-white truncate cursor-pointer hover:text-[#00A859] mt-0.5"
                  >
                    {l.title}
                  </h3>

                  <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                    <span className="text-[#00A859] font-bold">
                      KES {l.price.toLocaleString()}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <Eye className="w-3 h-3" /> {l.viewsCount} views
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <Heart className="w-3 h-3 text-red-400" /> {l.favoritesCount} saves
                    </span>
                  </div>

                  {l.rejectionReason && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Reason: {l.rejectionReason}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                {/* Promote / Boost Button */}
                {l.status === 'active' && (
                  <button
                    onClick={() => handlePromoteClick(l)}
                    className="px-2.5 py-1 rounded bg-[#00A859] hover:bg-[#00924c] text-white font-bold text-[11px] flex items-center gap-1 shadow-xs transition"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Promote Ad</span>
                  </button>
                )}

                {/* Mark As Sold */}
                {l.status === 'active' && (
                  <button
                    onClick={() => markAsSold(l.id)}
                    className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[11px] font-medium hover:bg-gray-100"
                    title="Mark as Sold"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 inline mr-1 text-emerald-500" />
                    Sold
                  </button>
                )}

                {/* Pause / Resume */}
                {l.status !== 'sold' && (
                  <button
                    onClick={() => togglePauseListing(l.id)}
                    className="p-1.5 rounded border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100"
                    title={l.status === 'paused' ? 'Resume listing' : 'Pause listing'}
                  >
                    {l.status === 'paused' ? (
                      <PlayCircle className="w-4 h-4 text-[#00A859]" />
                    ) : (
                      <PauseCircle className="w-4 h-4 text-amber-500" />
                    )}
                  </button>
                )}

                {/* Delete */}
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this advertisement?')) {
                      deleteListing(l.id);
                    }
                  }}
                  className="p-1.5 rounded border border-gray-300 dark:border-gray-700 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                  title="Delete listing"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
