import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { db, auth, googleProvider, OperationType, handleFirestoreError } from '../firebase';
import {
  UserRole,
  UserProfile,
  Category,
  Listing,
  PromotionPackage,
  Review,
  Conversation,
  ChatMessage,
  Report,
  AdminAuditLog,
  PlatformSettings,
  ListingStatus,
  PromotionTier,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_USERS,
  INITIAL_LISTINGS,
  INITIAL_PROMOTION_PACKAGES,
  INITIAL_REVIEWS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_REPORTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_PLATFORM_SETTINGS,
} from '../data/seedData';

export type AppView =
  | 'home'
  | 'search'
  | 'listing-detail'
  | 'my-ads'
  | 'favorites'
  | 'messages'
  | 'admin'
  | 'storefront'
  | 'safety'
  | 'terms'
  | 'privacy'
  | 'prohibited'
  | 'android-guide'
  | 'account'
  | 'dashboard';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  // Navigation & View State
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  activeListingId: string | null;
  setActiveListingId: (id: string | null) => void;
  activeSellerId: string | null;
  setActiveSellerId: (id: string | null) => void;
  isPostAdOpen: boolean;
  setIsPostAdOpen: (open: boolean) => void;
  isLocationPickerOpen: boolean;
  setIsLocationPickerOpen: (open: boolean) => void;
  isPromoteModalOpen: boolean;
  setIsPromoteModalOpen: (open: boolean) => void;
  listingToPromote: Listing | null;
  setListingToPromote: (listing: Listing | null) => void;

  // Search & Filtering
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (catId: string) => void;
  selectedSubcategory: string;
  setSelectedSubcategory: (subcatId: string) => void;
  selectedCounty: string;
  setSelectedCounty: (county: string) => void;
  selectedTown: string;
  setSelectedTown: (town: string) => void;
  recentSearches: string[];
  addRecentSearch: (term: string) => void;
  clearRecentSearches: () => void;

  // Auth & Roles
  currentUser: UserProfile | null;
  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
  users: UserProfile[];
  updateUserRole: (userId: string, newRole: UserRole) => void;
  toggleUserStatus: (userId: string) => void;
  verifyBusinessAccount: (userId: string) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  registerUser: (userData: Partial<UserProfile> & { name: string; email: string; phone: string; role: UserRole; county: string; town: string }) => UserProfile;
  loginUser: (emailOrPhone: string) => boolean;
  loginWithGoogle: () => Promise<void>;
  logoutUser: () => void;
  updateUserProfile: (userId: string, updates: Partial<UserProfile>) => void;
  isFirebaseConnected: boolean;

  // Theme
  isDarkMode: boolean;
  toggleTheme: () => void;

  // Listings & Categories
  categories: Category[];
  addCategory: (name: string, description: string, iconName?: string) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addSubcategory: (categoryId: string, subName: string) => void;
  deleteSubcategory: (categoryId: string, subcategoryId: string) => void;
  listings: Listing[];
  isListingsLoading: boolean;
  setIsListingsLoading: (loading: boolean) => void;
  addListing: (listingData: Omit<Listing, 'id' | 'viewsCount' | 'favoritesCount' | 'createdAt'>) => string;
  updateListing: (id: string, updates: Partial<Listing>) => void;
  markAsSold: (id: string) => void;
  togglePauseListing: (id: string) => void;
  deleteListing: (id: string) => void;
  boostListing: (listingId: string, packageId: string) => void;
  approveListing: (id: string) => void;
  rejectListing: (id: string, reason: string) => void;

  // Favorites & Follows & History
  favorites: string[];
  toggleFavorite: (listingId: string) => void;
  isFavorite: (listingId: string) => boolean;
  recentlyViewedIds: string[];
  addToRecentlyViewed: (listingId: string) => void;
  following: string[];
  toggleFollow: (sellerId: string) => void;
  isFollowing: (sellerId: string) => boolean;

  // Messaging & Chat
  conversations: Conversation[];
  messages: ChatMessage[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  openChatForListing: (listing: Listing, initialNote?: string) => void;
  sendMessage: (conversationId: string, text: string, isOffer?: boolean, offerAmount?: number) => void;
  respondToOffer: (messageId: string, status: 'accepted' | 'declined') => void;

  // Reviews & Reports & Monetization & Admin
  reviews: Review[];
  addReview: (sellerId: string, rating: number, comment: string) => void;
  reports: Report[];
  submitReport: (targetType: 'listing' | 'user', targetId: string, targetTitle: string, reason: Report['reason'], details: string) => void;
  resolveReport: (reportId: string, action: 'resolved' | 'dismissed') => void;
  promotionPackages: PromotionPackage[];
  updatePromotionPackage: (id: string, updates: Partial<PromotionPackage>) => void;
  auditLogs: AdminAuditLog[];
  platformSettings: PlatformSettings;
  updatePlatformSettings: (updates: Partial<PlatformSettings>) => void;

  // Toast Alerts
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('adbay_theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('adbay_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('adbay_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  // Users & Role state
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('adbay_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>('buyer');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    return INITIAL_USERS.find((u) => u.role === 'buyer') || null;
  });

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'guest') {
      setCurrentUser(null);
      showToast('Switched to Guest mode (Unauthenticated browsing)', 'info');
      return;
    }
    const targetUser = users.find((u) => u.role === role) || users[0];
    setCurrentUser(targetUser);
    showToast(`Switched view to ${role.toUpperCase()}: ${targetUser.name}`, 'success');
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    addAuditLog('CHANGE_ROLE', 'USER', userId, `Changed role of user ${userId} to ${newRole}`);
    showToast(`User role updated to ${newRole}`, 'success');
  };

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'active' ? 'suspended' : 'active';
          addAuditLog('UPDATE_USER_STATUS', 'USER', userId, `Changed status to ${nextStatus}`);
          showToast(`User status is now ${nextStatus}`, 'info');
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const verifyBusinessAccount = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          addAuditLog('VERIFY_BUSINESS', 'USER', userId, `Granted verified business merchant status`);
          showToast(`Business account verified for ${u.name}`, 'success');
          return {
            ...u,
            isVerifiedBusiness: true,
            role: 'business',
            businessProfile: {
              storeName: `${u.name} Store`,
              registrationNumber: `BN-KE-${Math.floor(100000 + Math.random() * 900000)}`,
              verifiedAt: new Date().toISOString().split('T')[0],
              description: 'Verified official Kenyan retailer on adBay.',
              openingHours: 'Mon - Sat: 8:00 AM - 7:00 PM',
              whatsapp: u.phone,
            },
          };
        }
        return u;
      })
    );
  };

  // Auth & Account Management State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const registerUser = (userData: Partial<UserProfile> & { name: string; email: string; phone: string; role: UserRole; county: string; town: string }) => {
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      avatar: userData.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      role: userData.role || 'buyer',
      isVerifiedBusiness: userData.role === 'business',
      businessProfile: userData.role === 'business' ? {
        storeName: userData.businessProfile?.storeName || `${userData.name}'s Verified Store`,
        registrationNumber: `BN-KE-${Math.floor(100000 + Math.random() * 900000)}`,
        verifiedAt: new Date().toISOString().split('T')[0],
        description: userData.businessProfile?.description || 'Authentic products and reliable delivery across Kenya.',
        address: userData.businessProfile?.address || `${userData.town}, ${userData.county}`,
        openingHours: 'Mon - Sat: 8:30 AM - 6:30 PM',
        whatsapp: userData.phone,
      } : undefined,
      joinedDate: 'Oct 2026',
      county: userData.county || 'Nairobi',
      town: userData.town || 'Westlands',
      rating: 5.0,
      reviewsCount: 0,
      responseRate: '100%',
      responseTime: '< 15 mins',
      favorites: [],
      following: [],
      status: 'active',
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    setCurrentRole(newUser.role);
    addAuditLog('REGISTER_USER', 'USER', newUser.id, `Created new account for ${newUser.name} with role ${newUser.role}`);
    showToast(`Welcome to adBay, ${newUser.name}! Account created successfully.`, 'success');
    return newUser;
  };

  const loginUser = (emailOrPhone: string) => {
    const clean = emailOrPhone.trim().toLowerCase();
    const found = users.find(
      (u) => u.email.toLowerCase() === clean || u.phone.replace(/[^0-9]/g, '').includes(clean.replace(/[^0-9]/g, ''))
    );
    if (found) {
      if (found.status === 'suspended') {
        showToast('Your account is suspended. Contact support@adbay.co.ke', 'error');
        return false;
      }
      setCurrentUser(found);
      setCurrentRole(found.role);
      showToast(`Welcome back, ${found.name}! Logged in as ${found.role.toUpperCase()}.`, 'success');
      return true;
    } else {
      showToast('No existing account found with this email or phone.', 'error');
      return false;
    }
  };

  const [isFirebaseConnected, setIsFirebaseConnected] = useState(true);

  // Sync Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const existing = users.find((u) => u.email === user.email || u.id === user.uid);
        if (existing) {
          setCurrentUser(existing);
          setCurrentRole(existing.role);
        } else {
          const newUser: UserProfile = {
            id: user.uid,
            name: user.displayName || user.email?.split('@')[0] || 'adBay Trader',
            email: user.email || '',
            phone: user.phoneNumber || '+254 700 000000',
            avatar: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            role: 'seller',
            isVerifiedBusiness: false,
            county: 'Nairobi',
            town: 'Westlands',
            status: 'active',
            joinedDate: new Date().toISOString().split('T')[0],
            rating: 5.0,
            reviewsCount: 0,
            responseRate: '100%',
            responseTime: 'within minutes',
            favorites: [],
            following: [],
          };
          setUsers((prev) => [newUser, ...prev]);
          setCurrentUser(newUser);
          setCurrentRole('seller');
        }
      }
    });
    return () => unsubscribe();
  }, [users]);

  const loginWithGoogle = async () => {
    try {
      showToast('Connecting to Google...', 'info');
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      if (user) {
        showToast(`Welcome, ${user.displayName || 'adBay User'}!`, 'success');
      }
    } catch (err: any) {
      console.warn('Google sign-in:', err);
      showToast(err.message || 'Google sign-in closed or unavailable', 'error');
    }
  };

  const logoutUser = () => {
    signOut(auth).catch(() => {});
    setCurrentUser(null);
    setCurrentRole('guest');
    showToast('Signed out of adBay.', 'info');
  };

  const updateUserProfile = (userId: string, updates: Partial<UserProfile>) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, ...updates };
          if (currentUser?.id === userId) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return u;
      })
    );

    // Sync to Firestore
    try {
      setDoc(
        doc(db, 'users', userId),
        {
          id: userId,
          name: updates.name || currentUser?.name || '',
          email: updates.email || currentUser?.email || '',
          phone: updates.phone || currentUser?.phone || '',
          avatar: updates.avatar || currentUser?.avatar || '',
          role: updates.role || currentUser?.role || 'buyer',
          county: updates.county || currentUser?.county || 'Nairobi',
          town: updates.town || currentUser?.town || 'Westlands',
          status: updates.status || currentUser?.status || 'active',
          isVerifiedBusiness: updates.isVerifiedBusiness ?? currentUser?.isVerifiedBusiness ?? false,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      ).catch((err) => console.warn('Firestore profile sync note:', err));
    } catch (e) {
      console.warn('Profile sync:', e);
    }

    addAuditLog('UPDATE_PROFILE', 'USER', userId, `Updated profile details for user ${userId}`);
    showToast('Profile information updated successfully!', 'success');
  };

  // Navigation State
  const [activeView, setActiveView] = useState<AppView>('home');
  const [activeListingId, setActiveListingId] = useState<string | null>(null);
  const [activeSellerId, setActiveSellerId] = useState<string | null>(null);
  const [isPostAdOpen, setIsPostAdOpen] = useState(false);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [listingToPromote, setListingToPromote] = useState<Listing | null>(null);

  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [selectedCounty, setSelectedCounty] = useState('All Kenya');
  const [selectedTown, setSelectedTown] = useState('All Towns');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('adbay_recent_searches');
    return saved ? JSON.parse(saved) : ['iPhone 15 Pro Max', 'Toyota Prado', '2 Bedroom Ruaka', 'Samsung Smart TV'];
  });

  const addRecentSearch = (term: string) => {
    if (!term || !term.trim()) return;
    const clean = term.trim();
    setRecentSearches((prev) => {
      const next = [clean, ...prev.filter((t) => t.toLowerCase() !== clean.toLowerCase())].slice(0, 8);
      localStorage.setItem('adbay_recent_searches', JSON.stringify(next));
      return next;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('adbay_recent_searches');
    showToast('Recent searches cleared', 'info');
  };

  // Categories & Listings State
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('adbay_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [listings, setListings] = useState<Listing[]>(() => {
    const saved = localStorage.getItem('adbay_listings');
    return saved ? JSON.parse(saved) : INITIAL_LISTINGS;
  });

  const [isListingsLoading, setIsListingsLoading] = useState(true);

  // Perceived performance: realistic initial load simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsListingsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  // Settings State
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(() => {
    const saved = localStorage.getItem('adbay_settings');
    return saved ? JSON.parse(saved) : INITIAL_PLATFORM_SETTINGS;
  });

  const updatePlatformSettings = (updates: Partial<PlatformSettings>) => {
    setPlatformSettings((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem('adbay_settings', JSON.stringify(next));
      return next;
    });
    addAuditLog('UPDATE_SETTINGS', 'PLATFORM', 'global', JSON.stringify(updates));
    showToast('Platform settings updated successfully', 'success');
  };

  // Promotion Packages State
  const [promotionPackages, setPromotionPackages] = useState<PromotionPackage[]>(() => {
    const saved = localStorage.getItem('adbay_packages');
    return saved ? JSON.parse(saved) : INITIAL_PROMOTION_PACKAGES;
  });

  const updatePromotionPackage = (id: string, updates: Partial<PromotionPackage>) => {
    setPromotionPackages((prev) =>
      prev.map((pkg) => (pkg.id === id ? { ...pkg, ...updates } : pkg))
    );
    addAuditLog('UPDATE_PACKAGE', 'PROMOTION_PACKAGE', id, JSON.stringify(updates));
    showToast('Pricing package updated', 'success');
  };

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(() => {
    const saved = localStorage.getItem('adbay_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const addAuditLog = (action: string, targetType: string, targetId: string, details: string) => {
    const log: AdminAuditLog = {
      id: `log-${Date.now()}`,
      adminId: currentUser?.id || 'sys-admin',
      adminName: currentUser?.name || 'Administrator',
      action,
      targetType,
      targetId,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev].slice(0, 100));
  };

  // Persist core state
  useEffect(() => {
    localStorage.setItem('adbay_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('adbay_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('adbay_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('adbay_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Categories CRUD
  const addCategory = (name: string, description: string, iconName = 'Package') => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name,
      slug,
      iconName,
      color: '#00A859',
      description,
      count: 0,
      subcategories: [
        { id: `${slug}-general`, name: `All ${name}`, slug: `${slug}-general` },
      ],
    };
    setCategories((prev) => [...prev, newCat]);
    addAuditLog('CREATE_CATEGORY', 'CATEGORY', newCat.id, `Created category "${name}"`);
    showToast(`Category "${name}" added`, 'success');
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === id) {
          const updated = { ...cat, ...updates };
          if (updates.name && !updates.slug) {
            updated.slug = updates.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          }
          return updated;
        }
        return cat;
      })
    );
    addAuditLog('EDIT_CATEGORY', 'CATEGORY', id, `Updated category #${id} (${updates.name || 'attributes'})`);
    showToast('Category updated successfully', 'success');
  };

  const deleteCategory = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    addAuditLog('DELETE_CATEGORY', 'CATEGORY', id, `Deleted category "${cat?.name || id}"`);
    showToast(`Category "${cat?.name || 'item'}" deleted`, 'info');
  };

  const addSubcategory = (categoryId: string, subName: string) => {
    const subSlug = subName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            subcategories: [
              ...cat.subcategories,
              { id: `${cat.slug}-${subSlug}-${Date.now()}`, name: subName, slug: subSlug },
            ],
          };
        }
        return cat;
      })
    );
    addAuditLog('CREATE_SUBCATEGORY', 'CATEGORY', categoryId, `Added subcategory "${subName}" to category ${categoryId}`);
    showToast(`Subcategory "${subName}" added`, 'success');
  };

  const deleteSubcategory = (categoryId: string, subcategoryId: string) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            subcategories: cat.subcategories.filter((s) => s.id !== subcategoryId),
          };
        }
        return cat;
      })
    );
    addAuditLog('DELETE_SUBCATEGORY', 'CATEGORY', categoryId, `Removed subcategory ${subcategoryId} from category ${categoryId}`);
    showToast('Subcategory removed', 'info');
  };

  // Listings CRUD with Firestore synchronization
  const addListing = (
    listingData: Omit<Listing, 'id' | 'viewsCount' | 'favoritesCount' | 'createdAt'>
  ): string => {
    const id = `listing-${Date.now()}`;
    const newListing: Listing = {
      ...listingData,
      id,
      viewsCount: 1,
      favoritesCount: 0,
      createdAt: new Date().toISOString(),
      status: platformSettings.autoApproveAds ? 'active' : 'pending',
    };

    setListings((prev) => [newListing, ...prev]);

    // Update category count
    setCategories((prev) =>
      prev.map((c) => (c.id === listingData.categoryId ? { ...c, count: c.count + 1 } : c))
    );

    // Sync to Firestore
    try {
      setDoc(
        doc(db, 'listings', id),
        {
          id,
          title: newListing.title,
          description: newListing.description || '',
          price: Number(newListing.price) || 0,
          currency: 'KES',
          category: newListing.categoryId,
          subcategory: newListing.subcategoryId,
          county: newListing.county,
          town: newListing.town,
          condition: newListing.condition,
          images: newListing.images.slice(0, 15),
          sellerId: newListing.sellerId,
          sellerName: newListing.sellerName,
          sellerPhone: newListing.sellerPhone,
          status: newListing.status,
          featured: newListing.promotionTier === 'featured',
          viewsCount: 1,
          createdAt: newListing.createdAt,
          updatedAt: newListing.createdAt,
        }
      ).catch((err) => console.warn('Firestore listing sync note:', err));
    } catch (e) {
      console.warn('Listing sync:', e);
    }

    addAuditLog('POST_AD', 'LISTING', id, `Created listing: "${newListing.title}" (Status: ${newListing.status})`);

    if (newListing.status === 'active') {
      showToast('🎉 Your advertisement is live on adBay!', 'success');
    } else {
      showToast('Ad submitted for safety review by moderation team', 'info');
    }

    return id;
  };

  const updateListing = (id: string, updates: Partial<Listing>) => {
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );

    try {
      setDoc(
        doc(db, 'listings', id),
        {
          ...updates,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      ).catch((err) => console.warn('Firestore listing update note:', err));
    } catch (e) {
      console.warn('Listing update:', e);
    }

    addAuditLog('EDIT_LISTING', 'LISTING', id, `Updated fields on listing #${id}`);
    showToast('Listing updated successfully', 'success');
  };

  const markAsSold = (id: string) => {
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'sold' } : item))
    );
    try {
      setDoc(doc(db, 'listings', id), { status: 'sold' }, { merge: true }).catch(() => {});
    } catch (e) {}
    showToast('Listing marked as SOLD', 'info');
  };

  const togglePauseListing = (id: string) => {
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus: ListingStatus = item.status === 'active' ? 'paused' : 'active';
          try {
            setDoc(doc(db, 'listings', id), { status: nextStatus }, { merge: true }).catch(() => {});
          } catch (e) {}
          showToast(`Listing ${nextStatus === 'active' ? 'resumed' : 'paused'}`, 'info');
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const deleteListing = (id: string) => {
    setListings((prev) => prev.filter((item) => item.id !== id));
    try {
      deleteDoc(doc(db, 'listings', id)).catch(() => {});
    } catch (e) {}
    addAuditLog('DELETE_LISTING', 'LISTING', id, `Deleted listing #${id}`);
    showToast('Listing deleted', 'info');
  };

  const boostListing = (listingId: string, packageId: string) => {
    const pkg = promotionPackages.find((p) => p.id === packageId);
    if (!pkg) return;

    let tier: PromotionTier = 'featured';
    if (packageId === 'package-boost') tier = 'boosted';
    else if (packageId === 'package-business') tier = 'banner';

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + pkg.durationDays);

    setListings((prev) =>
      prev.map((item) =>
        item.id === listingId
          ? {
              ...item,
              promotionTier: tier,
              promotionExpiresAt: expiryDate.toISOString(),
            }
          : item
      )
    );

    addAuditLog('PROMOTION_PAYMENT', 'LISTING', listingId, `Promoted listing with package ${pkg.name} (KES ${pkg.priceKES})`);
    showToast(`🚀 Listing successfully boosted to ${pkg.name}!`, 'success');
  };

  const approveListing = (id: string) => {
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'active', rejectionReason: undefined } : item))
    );
    addAuditLog('APPROVE_LISTING', 'LISTING', id, `Admin approved listing #${id}`);
    showToast(`Listing #${id} approved and published`, 'success');
  };

  const rejectListing = (id: string, reason: string) => {
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'rejected', rejectionReason: reason } : item))
    );
    addAuditLog('REJECT_LISTING', 'LISTING', id, `Rejected listing #${id}. Reason: ${reason}`);
    showToast(`Listing #${id} rejected`, 'info');
  };

  // Favorites, Recently Viewed & Following
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('adbay_favorites');
    return saved ? JSON.parse(saved) : ['listing-1', 'listing-4'];
  });

  const toggleFavorite = (listingId: string) => {
    setFavorites((prev) => {
      let next: string[];
      if (prev.includes(listingId)) {
        next = prev.filter((id) => id !== listingId);
        showToast('Removed from saved items', 'info');
        setListings((l) =>
          l.map((item) => (item.id === listingId ? { ...item, favoritesCount: Math.max(0, item.favoritesCount - 1) } : item))
        );
      } else {
        next = [...prev, listingId];
        showToast('Added to saved items ❤️', 'success');
        setListings((l) =>
          l.map((item) => (item.id === listingId ? { ...item, favoritesCount: item.favoritesCount + 1 } : item))
        );
      }
      localStorage.setItem('adbay_favorites', JSON.stringify(next));
      return next;
    });
  };

  const isFavorite = (listingId: string) => favorites.includes(listingId);

  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('adbay_recent_viewed');
    return saved ? JSON.parse(saved) : ['listing-1', 'listing-2', 'listing-3'];
  });

  const addToRecentlyViewed = (listingId: string) => {
    setRecentlyViewedIds((prev) => {
      const next = [listingId, ...prev.filter((id) => id !== listingId)].slice(0, 10);
      localStorage.setItem('adbay_recent_viewed', JSON.stringify(next));
      return next;
    });
    // Increment view count on listing
    setListings((prev) =>
      prev.map((item) => (item.id === listingId ? { ...item, viewsCount: item.viewsCount + 1 } : item))
    );
  };

  const [following, setFollowing] = useState<string[]>(() => {
    const saved = localStorage.getItem('adbay_following');
    return saved ? JSON.parse(saved) : ['user-business-1'];
  });

  const toggleFollow = (sellerId: string) => {
    setFollowing((prev) => {
      let next: string[];
      if (prev.includes(sellerId)) {
        next = prev.filter((id) => id !== sellerId);
        showToast('Unfollowed seller', 'info');
      } else {
        next = [...prev, sellerId];
        showToast('Following seller! You will get updates on their new ads.', 'success');
      }
      localStorage.setItem('adbay_following', JSON.stringify(next));
      return next;
    });
  };

  const isFollowing = (sellerId: string) => following.includes(sellerId);

  // Messaging & Conversations
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('adbay_conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('adbay_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const openChatForListing = (listing: Listing, initialNote?: string) => {
    if (!currentUser) {
      showToast('Please sign in or select a buyer/seller role to message', 'info');
      return;
    }

    if (currentUser.id === listing.sellerId) {
      showToast('This is your own listing!', 'info');
      return;
    }

    // Check if conversation already exists between current user and this seller for this listing
    let conv = conversations.find(
      (c) => c.listingId === listing.id && (c.buyerId === currentUser.id || c.sellerId === currentUser.id)
    );

    if (!conv) {
      conv = {
        id: `conv-${Date.now()}`,
        listingId: listing.id,
        listingTitle: listing.title,
        listingPrice: listing.price,
        listingImage: listing.images[0] || '',
        buyerId: currentUser.id,
        buyerName: currentUser.name,
        sellerId: listing.sellerId,
        sellerName: listing.sellerName,
        lastMessage: initialNote || 'Hello, is this item available?',
        lastMessageAt: new Date().toISOString(),
        unreadCount: 0,
      };

      setConversations((prev) => [conv!, ...prev]);

      // Add initial greeting message
      const initialMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        conversationId: conv.id,
        senderId: currentUser.id,
        senderName: currentUser.name,
        text: initialNote || 'Hello, I am interested in this item. Is it still available?',
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, initialMsg]);
    }

    setActiveConversationId(conv.id);
    setActiveView('messages');
  };

  const sendMessage = (conversationId: string, text: string, isOffer = false, offerAmount?: number) => {
    if (!text && !offerAmount) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: currentUser?.id || 'guest-user',
      senderName: currentUser?.name || 'Buyer',
      text,
      createdAt: new Date().toISOString(),
      isOffer,
      offerAmount,
      offerStatus: isOffer ? 'pending' : undefined,
    };

    setMessages((prev) => [...prev, newMsg]);

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessage: isOffer ? `Offer sent: KES ${offerAmount?.toLocaleString()}` : text,
              lastMessageAt: new Date().toISOString(),
            }
          : c
      )
    );
  };

  const respondToOffer = (messageId: string, status: 'accepted' | 'declined') => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, offerStatus: status } : m))
    );
    showToast(`Offer ${status === 'accepted' ? 'ACCEPTED' : 'DECLINED'}`, status === 'accepted' ? 'success' : 'info');
  };

  // Reviews & Reports
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('adbay_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const addReview = (sellerId: string, rating: number, comment: string) => {
    if (!currentUser) return;
    const rev: Review = {
      id: `rev-${Date.now()}`,
      sellerId,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerAvatar: currentUser.avatar,
      rating,
      comment,
      createdAt: new Date().toISOString(),
      verifiedPurchase: true,
    };
    setReviews((prev) => [rev, ...prev]);

    // Update seller rating
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === sellerId) {
          const sellerRevs = [...reviews.filter((r) => r.sellerId === sellerId), rev];
          const avg = Number((sellerRevs.reduce((acc, r) => acc + r.rating, 0) / sellerRevs.length).toFixed(1));
          return { ...u, rating: avg, reviewsCount: sellerRevs.length };
        }
        return u;
      })
    );
    showToast('Review submitted! Thank you for rating the seller.', 'success');
  };

  const [reports, setReports] = useState<Report[]>(() => {
    const saved = localStorage.getItem('adbay_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const submitReport = (
    targetType: 'listing' | 'user',
    targetId: string,
    targetTitle: string,
    reason: Report['reason'],
    details: string
  ) => {
    const rep: Report = {
      id: `rep-${Date.now()}`,
      targetType,
      targetId,
      targetTitle,
      reporterId: currentUser?.id || 'guest',
      reporterName: currentUser?.name || 'Anonymous User',
      reason,
      details,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setReports((prev) => [rep, ...prev]);
    showToast('Report submitted to Trust & Safety team. Thank you.', 'info');
  };

  const resolveReport = (reportId: string, action: 'resolved' | 'dismissed') => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: action } : r))
    );
    addAuditLog('RESOLVE_REPORT', 'REPORT', reportId, `Marked report #${reportId} as ${action}`);
    showToast(`Report marked as ${action}`, 'info');
  };

  // Toast Notification System
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  // Handle Android Hardware / Browser Back button
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (isPostAdOpen) {
        setIsPostAdOpen(false);
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
      if (activeListingId) {
        setActiveListingId(null);
        return;
      }
      if (activeSellerId) {
        setActiveSellerId(null);
        return;
      }
      if (activeView !== 'home') {
        setActiveView('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isPostAdOpen, isLocationPickerOpen, isPromoteModalOpen, activeListingId, activeSellerId, activeView]);

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        activeListingId,
        setActiveListingId,
        activeSellerId,
        setActiveSellerId,
        isPostAdOpen,
        setIsPostAdOpen,
        isLocationPickerOpen,
        setIsLocationPickerOpen,
        isPromoteModalOpen,
        setIsPromoteModalOpen,
        listingToPromote,
        setListingToPromote,

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
        recentSearches,
        addRecentSearch,
        clearRecentSearches,

        currentUser,
        currentRole,
        switchRole,
        users,
        updateUserRole,
        toggleUserStatus,
        verifyBusinessAccount,
        isAuthModalOpen,
        setIsAuthModalOpen,
        registerUser,
        loginUser,
        loginWithGoogle,
        logoutUser,
        updateUserProfile,
        isFirebaseConnected,

        isDarkMode,
        toggleTheme,

        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        addSubcategory,
        deleteSubcategory,
        listings,
        isListingsLoading,
        setIsListingsLoading,
        addListing,
        updateListing,
        markAsSold,
        togglePauseListing,
        deleteListing,
        boostListing,
        approveListing,
        rejectListing,

        favorites,
        toggleFavorite,
        isFavorite,
        recentlyViewedIds,
        addToRecentlyViewed,
        following,
        toggleFollow,
        isFollowing,

        conversations,
        messages,
        activeConversationId,
        setActiveConversationId,
        openChatForListing,
        sendMessage,
        respondToOffer,

        reviews,
        addReview,
        reports,
        submitReport,
        resolveReport,
        promotionPackages,
        updatePromotionPackage,
        auditLogs,
        platformSettings,
        updatePlatformSettings,

        toasts,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
