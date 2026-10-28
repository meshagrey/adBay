import React, { useState } from 'react';
import {
  X,
  Store,
  CheckCircle,
  MapPin,
  Calendar,
  Clock,
  Star,
  MessageSquare,
  Phone,
  UserPlus,
  UserCheck,
  Share2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ListingCard } from '../listing/ListingCard';

export const SellerStorefrontModal: React.FC = () => {
  const {
    activeSellerId,
    setActiveSellerId,
    users,
    listings,
    reviews,
    addReview,
    currentUser,
    following,
    toggleFollow,
    isFollowing,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ads' | 'reviews'>('ads');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

  // Target seller (default to business seller if none clicked)
  const seller = users.find((u) => u.id === activeSellerId) || users.find((u) => u.role === 'business') || users[1];

  const sellerListings = listings.filter((l) => l.sellerId === seller.id && l.status === 'active');
  const sellerReviews = reviews.filter((r) => r.sellerId === seller.id);
  const isFollowed = isFollowing(seller.id);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast('Please sign in to write a review', 'error');
      return;
    }
    if (currentUser.id === seller.id) {
      showToast('You cannot review your own store!', 'error');
      return;
    }
    if (!newComment.trim()) {
      showToast('Please enter a review comment', 'error');
      return;
    }

    addReview(seller.id, newRating, newComment.trim());
    setNewComment('');
    setIsReviewFormOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-3 py-3 space-y-3">
      {/* Store Banner & Header Card */}
      <div className="border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-[#131c31] overflow-hidden shadow-xs">
        {/* Banner Image */}
        <div className="h-32 sm:h-44 w-full bg-gradient-to-r from-[#00A859] to-[#047857] relative overflow-hidden">
          {seller.businessProfile?.bannerImage && (
            <img
              src={seller.businessProfile.bannerImage}
              alt="Store Banner"
              className="w-full h-full object-cover opacity-80"
            />
          )}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Profile Info Row */}
        <div className="px-4 pb-4 pt-0 sm:pt-2 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 -mt-12 sm:-mt-14 mb-3">
            <div className="flex items-end gap-3">
              <img
                src={seller.avatar}
                alt={seller.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white dark:border-[#131c31] object-cover bg-white shadow-md"
              />

              <div className="mb-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h1 className="font-extrabold text-[18px] text-gray-900 dark:text-white leading-tight">
                    {seller.businessProfile?.storeName || seller.name}
                  </h1>
                  {seller.isVerifiedBusiness && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[10px] rounded">
                      <CheckCircle className="w-3 h-3" /> Verified Business
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-[12px] text-gray-500 mt-0.5">
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{seller.rating}</span>
                    <span className="text-gray-400 font-normal">({sellerReviews.length} reviews)</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#00A859]" /> {seller.county}, {seller.town}
                  </span>
                </div>
              </div>
            </div>

            {/* Follow & Action Buttons */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <button
                onClick={() => toggleFollow(seller.id)}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded text-[12px] font-bold flex items-center justify-center gap-1.5 transition ${
                  isFollowed
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700'
                    : 'bg-[#00A859] hover:bg-[#00924c] text-white shadow-xs'
                }`}
              >
                {isFollowed ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-[#00A859]" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Follow Store</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  showToast('Storefront link copied!', 'success');
                }}
                className="p-1.5 rounded border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100"
                title="Share Storefront"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Business Details & Description */}
          {seller.businessProfile && (
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 text-[12px] space-y-1 text-gray-600 dark:text-gray-300">
              <p>{seller.businessProfile.description}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-500 pt-1">
                <span>📍 {seller.businessProfile.address}</span>
                <span>⏰ {seller.businessProfile.openingHours}</span>
                <span>📋 Reg: {seller.businessProfile.registrationNumber}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Store Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 text-[13px] font-medium">
        <button
          onClick={() => setActiveTab('ads')}
          className={`pb-2 px-3 border-b-2 transition ${
            activeTab === 'ads'
              ? 'border-[#00A859] text-[#00A859] font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Active Listings ({sellerListings.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-2 px-3 border-b-2 transition ${
            activeTab === 'reviews'
              ? 'border-[#00A859] text-[#00A859] font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Ratings & Reviews ({sellerReviews.length})
        </button>
      </div>

      {/* Tab 1: Active Listings (Strict 5px grid) */}
      {activeTab === 'ads' && (
        <div>
          {sellerListings.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-[13px] border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-[#131c31]">
              This seller has no other active advertisements at this moment.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[5px]">
              {sellerListings.map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Reviews */}
      {activeTab === 'reviews' && (
        <div className="space-y-3">
          {/* Add Review Button & Modal */}
          <div className="flex justify-between items-center p-3 bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded">
            <div>
              <h3 className="font-bold text-[14px] text-gray-900 dark:text-white">Customer Feedback</h3>
              <p className="text-[12px] text-gray-500">
                Only verified buyers and contacted customers can submit reviews.
              </p>
            </div>
            <button
              onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
              className="px-3 py-1.5 rounded bg-[#00A859] hover:bg-[#00924c] text-white font-bold text-[12px]"
            >
              Write a Review
            </button>
          </div>

          {/* Review form */}
          {isReviewFormOpen && (
            <form
              onSubmit={handleReviewSubmit}
              className="p-3 bg-white dark:bg-[#131c31] border border-[#00A859] rounded space-y-2 text-[13px]"
            >
              <h4 className="font-bold text-gray-900 dark:text-white">Rate your experience with {seller.name}</h4>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1 text-amber-400"
                  >
                    <Star
                      className={`w-5 h-5 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                    />
                  </button>
                ))}
                <span className="text-[12px] text-gray-500 ml-2">{newRating} Stars</span>
              </div>

              <textarea
                rows={3}
                placeholder="Share your experience: Was the item as described? Was the meeting location safe and prompt?..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px]"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReviewFormOpen(false)}
                  className="px-3 py-1 rounded border border-gray-300 text-[12px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 rounded bg-[#00A859] text-white font-bold text-[12px]"
                >
                  Post Review
                </button>
              </div>
            </form>
          )}

          {/* Reviews list */}
          <div className="space-y-2">
            {sellerReviews.map((r) => (
              <div
                key={r.id}
                className="p-3 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#131c31] space-y-1.5 text-[13px]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={r.buyerAvatar}
                      alt={r.buyerName}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div>
                      <span className="font-semibold text-gray-900 dark:text-white">{r.buyerName}</span>
                      {r.verifiedPurchase && (
                        <span className="ml-2 text-[10px] text-emerald-600 bg-emerald-500/10 px-1 rounded font-medium">
                          Verified Contact
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center text-amber-400 text-[12px]">
                    {'★'.repeat(r.rating)}
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 text-[13px]">{r.comment}</p>
                <span className="text-[10px] text-gray-400 block">
                  {new Date(r.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
