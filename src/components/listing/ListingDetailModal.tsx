import React, { useState } from 'react';
import {
  X,
  Heart,
  Share2,
  Flag,
  MapPin,
  Clock,
  ShieldCheck,
  Phone,
  MessageSquare,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  DollarSign,
  AlertTriangle,
  Store,
  CheckCircle,
  Copy,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ListingCard } from './ListingCard';
import { Report } from '../../types';

export const ListingDetailModal: React.FC = () => {
  const {
    activeListingId,
    setActiveListingId,
    activeView,
    listings,
    categories,
    toggleFavorite,
    isFavorite,
    openChatForListing,
    setActiveSellerId,
    setActiveView,
    submitReport,
    showToast,
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isPhoneRevealed, setIsPhoneRevealed] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState<Report['reason']>('scam');
  const [reportDetails, setReportDetails] = useState('');
  const [isShareCopied, setIsShareCopied] = useState(false);

  const listing = listings.find((l) => l.id === activeListingId);

  const handleClose = React.useCallback(() => {
    setActiveListingId(null);
    if (activeView === 'listing-detail') {
      setActiveView('home');
    }
  }, [activeView, setActiveListingId, setActiveView]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  if (!listing) return null;

  const category = categories.find((c) => c.id === listing.categoryId);
  const subcategory = category?.subcategories.find((s) => s.id === listing.subcategoryId);
  const isFav = isFavorite(listing.id);

  // Other listings from this same seller
  const sellerOtherListings = listings
    .filter((l) => l.sellerId === listing.sellerId && l.id !== listing.id && l.status === 'active')
    .slice(0, 4);

  // Similar listings from the same category
  const similarListings = listings
    .filter((l) => l.categoryId === listing.categoryId && l.id !== listing.id && l.status === 'active')
    .slice(0, 4);

  const handleShare = async () => {
    const url = `${window.location.origin}/?listing=${listing.id}`;
    const shareData = {
      title: `${listing.title} | adBay Kenya`,
      text: `Check out this listing on adBay: ${listing.title} - KES ${listing.price.toLocaleString()}`,
      url: url,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        showToast('Shared successfully!', 'success');
        return;
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn('Native share error, falling back to clipboard copy:', err);
        } else {
          return; // User canceled the native share sheet
        }
      }
    }

    // Fallback: Clipboard copy
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        setIsShareCopied(true);
        showToast('Listing link copied to clipboard!', 'success');
        setTimeout(() => setIsShareCopied(false), 2500);
      } catch {
        showToast('Could not copy link', 'error');
      }
    } else {
      showToast('Sharing is not supported on this browser', 'error');
    }
  };

  const handleMakeOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(offerAmount.replace(/[^0-9]/g, ''));
    if (!num || num <= 0) {
      showToast('Please enter a valid offer amount in KES', 'error');
      return;
    }
    openChatForListing(listing, `I am interested in your listing "${listing.title}". Would you consider an offer of KES ${num.toLocaleString()}?`);
    setIsOfferModalOpen(false);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport('listing', listing.id, listing.title, reportReason, reportDetails);
    setIsReportModalOpen(false);
  };

  const handleWhatsAppClick = () => {
    const phoneClean = listing.sellerPhone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hello ${listing.sellerName}, I found your listing "${listing.title}" on adBay (KES ${listing.price.toLocaleString()}). Is it still available?`
    );
    window.open(`https://wa.me/${phoneClean}?text=${text}`, '_blank');
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-2 sm:p-4 backdrop-blur-xs animate-in fade-in duration-150 cursor-pointer"
      aria-modal="true"
      role="dialog"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded shadow-2xl overflow-hidden my-4 max-h-[95vh] flex flex-col cursor-default"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/40">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[12px] text-gray-500 dark:text-gray-400 truncate pr-2">
            <span className="text-[#00A859] font-medium">{category?.name || 'Category'}</span>
            <span>/</span>
            <span>{subcategory?.name || 'All'}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleShare}
              className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 rounded transition flex items-center gap-1 text-[12px]"
              title="Share Listing"
            >
              {isShareCopied ? <Check className="w-3.5 h-3.5 text-[#00A859]" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              onClick={() => toggleFavorite(listing.id)}
              className="p-1.5 text-gray-500 hover:text-red-500 rounded transition flex items-center gap-1 text-[12px]"
              title="Save to Favorites"
            >
              <Heart className={`w-3.5 h-3.5 ${isFav ? 'text-red-500 fill-red-500' : ''}`} />
              <span className="hidden sm:inline">Save</span>
            </button>

            <button
              onClick={() => setIsReportModalOpen(true)}
              className="p-1.5 text-gray-400 hover:text-amber-600 rounded transition"
              title="Report suspicious listing"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleClose}
              className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded hover:bg-gray-200/60 dark:hover:bg-gray-700/60 transition ml-1 flex items-center gap-1 text-[12px]"
              aria-label="Close or minimize ad"
              title="Close or minimize (Esc)"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Close</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Left 7 Columns: Image Gallery & Description */}
            <div className="md:col-span-7 space-y-3">
              {/* Main Photo Viewer */}
              <div className="relative aspect-4/3 w-full bg-black rounded overflow-hidden flex items-center justify-center">
                <img
                  src={listing.images[activeImageIndex] || listing.images[0]}
                  alt={listing.title}
                  className="max-h-full max-w-full object-contain"
                />

                {listing.images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActiveImageIndex((prev) => (prev === 0 ? listing.images.length - 1 : prev - 1))
                      }
                      className="absolute left-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition"
                      aria-label="Previous Photo"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setActiveImageIndex((prev) => (prev === listing.images.length - 1 ? 0 : prev + 1))
                      }
                      className="absolute right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition"
                      aria-label="Next Photo"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Photo Counter */}
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[11px] px-2 py-0.5 rounded">
                  {activeImageIndex + 1} / {listing.images.length}
                </div>

                {listing.promotionTier === 'featured' && (
                  <div className="absolute top-2 left-2 bg-amber-500 text-gray-950 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Featured Listing
                  </div>
                )}
              </div>

              {/* Thumbnails list */}
              {listing.images.length > 1 && (
                <div className="flex gap-1.5 overflow-x-auto py-1">
                  {listing.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-12 rounded overflow-hidden shrink-0 border-2 transition ${
                        activeImageIndex === idx ? 'border-[#00A859]' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Product Description */}
              <div className="border border-gray-200 dark:border-gray-800 rounded p-3 bg-white dark:bg-[#131c31]">
                <h3 className="font-bold text-[14px] text-gray-900 dark:text-white mb-1.5 pb-1 border-b border-gray-100 dark:border-gray-800">
                  Description
                </h3>
                <p className="text-[13px] text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                  {listing.description}
                </p>

                {/* Delivery & Pickup Info */}
                {listing.deliveryOption && (
                  <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-100 dark:border-gray-800 text-[12px]">
                    <span className="font-semibold text-gray-800 dark:text-gray-200 block mb-0.5">
                      🚚 Delivery & Collection Terms:
                    </span>
                    <span className="text-gray-600 dark:text-gray-300">{listing.deliveryOption}</span>
                  </div>
                )}
              </div>

              {/* Category Attributes Table */}
              {listing.attributes && Object.keys(listing.attributes).length > 0 && (
                <div className="border border-gray-200 dark:border-gray-800 rounded p-3 bg-white dark:bg-[#131c31]">
                  <h3 className="font-bold text-[14px] text-gray-900 dark:text-white mb-2 pb-1 border-b border-gray-100 dark:border-gray-800">
                    Specifications & Details
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-[13px]">
                    {Object.entries(listing.attributes).map(([key, value]) => (
                      <div key={key} className="p-1.5 rounded bg-gray-50 dark:bg-gray-800/40">
                        <span className="text-[11px] text-gray-500 dark:text-gray-400 block">{key}</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right 5 Columns: Price, Title, Seller Box, Safety Alerts & Actions */}
            <div className="md:col-span-5 space-y-3">
              {/* Header Details Card */}
              <div className="border border-gray-200 dark:border-gray-800 rounded p-3 bg-white dark:bg-[#131c31]">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-extrabold text-[22px] text-[#00A859] tracking-tight">
                    KES {listing.price.toLocaleString()}
                  </span>
                  {listing.isNegotiable ? (
                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold text-[11px] rounded">
                      Negotiable
                    </span>
                  ) : (
                    <span className="text-[11px] text-gray-400">Fixed price</span>
                  )}
                </div>

                <h2 className="font-bold text-[15px] text-gray-900 dark:text-white mt-1 leading-snug">
                  {listing.title}
                </h2>

                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800 space-y-1 text-[12px] text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#00A859]" />
                    <span>
                      {listing.county}, {listing.town} {listing.approximateArea ? `(${listing.approximateArea})` : ''}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>Posted {new Date(listing.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="font-medium">Condition:</span>
                    <span className="capitalize font-semibold text-gray-800 dark:text-gray-200">{listing.condition}</span>
                  </div>
                </div>
              </div>

              {/* Verified Seller Box */}
              <div className="border border-gray-200 dark:border-gray-800 rounded p-3 bg-white dark:bg-[#131c31]">
                <div className="flex items-start gap-2.5">
                  <img
                    src={listing.sellerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={listing.sellerName}
                    className="w-11 h-11 rounded-full object-cover border border-[#00A859]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <h4 className="font-bold text-[13px] text-gray-900 dark:text-white truncate">
                        {listing.sellerName}
                      </h4>
                      {listing.isVerifiedSeller && (
                        <span title="Verified Business Store" className="text-blue-500 shrink-0 inline-flex">
                          <CheckCircle className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                      <span className="text-amber-500 font-bold">★ {listing.sellerRating}</span>
                      <span>•</span>
                      <span>Verified Seller</span>
                    </div>
                    <p className="text-[11px] text-gray-500">Fast response rate: 98%</p>
                  </div>
                </div>

                {/* Seller Actions */}
                <div className="mt-3 space-y-1.5">
                  {/* Chat on adBay */}
                  {listing.contactPreferences.inAppChat && (
                    <button
                      onClick={() => openChatForListing(listing)}
                      className="w-full bg-[#00A859] hover:bg-[#00924c] text-white font-bold py-2 px-3 rounded text-[13px] flex items-center justify-center gap-2 transition shadow-xs"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat with Seller</span>
                    </button>
                  )}

                  {/* Make an Offer Button */}
                  <button
                    onClick={() => setIsOfferModalOpen(true)}
                    className="w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-1.5 px-3 rounded text-[13px] flex items-center justify-center gap-2 transition"
                  >
                    <DollarSign className="w-4 h-4 text-[#00A859]" />
                    <span>Make an Offer</span>
                  </button>

                  <div className="grid grid-cols-2 gap-1.5">
                    {/* Call Seller (Click to reveal) */}
                    <button
                      onClick={() => setIsPhoneRevealed(true)}
                      className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium py-1.5 px-2 rounded text-[12px] flex items-center justify-center gap-1 truncate"
                    >
                      <Phone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="truncate">
                        {isPhoneRevealed ? listing.sellerPhone : 'Show Phone'}
                      </span>
                    </button>

                    {/* WhatsApp Seller */}
                    <button
                      onClick={handleWhatsAppClick}
                      className="bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] font-semibold py-1.5 px-2 rounded text-[12px] flex items-center justify-center gap-1 truncate"
                    >
                      <span>💬 WhatsApp</span>
                    </button>
                  </div>

                  {/* View Storefront */}
                  <button
                    onClick={() => {
                      setActiveSellerId(listing.sellerId);
                      setActiveView('storefront');
                      setActiveListingId(null);
                    }}
                    className="w-full text-center text-[12px] text-[#00A859] hover:underline pt-1 flex items-center justify-center gap-1"
                  >
                    <Store className="w-3 h-3" />
                    <span>View seller storefront & other ads</span>
                  </button>
                </div>
              </div>

              {/* Safety Warning Card (Buyer Safety requirement from brief) */}
              <div className="border border-amber-300 dark:border-amber-800/80 bg-amber-500/5 rounded p-3 text-[12px] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-400 text-[13px]">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>adBay Buyer Safety Tips</span>
                </div>
                <ul className="space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside">
                  <li><strong>Never pay in advance</strong>, including delivery fees.</li>
                  <li>Meet the seller in a secure, daylight public location (e.g. mall, police post, bank).</li>
                  <li>Inspect and verify the item thoroughly before concluding payment.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Seller's other items */}
          {sellerOtherListings.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-[14px] text-gray-900 dark:text-white mb-2">
                More from {listing.sellerName}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {sellerOtherListings.map((item) => (
                  <ListingCard key={item.id} listing={item} />
                ))}
              </div>
            </div>
          )}

          {/* Similar recommended listings */}
          {similarListings.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-[14px] text-gray-900 dark:text-white mb-2">
                Similar Ads in Kenya
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {similarListings.map((item) => (
                  <ListingCard key={item.id} listing={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Make Offer Sub-Modal */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-3">
          <div className="w-full max-w-sm bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded p-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
              <h4 className="font-bold text-[14px] text-gray-900 dark:text-white">Make an Offer</h4>
              <button onClick={() => setIsOfferModalOpen(false)}>
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <p className="text-[12px] text-gray-600 dark:text-gray-400 mt-2">
              Listing Price: <strong className="text-[#00A859]">KES {listing.price.toLocaleString()}</strong>
            </p>

            <form onSubmit={handleMakeOfferSubmit} className="mt-3 space-y-3">
              <div>
                <label className="text-[12px] font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  Your Offer in KES:
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 140000"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px] text-gray-900 dark:text-white focus:outline-none focus:border-[#00A859]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOfferModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-gray-300 text-[12px] text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#00A859] text-white font-bold text-[12px] hover:bg-[#00924c]"
                >
                  Send Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Listing Sub-Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-3">
          <div className="w-full max-w-sm bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded p-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
              <h4 className="font-bold text-[14px] text-gray-900 dark:text-white flex items-center gap-1.5 text-amber-600">
                <Flag className="w-4 h-4" /> Report This Listing
              </h4>
              <button onClick={() => setIsReportModalOpen(false)}>
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="mt-3 space-y-3">
              <div>
                <label className="text-[12px] font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  Reason for Report:
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value as Report['reason'])}
                  className="w-full px-2 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px] text-gray-900 dark:text-white"
                >
                  <option value="scam">Suspected scam or advance fee demand</option>
                  <option value="counterfeit">Fake or counterfeit product</option>
                  <option value="prohibited">Prohibited item under Kenya laws</option>
                  <option value="spam">Spam or duplicate advertisement</option>
                  <option value="inappropriate">Inappropriate or offensive content</option>
                  <option value="other">Other reason</option>
                </select>
              </div>

              <div>
                <label className="text-[12px] font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  Details / Explanation:
                </label>
                <textarea
                  rows={3}
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Explain what seems suspicious or violation..."
                  className="w-full px-2.5 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px] text-gray-900 dark:text-white focus:outline-none focus:border-[#00A859]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-gray-300 text-[12px] text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-red-600 text-white font-bold text-[12px] hover:bg-red-700"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
