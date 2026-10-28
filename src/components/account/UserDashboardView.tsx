import React, { useState, useEffect } from 'react';
import {
  User,
  Heart,
  Layers,
  MessageSquare,
  ShieldCheck,
  Store,
  Settings,
  PlusCircle,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  LogOut,
  Edit3,
  Phone,
  Mail,
  Trash2,
  PauseCircle,
  PlayCircle,
  ExternalLink,
  ShieldAlert,
  Save,
  Users,
  Sliders,
  FileText,
  DollarSign,
  Activity,
  Star,
  Camera,
  Upload,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KENYA_COUNTIES } from '../../data/kenyaLocations';
import { ListingCard } from '../listing/ListingCard';
import { UserRole } from '../../types';
import { optimizeImage } from '../../utils/imageOptimizer';

export const UserDashboardView: React.FC = () => {
  const {
    currentUser,
    currentRole,
    switchRole,
    users,
    updateUserRole,
    toggleUserStatus,
    verifyBusinessAccount,
    updateUserProfile,
    listings,
    categories,
    favorites,
    conversations,
    setActiveListingId,
    setIsPostAdOpen,
    setIsAuthModalOpen,
    setIsPromoteModalOpen,
    setListingToPromote,
    markAsSold,
    togglePauseListing,
    deleteListing,
    approveListing,
    rejectListing,
    reports,
    resolveReport,
    setActiveView,
    logoutUser,
    showToast,
    platformSettings,
    updatePlatformSettings,
    auditLogs,
  } = useApp();

  // Role categorization logic as requested
  const isBusiness = currentRole === 'business' || currentUser?.isVerifiedBusiness;
  const isAdmin = currentRole === 'admin';
  const isStandard = !isBusiness && !isAdmin && currentRole !== 'guest';
  const isGuest = currentRole === 'guest' || !currentUser;

  // Active tab state
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Automatically reset tab when role switches if the previous tab doesn't belong to the new role
  useEffect(() => {
    setActiveTab('overview');
  }, [currentRole]);

  // Profile Settings Form State
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editEmail, setEditEmail] = useState(currentUser?.email || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [editCounty, setEditCounty] = useState(currentUser?.county || 'Nairobi');
  const [editTown, setEditTown] = useState(currentUser?.town || 'Westlands');
  const [editAvatar, setEditAvatar] = useState(currentUser?.avatar || '');

  // Business profile state
  const [editStoreName, setEditStoreName] = useState(currentUser?.businessProfile?.storeName || '');
  const [editStoreAddress, setEditStoreAddress] = useState(currentUser?.businessProfile?.address || '');
  const [editOpeningHours, setEditOpeningHours] = useState(currentUser?.businessProfile?.openingHours || 'Mon - Sat: 8:30 AM - 6:30 PM');
  const [editWhatsapp, setEditWhatsapp] = useState(currentUser?.businessProfile?.whatsapp || currentUser?.phone || '');
  const [editDescription, setEditDescription] = useState(currentUser?.businessProfile?.description || '');

  // Platform settings state (Admin)
  const [bannerText, setBannerText] = useState(platformSettings.emergencyBannerText);
  const [showBanner, setShowBanner] = useState(platformSettings.showEmergencyBanner);

  // Sync state when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name);
      setEditEmail(currentUser.email);
      setEditPhone(currentUser.phone);
      setEditCounty(currentUser.county);
      setEditTown(currentUser.town);
      setEditAvatar(currentUser.avatar);
      setEditStoreName(currentUser.businessProfile?.storeName || `${currentUser.name}'s Official Store`);
      setEditStoreAddress(currentUser.businessProfile?.address || `${currentUser.town}, ${currentUser.county}`);
      setEditOpeningHours(currentUser.businessProfile?.openingHours || 'Mon - Sat: 8:30 AM - 6:30 PM');
      setEditWhatsapp(currentUser.businessProfile?.whatsapp || currentUser.phone);
      setEditDescription(currentUser.businessProfile?.description || 'Authentic goods and fast delivery across Kenya.');
    }
  }, [currentUser]);

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Profile picture upload with client-side canvas optimization
  const handleAvatarFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPEG, PNG, WebP)', 'error');
      return;
    }

    setIsUploadingAvatar(true);
    showToast('Optimizing and updating profile photo...', 'info');

    try {
      const optimized = await optimizeImage(file, {
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.85,
        mimeType: 'image/jpeg',
      });
      setEditAvatar(optimized.dataUrl);
      if (currentUser) {
        updateUserProfile(currentUser.id, { avatar: optimized.dataUrl });
      }
      showToast('Profile photo updated successfully!', 'success');
    } catch (err) {
      console.error('Failed to update avatar:', err);
      showToast('Error uploading profile photo', 'error');
    } finally {
      setIsUploadingAvatar(false);
      e.target.value = '';
    }
  };

  const selectedCountyData = KENYA_COUNTIES.find((c) => c.name === editCounty) || KENYA_COUNTIES[0];

  // Save profile settings handler
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!editName.trim() || !editPhone.trim()) {
      showToast('Name and phone number are required', 'error');
      return;
    }

    updateUserProfile(currentUser.id, {
      name: editName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
      county: editCounty,
      town: editTown,
      avatar: editAvatar.trim() || currentUser.avatar,
      businessProfile: isBusiness ? {
        storeName: editStoreName.trim() || `${editName.trim()}'s Store`,
        address: editStoreAddress.trim() || `${editTown}, ${editCounty}`,
        openingHours: editOpeningHours.trim(),
        whatsapp: editWhatsapp.trim(),
        description: editDescription.trim(),
        registrationNumber: currentUser.businessProfile?.registrationNumber || `BN-KE-${Math.floor(100000 + Math.random() * 900000)}`,
        verifiedAt: currentUser.businessProfile?.verifiedAt || new Date().toISOString().split('T')[0],
      } : undefined,
    });

    showToast('Profile settings saved successfully!', 'success');
  };

  // Data aggregations
  const myListings = currentUser ? listings.filter((l) => l.sellerId === currentUser.id) : [];
  const activeMyListings = myListings.filter((l) => l.status === 'active');
  const pendingMyListings = myListings.filter((l) => l.status === 'pending');
  const soldMyListings = myListings.filter((l) => l.status === 'sold');
  const pausedMyListings = myListings.filter((l) => l.status === 'paused');

  const favoriteListings = listings.filter((l) => favorites.includes(l.id));

  const myConversations = currentUser
    ? conversations.filter((c) => c.buyerId === currentUser.id || c.sellerId === currentUser.id)
    : [];

  const pendingModerationListings = listings.filter((l) => l.status === 'pending');
  const pendingReports = reports.filter((r) => r.status === 'pending');

  return (
    <div className="max-w-[1250px] mx-auto px-2 sm:px-3 py-2 space-y-[5px]">
      {/* 1. Header Profile & Role Overview Card (Mobile: border margin 1px, 5px spacing, 5px radius) */}
      <div className="bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded-[5px] p-2.5 sm:p-3.5 shadow-2xs m-[1px]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[5px]">
          <div className="flex items-center gap-2.5">
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-[#00A859] shrink-0"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 flex items-center justify-center shrink-0 border border-gray-300 dark:border-gray-700">
                <User className="w-5 h-5" />
              </div>
            )}

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="font-extrabold text-[13px] md:text-[16px] text-gray-900 dark:text-white leading-tight">
                  {currentUser?.name || 'Guest Visitor'}
                </h1>
                <span
                  className={`text-[13px] font-bold px-1.5 py-0.2 rounded-[5px] uppercase tracking-wide ${
                    isAdmin
                      ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                      : isBusiness
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      : isStandard
                      ? 'bg-emerald-500/10 text-[#00A859]'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {isAdmin ? 'Administrator' : isBusiness ? 'Business Seller' : isStandard ? 'Standard User' : 'Guest'}
                </span>
                {currentUser?.isVerifiedBusiness && (
                  <span className="text-[13px] font-bold px-1.5 py-0.2 bg-blue-500/10 text-blue-600 rounded-[5px] flex items-center gap-0.5">
                    <CheckCircle className="w-3 h-3" /> Verified Store
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-[13px] font-normal text-gray-500 dark:text-gray-400 mt-0.5 flex-wrap">
                {currentUser ? (
                  <>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {currentUser.email}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {currentUser.phone}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#00A859]" /> {currentUser.town}, {currentUser.county}
                    </span>
                  </>
                ) : (
                  <span>Unregistered visitor. Sign in or choose a demo role below.</span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Header Buttons */}
          <div className="flex items-center gap-[5px] shrink-0 w-full sm:w-auto justify-end mt-1 sm:mt-0">
            {currentUser ? (
              <>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-2.5 py-1 rounded-[5px] border text-[13px] font-semibold flex items-center gap-1 transition ${
                    activeTab === 'profile'
                      ? 'border-[#00A859] bg-[#00A859] text-white font-bold'
                      : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Profile Settings</span>
                </button>

                <button
                  onClick={logoutUser}
                  className="px-2 py-1 rounded-[5px] border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 text-[13px] font-semibold flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-3 py-1 rounded-[5px] bg-[#00A859] hover:bg-[#00924c] text-white text-[13px] font-bold shadow-2xs flex items-center gap-1"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In / Create Account</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Role Evaluator Selector */}
        <div className="mt-2.5 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between flex-wrap gap-[5px] text-[13px]">
          <span className="font-bold text-gray-700 dark:text-gray-300">
            Switch Dashboard Role Mode:
          </span>

          <div className="flex items-center gap-[5px] flex-wrap">
            {[
              { id: 'buyer', label: 'Standard User (Buyer/Seller)', roleTarget: 'buyer' as UserRole },
              { id: 'business', label: 'Business Seller', roleTarget: 'business' as UserRole },
              { id: 'admin', label: 'Administrator', roleTarget: 'admin' as UserRole },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => switchRole(btn.roleTarget)}
                className={`px-2 py-0.5 rounded-[5px] text-[13px] transition ${
                  (btn.id === 'admin' && isAdmin) ||
                  (btn.id === 'business' && isBusiness && !isAdmin) ||
                  (btn.id === 'buyer' && isStandard)
                    ? 'bg-[#00A859] text-white font-extrabold shadow-2xs'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 font-medium'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Conditionally Rendered Role Navigation Tabs */}
      <div className="flex items-center gap-[5px] border-b border-gray-200 dark:border-gray-800 overflow-x-auto no-scrollbar text-[13px] m-[1px]">
        {/* Universal Overview */}
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-1.5 px-2.5 font-bold border-b-2 transition whitespace-nowrap rounded-t-[5px] ${
            activeTab === 'overview'
              ? 'border-[#00A859] text-[#00A859]'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900'
          }`}
        >
          {isAdmin ? 'Admin Center' : isBusiness ? 'Storefront Hub' : 'My Dashboard'}
        </button>

        {/* STANDARD USER TABS */}
        {isStandard && (
          <>
            <button
              onClick={() => setActiveTab('saved')}
              className={`py-1.5 px-2.5 font-bold border-b-2 transition flex items-center gap-1 whitespace-nowrap rounded-t-[5px] ${
                activeTab === 'saved'
                  ? 'border-[#00A859] text-[#00A859]'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              <span>Saved Ads ({favorites.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('my-inventory')}
              className={`py-1.5 px-2.5 font-bold border-b-2 transition flex items-center gap-1 whitespace-nowrap rounded-t-[5px] ${
                activeTab === 'my-inventory'
                  ? 'border-[#00A859] text-[#00A859]'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#00A859]" />
              <span>My Advertisements ({myListings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`py-1.5 px-2.5 font-bold border-b-2 transition flex items-center gap-1 whitespace-nowrap rounded-t-[5px] ${
                activeTab === 'inquiries'
                  ? 'border-[#00A859] text-[#00A859]'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
              <span>Inquiries ({myConversations.length})</span>
            </button>
          </>
        )}

        {/* BUSINESS SELLER TABS */}
        {isBusiness && (
          <>
            <button
              onClick={() => setActiveTab('storefront-manager')}
              className={`py-1.5 px-2.5 font-bold border-b-2 transition flex items-center gap-1 whitespace-nowrap rounded-t-[5px] ${
                activeTab === 'storefront-manager'
                  ? 'border-[#00A859] text-[#00A859]'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-amber-500" />
              <span>Storefront Manager</span>
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`py-1.5 px-2.5 font-bold border-b-2 transition flex items-center gap-1 whitespace-nowrap rounded-t-[5px] ${
                activeTab === 'catalog'
                  ? 'border-[#00A859] text-[#00A859]'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#00A859]" />
              <span>Catalog & Stock ({myListings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('leads')}
              className={`py-1.5 px-2.5 font-bold border-b-2 transition flex items-center gap-1 whitespace-nowrap rounded-t-[5px] ${
                activeTab === 'leads'
                  ? 'border-[#00A859] text-[#00A859]'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>Customer Leads ({myConversations.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-1.5 px-2.5 font-bold border-b-2 transition flex items-center gap-1 whitespace-nowrap rounded-t-[5px] ${
                activeTab === 'reviews'
                  ? 'border-[#00A859] text-[#00A859]'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Reviews & Ratings ({currentUser?.reviewsCount || 24})</span>
            </button>
          </>
        )}

        {/* ADMINISTRATOR TABS */}
        {isAdmin && (
          <>
            <button
              onClick={() => setActiveTab('moderation')}
              className={`py-1.5 px-2.5 font-bold border-b-2 transition flex items-center gap-1 whitespace-nowrap rounded-t-[5px] text-purple-600 ${
                activeTab === 'moderation'
                  ? 'border-purple-600 font-extrabold'
                  : 'border-transparent hover:text-purple-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Moderation Queue ({pendingModerationListings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`py-1.5 px-2.5 font-bold border-b-2 transition flex items-center gap-1 whitespace-nowrap rounded-t-[5px] text-red-600 ${
                activeTab === 'reports'
                  ? 'border-red-600 font-extrabold'
                  : 'border-transparent hover:text-red-700'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Fraud Reports ({pendingReports.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('users-management')}
              className={`py-1.5 px-2.5 font-bold border-b-2 transition flex items-center gap-1 whitespace-nowrap rounded-t-[5px] ${
                activeTab === 'users-management'
                  ? 'border-purple-600 text-purple-600 font-extrabold'
                  : 'border-transparent text-gray-600 dark:text-gray-400'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Users Directory ({users.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('platform-settings')}
              className={`py-1.5 px-2.5 font-bold border-b-2 transition flex items-center gap-1 whitespace-nowrap rounded-t-[5px] ${
                activeTab === 'platform-settings'
                  ? 'border-purple-600 text-purple-600 font-extrabold'
                  : 'border-transparent text-gray-600 dark:text-gray-400'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Platform Controls</span>
            </button>
          </>
        )}

        {/* Universal Profile Settings Tab */}
        {currentUser && (
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-1.5 px-2.5 font-bold border-b-2 transition flex items-center gap-1 whitespace-nowrap rounded-t-[5px] ${
              activeTab === 'profile'
                ? 'border-[#00A859] text-[#00A859]'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Profile Settings</span>
          </button>
        )}
      </div>

      {/* 3. CONDITIONAL RENDERING OF CONTENT PER ROLE */}

      {/* =========================================================================
          VIEW A: GUEST VISITOR DASHBOARD
         ========================================================================= */}
      {isGuest && (
        <div className="bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded-[5px] p-3 sm:p-4 text-center sm:text-left space-y-3 m-[1px]">
          <div className="max-w-2xl space-y-1">
            <h2 className="font-extrabold text-[13px] md:text-[16px] text-gray-900 dark:text-white">
              Welcome to adBay Kenya
            </h2>
            <p className="text-[13px] font-normal text-gray-600 dark:text-gray-400">
              You are currently viewing adBay as a guest visitor. Sign in or register to unlock personal dashboards, saved items, buyer-seller chat, and advertising inventory tools.
            </p>
          </div>

          <div className="flex items-center gap-[5px] flex-wrap justify-center sm:justify-start">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-3.5 py-1.5 rounded-[5px] bg-[#00A859] hover:bg-[#00924c] text-white font-bold text-[13px] shadow-2xs"
            >
              Sign In / Register
            </button>
            <button
              onClick={() => switchRole('buyer')}
              className="px-3 py-1.5 rounded-[5px] border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px] font-medium"
            >
              Test as Standard User
            </button>
            <button
              onClick={() => switchRole('business')}
              className="px-3 py-1.5 rounded-[5px] border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px] font-medium"
            >
              Test as Business Seller
            </button>
            <button
              onClick={() => switchRole('admin')}
              className="px-3 py-1.5 rounded-[5px] border border-purple-300 dark:border-purple-800 text-purple-600 text-[13px] font-bold"
            >
              Test as Administrator
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW B: STANDARD USER DASHBOARD (BUYER / INDIVIDUAL SELLER)
         ========================================================================= */}
      {isStandard && (
        <div className="space-y-[5px]">
          {activeTab === 'overview' && (
            <div className="space-y-[5px]">
              {/* Standard User Metrics Grid (5px spacing, 5px radius, 1px margin) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-[5px] m-[1px]">
                <div className="p-2.5 rounded-[5px] bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between text-gray-500 mb-0.5">
                    <span className="text-[13px] font-bold uppercase text-gray-500">Saved Ads</span>
                    <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                  </div>
                  <div className="text-[13px] font-extrabold text-gray-900 dark:text-white">{favorites.length} Items</div>
                  <button
                    onClick={() => setActiveTab('saved')}
                    className="text-[13px] text-[#00A859] font-bold hover:underline mt-1 block"
                  >
                    View Bookmarks →
                  </button>
                </div>

                <div className="p-2.5 rounded-[5px] bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between text-gray-500 mb-0.5">
                    <span className="text-[13px] font-bold uppercase text-gray-500">My Listings</span>
                    <Layers className="w-3.5 h-3.5 text-[#00A859]" />
                  </div>
                  <div className="text-[13px] font-extrabold text-gray-900 dark:text-white">{myListings.length} Ads</div>
                  <button
                    onClick={() => setActiveTab('my-inventory')}
                    className="text-[13px] text-[#00A859] font-bold hover:underline mt-1 block"
                  >
                    Manage Inventory →
                  </button>
                </div>

                <div className="p-2.5 rounded-[5px] bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between text-gray-500 mb-0.5">
                    <span className="text-[13px] font-bold uppercase text-gray-500">Active Chats</span>
                    <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <div className="text-[13px] font-extrabold text-gray-900 dark:text-white">{myConversations.length} Inquiries</div>
                  <button
                    onClick={() => setActiveView('messages')}
                    className="text-[13px] text-[#00A859] font-bold hover:underline mt-1 block"
                  >
                    Open Messages →
                  </button>
                </div>

                <div className="p-2.5 rounded-[5px] bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between text-gray-500 mb-0.5">
                    <span className="text-[13px] font-bold uppercase text-gray-500">Safety Status</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div className="text-[13px] font-extrabold text-emerald-600">Protected</div>
                  <button
                    onClick={() => setActiveView('safety')}
                    className="text-[13px] text-[#00A859] font-bold hover:underline mt-1 block"
                  >
                    Safety Guide →
                  </button>
                </div>
              </div>

              {/* Quick Actions for Standard User */}
              <div className="flex items-center gap-[5px] flex-wrap m-[1px]">
                <button
                  onClick={() => setIsPostAdOpen(true)}
                  className="px-3 py-1.5 rounded-[5px] bg-[#F59E0B] hover:bg-[#d97706] text-gray-950 font-extrabold text-[13px] flex items-center gap-1 shadow-2xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Post Free Classified Ad</span>
                </button>
                <button
                  onClick={() => setActiveTab('saved')}
                  className="px-3 py-1.5 rounded-[5px] border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-[13px] font-bold flex items-center gap-1 text-gray-800 dark:text-gray-200"
                >
                  <Heart className="w-3.5 h-3.5 text-red-500" />
                  <span>View Saved Ads ({favorites.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="px-3 py-1.5 rounded-[5px] border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-[13px] font-bold flex items-center gap-1 text-gray-800 dark:text-gray-200"
                >
                  <Settings className="w-3.5 h-3.5 text-[#00A859]" />
                  <span>Edit Profile</span>
                </button>
              </div>

              {/* Saved Ads Preview */}
              <div className="bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded-[5px] p-2.5 m-[1px]">
                <div className="flex items-center justify-between pb-1.5 border-b border-gray-100 dark:border-gray-800 mb-2">
                  <h3 className="font-extrabold text-[13px] text-gray-900 dark:text-white flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> Saved Advertisements Bookmarks
                  </h3>
                  <button
                    onClick={() => setActiveTab('saved')}
                    className="text-[13px] font-bold text-[#00A859] hover:underline"
                  >
                    View All ({favorites.length})
                  </button>
                </div>

                {favoriteListings.length === 0 ? (
                  <p className="text-[13px] font-normal text-gray-500 py-3 text-center">
                    No bookmarked items yet. Tap the heart icon on any ad to bookmark it here.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-[5px]">
                    {favoriteListings.slice(0, 4).map((listing) => (
                      <ListingCard key={listing.id} listing={listing} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: SAVED ADS */}
          {activeTab === 'saved' && (
            <div className="space-y-[5px] m-[1px]">
              <div className="flex items-center justify-between p-2.5 bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded-[5px]">
                <div>
                  <h3 className="font-extrabold text-[13px] text-gray-900 dark:text-white">
                    Saved Advertisements ({favoriteListings.length})
                  </h3>
                  <p className="text-[13px] font-normal text-gray-500">
                    Bookmarked items stored for easy comparison and direct seller contact.
                  </p>
                </div>
                <button
                  onClick={() => setActiveView('search')}
                  className="px-2.5 py-1 rounded-[5px] bg-[#00A859] text-white font-bold text-[13px]"
                >
                  Browse More
                </button>
              </div>

              {favoriteListings.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded-[5px] space-y-2">
                  <Heart className="w-8 h-8 text-gray-300 mx-auto" />
                  <p className="text-[13px] font-bold text-gray-700 dark:text-gray-300">No saved ads yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-[5px]">
                  {favoriteListings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: MY ADVERTISEMENTS / INVENTORY */}
          {activeTab === 'my-inventory' && (
            <div className="space-y-[5px] m-[1px]">
              <div className="flex items-center justify-between p-2.5 bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded-[5px]">
                <div>
                  <h3 className="font-extrabold text-[13px] text-gray-900 dark:text-white">
                    My Advertisements ({myListings.length})
                  </h3>
                  <p className="text-[13px] font-normal text-gray-500">
                    Active: {activeMyListings.length} • In Review: {pendingMyListings.length} • Sold: {soldMyListings.length}
                  </p>
                </div>
                <button
                  onClick={() => setIsPostAdOpen(true)}
                  className="px-2.5 py-1 rounded-[5px] bg-[#F59E0B] text-gray-950 font-extrabold text-[13px] flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Post Ad</span>
                </button>
              </div>

              {myListings.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded-[5px] space-y-2">
                  <Layers className="w-8 h-8 text-gray-300 mx-auto" />
                  <p className="text-[13px] font-bold text-gray-700 dark:text-gray-300">You haven't posted any advertisements yet.</p>
                  <button
                    onClick={() => setIsPostAdOpen(true)}
                    className="px-3 py-1 bg-[#F59E0B] text-gray-950 font-bold rounded-[5px] text-[13px]"
                  >
                    Post Your First Ad
                  </button>
                </div>
              ) : (
                <div className="space-y-[5px]">
                  {myListings.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded-[5px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[5px]"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-14 h-14 rounded-[5px] object-cover shrink-0 cursor-pointer"
                          onClick={() => setActiveListingId(item.id)}
                        />
                        <div>
                          <div className="flex items-center gap-1 flex-wrap">
                            <span
                              className={`text-[13px] font-extrabold px-1.5 py-0.2 rounded-[5px] uppercase ${
                                item.status === 'active'
                                  ? 'bg-emerald-500/10 text-emerald-600'
                                  : item.status === 'pending'
                                  ? 'bg-amber-500/10 text-amber-600'
                                  : 'bg-gray-200 dark:bg-gray-800 text-gray-500'
                              }`}
                            >
                              {item.status}
                            </span>
                            <span className="text-[13px] font-normal text-gray-500">• {item.town}, {item.county}</span>
                          </div>
                          <h4
                            onClick={() => setActiveListingId(item.id)}
                            className="font-bold text-[13px] text-gray-900 dark:text-white hover:text-[#00A859] cursor-pointer"
                          >
                            {item.title}
                          </h4>
                          <span className="font-extrabold text-[13px] text-[#00A859]">
                            KSh {item.price.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Item management actions */}
                      <div className="flex items-center gap-[5px] flex-wrap self-end sm:self-center">
                        <button
                          onClick={() => {
                            setListingToPromote(item);
                            setIsPromoteModalOpen(true);
                          }}
                          className="px-2 py-0.5 rounded-[5px] bg-amber-500/15 text-amber-700 dark:text-amber-400 font-extrabold text-[13px] flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" /> Boost Ad
                        </button>

                        {item.status !== 'sold' && (
                          <button
                            onClick={() => markAsSold(item.id)}
                            className="px-2 py-0.5 rounded-[5px] bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium text-[13px]"
                          >
                            Mark Sold
                          </button>
                        )}

                        <button
                          onClick={() => togglePauseListing(item.id)}
                          className="p-1 rounded-[5px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                          title="Pause or Resume"
                        >
                          {item.status === 'paused' ? <PlayCircle className="w-4 h-4 text-emerald-600" /> : <PauseCircle className="w-4 h-4 text-amber-600" />}
                        </button>

                        <button
                          onClick={() => deleteListing(item.id)}
                          className="p-1 rounded-[5px] bg-red-50 text-red-600 hover:bg-red-100"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: INQUIRIES & CHATS */}
          {activeTab === 'inquiries' && (
            <div className="space-y-[5px] m-[1px]">
              <div className="p-2.5 bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded-[5px] flex items-center justify-between">
                <h3 className="font-extrabold text-[13px] text-gray-900 dark:text-white">
                  Chats & Inquiries ({myConversations.length})
                </h3>
                <button
                  onClick={() => setActiveView('messages')}
                  className="px-2.5 py-1 rounded-[5px] bg-[#00A859] text-white font-bold text-[13px]"
                >
                  Open Full Chat
                </button>
              </div>

              {myConversations.length === 0 ? (
                <div className="p-6 text-center bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded-[5px] text-gray-500 text-[13px]">
                  No active inquiries yet. Messages from buyers will appear here.
                </div>
              ) : (
                <div className="space-y-[5px]">
                  {myConversations.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setActiveView('messages')}
                      className="p-2.5 rounded-[5px] bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 hover:border-[#00A859] cursor-pointer flex items-center justify-between transition"
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={c.listingImage} alt="" className="w-10 h-10 rounded-[5px] object-cover shrink-0" />
                        <div>
                          <h4 className="font-bold text-[13px] text-gray-900 dark:text-white">{c.listingTitle}</h4>
                          <p className="text-[13px] font-normal text-gray-500 truncate max-w-sm">{c.lastMessage}</p>
                        </div>
                      </div>
                      <span className="text-[13px] font-medium text-gray-400">{c.lastMessageAt}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          VIEW C: BUSINESS SELLER DASHBOARD
         ========================================================================= */}
      {isBusiness && (
        <div className="space-y-[5px]">
          {/* Storefront Hub / Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-[5px]">
              {/* Business Verified Badge Bar */}
              <div className="bg-gradient-to-r from-blue-900/10 via-emerald-900/10 to-transparent border border-blue-500/20 rounded-[5px] p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[5px] m-[1px]">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-[5px] bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0">
                    🏪
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[13px] md:text-[15px] text-gray-900 dark:text-white flex items-center gap-1.5">
                      {currentUser?.businessProfile?.storeName || 'Apex Tech Kenya Ltd'}
                      <span className="text-[13px] font-bold text-blue-600 bg-blue-500/15 px-1.5 py-0.2 rounded-[5px] flex items-center gap-0.5">
                        <CheckCircle className="w-3 h-3" /> Official Verified Store
                      </span>
                    </h3>
                    <p className="text-[13px] font-normal text-gray-500">
                      Reg No: {currentUser?.businessProfile?.registrationNumber || 'BN-KE-749210'} • {currentUser?.businessProfile?.address || `${currentUser?.town}, ${currentUser?.county}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-[5px] shrink-0">
                  <button
                    onClick={() => setActiveTab('storefront-manager')}
                    className="px-3 py-1 rounded-[5px] bg-blue-600 hover:bg-blue-700 text-white font-bold text-[13px]"
                  >
                    Manage Store
                  </button>
                  <button
                    onClick={() => setActiveView('storefront')}
                    className="px-3 py-1 rounded-[5px] border border-gray-300 dark:border-gray-700 text-[13px] font-bold text-gray-700 dark:text-gray-300"
                  >
                    Public View
                  </button>
                </div>
              </div>

              {/* Business Performance Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-[5px] m-[1px]">
                <div className="p-2.5 rounded-[5px] bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800">
                  <span className="text-[13px] font-bold text-gray-500 uppercase block mb-0.5">Catalog Items</span>
                  <div className="text-[13px] font-extrabold text-[#00A859]">{myListings.length} Products</div>
                  <span className="text-[13px] font-normal text-gray-400">Published online</span>
                </div>

                <div className="p-2.5 rounded-[5px] bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800">
                  <span className="text-[13px] font-bold text-gray-500 uppercase block mb-0.5">Customer Rating</span>
                  <div className="text-[13px] font-extrabold text-amber-500 flex items-center gap-1">
                    ★ {currentUser?.rating.toFixed(1) || '4.9'}
                  </div>
                  <span className="text-[13px] font-normal text-gray-400">From {currentUser?.reviewsCount || 24} reviews</span>
                </div>

                <div className="p-2.5 rounded-[5px] bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800">
                  <span className="text-[13px] font-bold text-gray-500 uppercase block mb-0.5">Response Rate</span>
                  <div className="text-[13px] font-extrabold text-blue-600">&lt; 15 mins (100%)</div>
                  <span className="text-[13px] font-normal text-gray-400">Fast Kenyan dispatch</span>
                </div>

                <div className="p-2.5 rounded-[5px] bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800">
                  <span className="text-[13px] font-bold text-gray-500 uppercase block mb-0.5">Customer Inquiries</span>
                  <div className="text-[13px] font-extrabold text-purple-600">{myConversations.length} Active</div>
                  <span className="text-[13px] font-normal text-gray-400">High intent leads</span>
                </div>
              </div>

              {/* Direct Store Actions */}
              <div className="flex items-center gap-[5px] flex-wrap m-[1px]">
                <button
                  onClick={() => setIsPostAdOpen(true)}
                  className="px-3 py-1.5 rounded-[5px] bg-[#00A859] hover:bg-[#00924c] text-white font-extrabold text-[13px] flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Add Product to Store Catalog</span>
                </button>
                <button
                  onClick={() => setActiveTab('storefront-manager')}
                  className="px-3 py-1.5 rounded-[5px] border border-blue-500/30 text-blue-600 bg-blue-50/20 font-bold text-[13px]"
                >
                  Edit Opening Hours & Physical Shop
                </button>
              </div>
            </div>
          )}

          {/* TAB: STOREFRONT MANAGER */}
          {activeTab === 'storefront-manager' && (
            <div className="bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded-[5px] p-3 sm:p-4 space-y-3 m-[1px]">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <h3 className="font-extrabold text-[13px] md:text-[15px] text-gray-900 dark:text-white flex items-center gap-1.5">
                    <Store className="w-4 h-4 text-amber-500" />
                    <span>Storefront Profile & Credentials</span>
                  </h3>
                  <p className="text-[13px] font-normal text-gray-500">
                    Configure your official verified business presence on adBay Kenya.
                  </p>
                </div>
                <button
                  onClick={() => setActiveView('storefront')}
                  className="px-2.5 py-1 rounded-[5px] bg-[#00A859] text-white font-bold text-[13px] flex items-center gap-1"
                >
                  <span>Public Preview</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-[5px] text-[13px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[5px]">
                  <div>
                    <label className="font-bold text-gray-800 dark:text-gray-200 block mb-0.5">Store / Brand Name</label>
                    <input
                      type="text"
                      required
                      value={editStoreName}
                      onChange={(e) => setEditStoreName(e.target.value)}
                      className="w-full px-2.5 py-1 rounded-[5px] border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-800 dark:text-gray-200 block mb-0.5">Physical Shop Address / Street</label>
                    <input
                      type="text"
                      required
                      value={editStoreAddress}
                      onChange={(e) => setEditStoreAddress(e.target.value)}
                      className="w-full px-2.5 py-1 rounded-[5px] border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-800 dark:text-gray-200 block mb-0.5">Opening Hours</label>
                    <input
                      type="text"
                      required
                      value={editOpeningHours}
                      onChange={(e) => setEditOpeningHours(e.target.value)}
                      className="w-full px-2.5 py-1 rounded-[5px] border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-800 dark:text-gray-200 block mb-0.5">WhatsApp Hotline Number</label>
                    <input
                      type="tel"
                      required
                      value={editWhatsapp}
                      onChange={(e) => setEditWhatsapp(e.target.value)}
                      className="w-full px-2.5 py-1 rounded-[5px] border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-800 dark:text-gray-200 block mb-0.5">Store Description & Delivery Terms</label>
                  <textarea
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full px-2.5 py-1 rounded-[5px] border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px]"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-[5px] bg-[#00A859] hover:bg-[#00924c] text-white font-extrabold text-[13px] flex items-center gap-1 shadow-2xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Storefront Settings</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB: CATALOG */}
          {activeTab === 'catalog' && (
            <div className="space-y-[5px] m-[1px]">
              <div className="flex items-center justify-between p-2.5 bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded-[5px]">
                <h3 className="font-extrabold text-[13px] text-gray-900 dark:text-white">
                  Store Catalog & Stock ({myListings.length} products)
                </h3>
                <button
                  onClick={() => setIsPostAdOpen(true)}
                  className="px-2.5 py-1 rounded-[5px] bg-[#00A859] text-white font-bold text-[13px]"
                >
                  + Add Product
                </button>
              </div>

              <div className="space-y-[5px]">
                {myListings.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded-[5px] flex items-center justify-between gap-[5px]"
                  >
                    <div className="flex items-center gap-2">
                      <img src={item.images[0]} alt="" className="w-12 h-12 rounded-[5px] object-cover shrink-0" />
                      <div>
                        <h4 className="font-bold text-[13px] text-gray-900 dark:text-white">{item.title}</h4>
                        <p className="text-[13px] font-extrabold text-[#00A859]">KSh {item.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-[5px]">
                      <button
                        onClick={() => {
                          setListingToPromote(item);
                          setIsPromoteModalOpen(true);
                        }}
                        className="px-2 py-0.5 rounded-[5px] bg-amber-500/15 text-amber-700 dark:text-amber-400 font-extrabold text-[13px]"
                      >
                        Boost
                      </button>
                      <button
                        onClick={() => markAsSold(item.id)}
                        className="px-2 py-0.5 rounded-[5px] bg-gray-100 dark:bg-gray-800 font-medium text-[13px]"
                      >
                        {item.status === 'sold' ? 'Sold' : 'Mark Sold'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: LEADS */}
          {activeTab === 'leads' && (
            <div className="space-y-[5px] m-[1px]">
              <div className="p-2.5 bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded-[5px]">
                <h3 className="font-extrabold text-[13px] text-gray-900 dark:text-white">Customer Leads & Inquiries</h3>
                <p className="text-[13px] font-normal text-gray-500">Inbound inquiries from shoppers viewing your storefront.</p>
              </div>
              <div className="space-y-[5px]">
                {myConversations.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setActiveView('messages')}
                    className="p-2.5 bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded-[5px] hover:border-[#00A859] cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-[13px] text-gray-900 dark:text-white">{c.buyerName} inquiring on: {c.listingTitle}</h4>
                      <p className="text-[13px] font-normal text-gray-500">{c.lastMessage}</p>
                    </div>
                    <button className="px-2 py-0.5 bg-[#00A859] text-white rounded-[5px] text-[13px] font-bold">Reply</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="p-3 bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded-[5px] space-y-2 m-[1px]">
              <h3 className="font-extrabold text-[13px] text-gray-900 dark:text-white">Customer Feedback & Verified Ratings</h3>
              <div className="p-2.5 rounded-[5px] bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-[13px] text-amber-700 dark:text-amber-400">
                    ★ 4.9 Average Store Rating
                  </span>
                  <p className="text-[13px] font-normal text-gray-600 dark:text-gray-400">Based on 24 verified completed transactions.</p>
                </div>
                <span className="text-[13px] font-extrabold px-2 py-0.5 bg-white dark:bg-gray-800 rounded-[5px]">100% Positive</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          VIEW D: ADMINISTRATOR CONTROL DASHBOARD
         ========================================================================= */}
      {isAdmin && (
        <div className="space-y-[5px]">
          {/* Admin Center Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-[5px]">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-[5px] m-[1px]">
                <div className="p-2.5 rounded-[5px] bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800">
                  <span className="text-[13px] font-bold text-gray-500 uppercase block mb-0.5">Pending Moderation</span>
                  <div className="text-[13px] font-extrabold text-amber-500">{pendingModerationListings.length} Ads</div>
                  <button onClick={() => setActiveTab('moderation')} className="text-[13px] text-purple-600 font-bold hover:underline">Review Queue →</button>
                </div>

                <div className="p-2.5 rounded-[5px] bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800">
                  <span className="text-[13px] font-bold text-gray-500 uppercase block mb-0.5">Scam / Fraud Reports</span>
                  <div className="text-[13px] font-extrabold text-red-500">{pendingReports.length} Reports</div>
                  <button onClick={() => setActiveTab('reports')} className="text-[13px] text-red-600 font-bold hover:underline">Audit Tickets →</button>
                </div>

                <div className="p-2.5 rounded-[5px] bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800">
                  <span className="text-[13px] font-bold text-gray-500 uppercase block mb-0.5">Platform Users</span>
                  <div className="text-[13px] font-extrabold text-purple-600">{users.length} Users</div>
                  <button onClick={() => setActiveTab('users-management')} className="text-[13px] text-purple-600 font-bold hover:underline">Directory →</button>
                </div>

                <div className="p-2.5 rounded-[5px] bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800">
                  <span className="text-[13px] font-bold text-gray-500 uppercase block mb-0.5">Total Kenya Listings</span>
                  <div className="text-[13px] font-extrabold text-[#00A859]">{listings.length} Listings</div>
                  <button onClick={() => setActiveView('admin')} className="text-[13px] text-[#00A859] font-bold hover:underline">Full Panel →</button>
                </div>
              </div>

              {/* Quick Admin Actions */}
              <div className="flex items-center gap-[5px] flex-wrap m-[1px]">
                <button
                  onClick={() => setActiveTab('moderation')}
                  className="px-3 py-1.5 rounded-[5px] bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-[13px] flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Review Moderation ({pendingModerationListings.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('platform-settings')}
                  className="px-3 py-1.5 rounded-[5px] border border-purple-500/30 text-purple-600 font-bold text-[13px]"
                >
                  Emergency Banner Controls
                </button>
                <button
                  onClick={() => setActiveView('admin')}
                  className="px-3 py-1.5 rounded-[5px] border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 font-bold text-[13px]"
                >
                  Launch Full Admin Dashboard
                </button>
              </div>
            </div>
          )}

          {/* TAB: MODERATION QUEUE */}
          {activeTab === 'moderation' && (
            <div className="space-y-[5px] m-[1px]">
              <div className="p-2.5 bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded-[5px] flex items-center justify-between">
                <h3 className="font-extrabold text-[13px] text-gray-900 dark:text-white">
                  Listings Requiring Approval ({pendingModerationListings.length})
                </h3>
                <span className="text-[13px] font-normal text-gray-500">Enforcing Kenya Consumer Safety</span>
              </div>

              {pendingModerationListings.length === 0 ? (
                <p className="p-4 rounded-[5px] bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 text-[13px] text-gray-500 text-center">
                  All listings are moderated and approved! Queue is clean.
                </p>
              ) : (
                pendingModerationListings.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded-[5px] flex items-center justify-between gap-[5px]"
                  >
                    <div className="flex items-center gap-2">
                      <img src={item.images[0]} alt="" className="w-12 h-12 rounded-[5px] object-cover shrink-0" />
                      <div>
                        <h4 className="font-bold text-[13px] text-gray-900 dark:text-white">{item.title}</h4>
                        <p className="text-[13px] font-normal text-gray-500">
                          Seller: {item.sellerName} • KSh {item.price.toLocaleString()} • {item.town}, {item.county}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-[5px] shrink-0">
                      <button
                        onClick={() => approveListing(item.id)}
                        className="px-2.5 py-1 rounded-[5px] bg-[#00A859] text-white font-extrabold text-[13px]"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectListing(item.id, 'Violates Kenyan listing guidelines')}
                        className="px-2.5 py-1 rounded-[5px] bg-red-600 text-white font-extrabold text-[13px]"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB: REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-[5px] m-[1px]">
              <div className="p-2.5 bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded-[5px]">
                <h3 className="font-extrabold text-[13px] text-gray-900 dark:text-white">Fraud & Scam Reports Flagged by Buyers</h3>
              </div>

              {pendingReports.length === 0 ? (
                <p className="p-4 rounded-[5px] bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 text-[13px] text-gray-500 text-center">
                  No active reports flagged.
                </p>
              ) : (
                pendingReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-2.5 bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-[5px] flex items-center justify-between gap-[5px]"
                  >
                    <div>
                      <span className="font-extrabold text-red-600 uppercase text-[13px]">{report.reason}</span>
                      <h4 className="font-bold text-[13px] text-gray-900 dark:text-white">{report.targetTitle}</h4>
                      <p className="text-[13px] font-normal text-gray-600 dark:text-gray-400">{report.details}</p>
                    </div>
                    <div className="flex items-center gap-[5px] shrink-0">
                      <button
                        onClick={() => resolveReport(report.id, 'resolved')}
                        className="px-2.5 py-1 rounded-[5px] bg-emerald-600 text-white font-extrabold text-[13px]"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => resolveReport(report.id, 'dismissed')}
                        className="px-2 py-1 rounded-[5px] bg-gray-600 text-white font-medium text-[13px]"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB: USERS MANAGEMENT */}
          {activeTab === 'users-management' && (
            <div className="space-y-[5px] m-[1px]">
              <div className="p-2.5 bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded-[5px]">
                <h3 className="font-extrabold text-[13px] text-gray-900 dark:text-white">User Accounts Directory ({users.length})</h3>
                <p className="text-[13px] font-normal text-gray-500">Manage user roles, grant verified merchant badges, or suspend accounts.</p>
              </div>

              <div className="space-y-[5px]">
                {users.map((u) => (
                  <div
                    key={u.id}
                    className="p-2.5 bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded-[5px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[5px]"
                  >
                    <div className="flex items-center gap-2">
                      <img src={u.avatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
                      <div>
                        <div className="flex items-center gap-1 flex-wrap">
                          <h4 className="font-bold text-[13px] text-gray-900 dark:text-white">{u.name}</h4>
                          <span className="font-extrabold text-[13px] text-purple-600 uppercase">({u.role})</span>
                          {u.isVerifiedBusiness && <span className="text-[13px] font-bold text-blue-600">✓ Verified Store</span>}
                        </div>
                        <p className="text-[13px] font-normal text-gray-500">{u.email} • {u.phone} • {u.town}, {u.county}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-[5px] flex-wrap self-end sm:self-center">
                      {!u.isVerifiedBusiness && (
                        <button
                          onClick={() => verifyBusinessAccount(u.id)}
                          className="px-2 py-0.5 rounded-[5px] bg-blue-50 text-blue-600 font-bold text-[13px]"
                        >
                          Verify Store
                        </button>
                      )}
                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className={`px-2 py-0.5 rounded-[5px] font-bold text-[13px] ${
                          u.status === 'active' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {u.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PLATFORM SETTINGS */}
          {activeTab === 'platform-settings' && (
            <div className="bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded-[5px] p-3 space-y-[5px] m-[1px]">
              <h3 className="font-extrabold text-[13px] text-gray-900 dark:text-white">Platform Emergency Notice Controls</h3>
              <div className="space-y-[5px]">
                <label className="flex items-center gap-2 text-[13px] font-bold text-gray-800 dark:text-gray-200">
                  <input
                    type="checkbox"
                    checked={showBanner}
                    onChange={(e) => {
                      setShowBanner(e.target.checked);
                      updatePlatformSettings({ showEmergencyBanner: e.target.checked });
                    }}
                    className="w-4 h-4 text-[#00A859] rounded"
                  />
                  <span>Show Top Buyer Safety Banner Across Website & Android App</span>
                </label>

                <div>
                  <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-0.5">Emergency Notice Text</label>
                  <input
                    type="text"
                    value={bannerText}
                    onChange={(e) => setBannerText(e.target.value)}
                    className="w-full px-2.5 py-1 rounded-[5px] border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px]"
                  />
                </div>

                <button
                  onClick={() => {
                    updatePlatformSettings({ emergencyBannerText: bannerText, showEmergencyBanner: showBanner });
                    showToast('Emergency safety notice updated!', 'success');
                  }}
                  className="px-3 py-1 bg-purple-600 text-white font-extrabold rounded-[5px] text-[13px]"
                >
                  Update Banner
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          UNIVERSAL VIEW: PROFILE SETTINGS (Enabled across roles)
         ========================================================================= */}
      {activeTab === 'profile' && currentUser && (
        <div className="bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded-[5px] p-3 sm:p-4 space-y-3 m-[1px]">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
            <div>
              <h3 className="font-extrabold text-[13px] md:text-[15px] text-gray-900 dark:text-white flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-[#00A859]" />
                <span>Profile & Account Settings</span>
              </h3>
              <p className="text-[13px] font-normal text-gray-500">
                Manage your credentials, phone number, and location in Kenya.
              </p>
            </div>
            <span className="text-[13px] font-bold px-2 py-0.5 bg-[#00A859]/10 text-[#00A859] rounded-[5px] uppercase">
              {currentRole}
            </span>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-[5px] text-[13px]">
            {/* Profile Picture / Avatar Media Upload Section */}
            <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-[5px] border border-gray-200 dark:border-gray-700">
              <label className="font-bold text-gray-800 dark:text-gray-200 block mb-1.5">
                Profile Photo / Avatar
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="relative group shrink-0">
                  <img
                    src={editAvatar || currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                    alt={currentUser.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#00A859] shadow-xs"
                  />
                  <label
                    htmlFor="avatar-file-input"
                    className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    title="Change photo"
                  >
                    <Camera className="w-5 h-5" />
                  </label>
                </div>

                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <label
                      htmlFor="avatar-file-input"
                      className="px-3 py-1 bg-[#00A859] hover:bg-[#00924c] text-white font-bold rounded-[5px] text-[12px] flex items-center gap-1.5 cursor-pointer shadow-2xs transition"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingAvatar ? 'Optimizing...' : 'Upload New Photo'}</span>
                    </label>
                    <input
                      id="avatar-file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFileUpload}
                      disabled={isUploadingAvatar}
                      className="hidden"
                    />

                    <span className="text-[11px] text-gray-500">
                      JPEG, PNG, WebP (auto-compressed for fast loading)
                    </span>
                  </div>

                  {/* Preset Quick Avatars */}
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className="text-[11px] text-gray-400 font-medium">Quick Presets:</span>
                    {[
                      { label: 'Merchant', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
                      { label: 'Shop Owner', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80' },
                      { label: 'Trader', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80' },
                      { label: 'Professional', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
                    ].map((preset) => (
                      <button
                        type="button"
                        key={preset.label}
                        onClick={() => {
                          setEditAvatar(preset.url);
                          if (currentUser) {
                            updateUserProfile(currentUser.id, { avatar: preset.url });
                          }
                          showToast(`Applied preset: ${preset.label}`, 'info');
                        }}
                        className="text-[10px] px-1.5 py-0.5 rounded-[3px] bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-[#00A859] transition font-medium"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[5px]">
              <div>
                <label className="font-bold text-gray-800 dark:text-gray-200 block mb-0.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-2.5 py-1 rounded-[5px] border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px] text-gray-900 dark:text-white focus:outline-none focus:border-[#00A859]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-800 dark:text-gray-200 block mb-0.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-2.5 py-1 rounded-[5px] border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px] text-gray-900 dark:text-white focus:outline-none focus:border-[#00A859]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-800 dark:text-gray-200 block mb-0.5">
                  Kenyan Mobile Number (M-Pesa enabled)
                </label>
                <input
                  type="tel"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-2.5 py-1 rounded-[5px] border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px] text-gray-900 dark:text-white focus:outline-none focus:border-[#00A859]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[5px]">
              <div>
                <label className="font-bold text-gray-800 dark:text-gray-200 block mb-0.5">County</label>
                <select
                  value={editCounty}
                  onChange={(e) => {
                    const c = e.target.value;
                    setEditCounty(c);
                    const cData = KENYA_COUNTIES.find((k) => k.name === c);
                    if (cData && cData.towns.length > 0) setEditTown(cData.towns[0]);
                  }}
                  className="w-full px-2.5 py-1 rounded-[5px] border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px] text-gray-900 dark:text-white"
                >
                  {KENYA_COUNTIES.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-800 dark:text-gray-200 block mb-0.5">Town / Area</label>
                <select
                  value={editTown}
                  onChange={(e) => setEditTown(e.target.value)}
                  className="w-full px-2.5 py-1 rounded-[5px] border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px] text-gray-900 dark:text-white"
                >
                  {selectedCountyData.towns.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Business fields if business user */}
            {isBusiness && (
              <div className="p-2.5 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-[5px] space-y-[5px]">
                <span className="font-extrabold text-[13px] text-blue-700 dark:text-blue-300 block">
                  Business Storefront Details
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[5px]">
                  <div>
                    <label className="font-bold text-gray-700 dark:text-gray-300 block mb-0.5">Store Name</label>
                    <input
                      type="text"
                      value={editStoreName}
                      onChange={(e) => setEditStoreName(e.target.value)}
                      className="w-full px-2.5 py-1 rounded-[5px] border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-[13px]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 dark:text-gray-300 block mb-0.5">Physical Shop Location</label>
                    <input
                      type="text"
                      value={editStoreAddress}
                      onChange={(e) => setEditStoreAddress(e.target.value)}
                      className="w-full px-2.5 py-1 rounded-[5px] border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-[13px]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 dark:text-gray-300 block mb-0.5">Opening Hours</label>
                    <input
                      type="text"
                      value={editOpeningHours}
                      onChange={(e) => setEditOpeningHours(e.target.value)}
                      className="w-full px-2.5 py-1 rounded-[5px] border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-[13px]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 dark:text-gray-300 block mb-0.5">WhatsApp Hotline</label>
                    <input
                      type="text"
                      value={editWhatsapp}
                      onChange={(e) => setEditWhatsapp(e.target.value)}
                      className="w-full px-2.5 py-1 rounded-[5px] border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-[13px]"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-1.5 rounded-[5px] bg-[#00A859] hover:bg-[#00924c] text-white font-extrabold text-[13px] flex items-center gap-1 shadow-2xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Settings</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
