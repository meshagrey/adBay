/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { HomeView } from './components/home/HomeView';
import { SearchView } from './components/search/SearchView';
import { MyListingsView } from './components/account/MyListingsView';
import { FavoritesView } from './components/account/FavoritesView';
import { MessagesView } from './components/chat/MessagesView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { SellerStorefrontModal } from './components/account/SellerStorefrontModal';
import { SafetyGuideModal } from './components/legal/SafetyGuideModal';
import { ProhibitedItemsModal } from './components/legal/ProhibitedItemsModal';
import { TermsModal } from './components/legal/TermsModal';
import { PrivacyModal } from './components/legal/PrivacyModal';
import { AndroidAppGuideModal } from './components/android/AndroidAppGuideModal';
import { ListingDetailModal } from './components/listing/ListingDetailModal';
import { PostAdModal } from './components/listing/PostAdModal';
import { LocationPickerModal } from './components/common/LocationPickerModal';
import { PromoteAdModal } from './components/monetization/PromoteAdModal';
import { UserDashboardView } from './components/account/UserDashboardView';
import { AuthModal } from './components/account/AuthModal';
import { DesktopFooter } from './components/common/DesktopFooter';
import { BottomMobileNav } from './components/common/BottomMobileNav';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { ToastContainer } from './components/common/ToastContainer';

const MainLayout: React.FC = () => {
  const {
    activeView,
    setActiveView,
    activeListingId,
    setActiveListingId,
    setSelectedCategory,
    isPostAdOpen,
    setIsPostAdOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isLocationPickerOpen,
    setIsLocationPickerOpen,
    isPromoteModalOpen,
    setIsPromoteModalOpen,
    currentRole,
    showToast,
  } = useApp();

  // Route-level role access protection
  useEffect(() => {
    if (activeView === 'admin' && currentRole !== 'admin') {
      showToast('Access restricted: System Administrator credentials required', 'error');
      setActiveView('dashboard');
    } else if (activeView === 'storefront' && currentRole !== 'business' && currentRole !== 'admin') {
      showToast('Storefront management is reserved for verified Business Merchants', 'error');
      setActiveView('dashboard');
    }
  }, [activeView, currentRole, setActiveView, showToast]);

  // Support direct deep links e.g. ?listing=listing-1 or ?category=phones-tablets
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const listingParam = params.get('listing');
    const categoryParam = params.get('category');

    if (listingParam) {
      setActiveListingId(listingParam);
    }
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      setActiveView('search');
    }
  }, [setActiveListingId, setSelectedCategory, setActiveView]);

  // Browser back button handler to prevent app from disappearing/unloading
  useEffect(() => {
    // Ensure initial history state is set
    try {
      if (!window.history.state || !window.history.state.adbay) {
        window.history.replaceState({ adbay: true, view: 'home', modal: null }, '');
      }
    } catch {
      // In sandboxed environments where history may be restricted, fail gracefully
    }

    const handlePopState = (e: PopStateEvent) => {
      // Check if any modal is currently visible
      if (activeListingId) {
        setActiveListingId(null);
        if (activeView === 'listing-detail') {
          setActiveView('home');
        }
        return;
      }
      if (isPostAdOpen) {
        setIsPostAdOpen(false);
        return;
      }
      if (isAuthModalOpen) {
        setIsAuthModalOpen(false);
        return;
      }
      if (isLocationPickerOpen) {
        setIsLocationPickerOpen(false);
        return;
      }
      if (isPromoteModalOpen) {
        setIsPromoteModalOpen(false);
        return;
      }

      // If activeView is not home, return to home
      if (activeView !== 'home') {
        setActiveView('home');
        return;
      }

      // If user is already on home, keep the state pinned so back button doesn't leave the app
      try {
        window.history.pushState({ adbay: true, view: 'home', modal: null }, '');
      } catch {
        // Ignore iframe push state errors
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [
    activeListingId,
    isPostAdOpen,
    isAuthModalOpen,
    isLocationPickerOpen,
    isPromoteModalOpen,
    activeView,
    setActiveListingId,
    setIsPostAdOpen,
    setIsAuthModalOpen,
    setIsLocationPickerOpen,
    setIsPromoteModalOpen,
    setActiveView,
  ]);

  // Push history state whenever navigation or modals change
  useEffect(() => {
    try {
      const anyModalOpen =
        Boolean(activeListingId) ||
        isPostAdOpen ||
        isAuthModalOpen ||
        isLocationPickerOpen ||
        isPromoteModalOpen;

      window.history.pushState(
        {
          adbay: true,
          view: activeView,
          modal: anyModalOpen ? 'open' : null,
          listingId: activeListingId,
        },
        ''
      );
    } catch {
      // Ignore iframe push state restrictions
    }
  }, [
    activeView,
    activeListingId,
    isPostAdOpen,
    isAuthModalOpen,
    isLocationPickerOpen,
    isPromoteModalOpen,
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B1120] text-[#0F172A] dark:text-[#F1F5F9] font-sans antialiased">
      {/* Top Header */}
      <Header />

      {/* Main Content Area based on activeView */}
      <main className="flex-1 pb-20 md:pb-8">
        {(activeView === 'home' || activeView === 'listing-detail') && <HomeView />}
        {activeView === 'search' && <SearchView />}
        {activeView === 'my-ads' && <MyListingsView />}
        {activeView === 'favorites' && <FavoritesView />}
        {(activeView === 'account' || activeView === 'dashboard') && <UserDashboardView />}
        {activeView === 'messages' && <MessagesView />}
        {activeView === 'admin' && <AdminDashboard />}
        {activeView === 'storefront' && <SellerStorefrontModal />}
        {activeView === 'safety' && <SafetyGuideModal />}
        {activeView === 'prohibited' && <ProhibitedItemsModal />}
        {activeView === 'terms' && <TermsModal />}
        {activeView === 'privacy' && <PrivacyModal />}
        {activeView === 'android-guide' && <AndroidAppGuideModal />}
      </main>

      {/* Overlaid Modals */}
      {activeListingId && <ListingDetailModal />}
      <PostAdModal />
      <LocationPickerModal />
      <PromoteAdModal />
      <AuthModal />

      {/* Desktop Footer (Hidden on mobile per brief specification) */}
      <DesktopFooter />

      {/* Fixed Bottom Mobile Menu (Active on mobile devices, 99.5% width) */}
      <BottomMobileNav />

      {/* Offline Connectivity Status Toast */}
      <OfflineIndicator />

      {/* In-App Feedback Toasts */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
