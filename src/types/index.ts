export type UserRole = 'guest' | 'buyer' | 'seller' | 'business' | 'admin';

export interface BusinessProfile {
  storeName: string;
  registrationNumber?: string;
  verifiedAt?: string;
  bannerImage?: string;
  description?: string;
  address?: string;
  openingHours?: string;
  website?: string;
  whatsapp?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: UserRole;
  isVerifiedBusiness: boolean;
  businessProfile?: BusinessProfile;
  joinedDate: string;
  county: string;
  town: string;
  rating: number;
  reviewsCount: number;
  responseRate: string;
  responseTime: string;
  favorites: string[];
  following: string[];
  status: 'active' | 'suspended';
}

export interface CategorySubcategory {
  id: string;
  name: string;
  slug: string;
  popularFields?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  color: string;
  description: string;
  count: number;
  subcategories: CategorySubcategory[];
}

export type ListingCondition = 'new' | 'used' | 'refurbished';
export type ListingStatus = 'active' | 'pending' | 'sold' | 'paused' | 'rejected' | 'expired';
export type PromotionTier = 'standard' | 'featured' | 'boosted' | 'banner';

export interface Listing {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  subcategoryId: string;
  price: number;
  isNegotiable: boolean;
  condition: ListingCondition;
  images: string[];
  county: string;
  town: string;
  approximateArea?: string;
  sellerId: string;
  sellerName: string;
  sellerType: 'individual' | 'business';
  sellerAvatar: string;
  sellerRating: number;
  sellerPhone: string;
  isVerifiedSeller: boolean;
  contactPreferences: {
    inAppChat: boolean;
    whatsapp: boolean;
    phone: boolean;
  };
  deliveryOption: string;
  status: ListingStatus;
  rejectionReason?: string;
  promotionTier: PromotionTier;
  promotionExpiresAt?: string;
  viewsCount: number;
  favoritesCount: number;
  createdAt: string;
  attributes: Record<string, string | number | boolean>;
}

export interface Review {
  id: string;
  sellerId: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
  verifiedPurchase: boolean;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
  isOffer?: boolean;
  offerAmount?: number;
  offerStatus?: 'pending' | 'accepted' | 'declined';
}

export interface Conversation {
  id: string;
  listingId: string;
  listingTitle: string;
  listingPrice: number;
  listingImage: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface Report {
  id: string;
  targetType: 'listing' | 'user';
  targetId: string;
  targetTitle: string;
  reporterId: string;
  reporterName: string;
  reason: 'scam' | 'prohibited' | 'counterfeit' | 'inappropriate' | 'spam' | 'other';
  details: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface PromotionPackage {
  id: string;
  name: string;
  priceKES: number;
  durationDays: number;
  badge: string;
  description: string;
  multiplier: string;
  features: string[];
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
  timestamp: string;
}

export interface PlatformSettings {
  autoApproveAds: boolean;
  maxImagesPerAd: number;
  contactSupportPhone: string;
  contactSupportEmail: string;
  emergencyBannerText: string;
  showEmergencyBanner: boolean;
}
