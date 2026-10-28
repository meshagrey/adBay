import React, { useState } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Eye,
  Plus,
  Trash2,
  Sparkles,
  MapPin,
  Tag,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KENYA_COUNTIES } from '../../data/kenyaLocations';
import { ListingCondition } from '../../types';
import { optimizeImage } from '../../utils/imageOptimizer';

export const PostAdModal: React.FC = () => {
  const {
    isPostAdOpen,
    setIsPostAdOpen,
    categories,
    addListing,
    currentUser,
    currentRole,
    platformSettings,
    showToast,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Category & Details, 2: Photos, 3: Location & Contact, 4: Preview

  // Form State
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'phones-tablets');
  const [subcategoryId, setSubcategoryId] = useState(categories[0]?.subcategories[0]?.id || 'smartphones');
  const [condition, setCondition] = useState<ListingCondition>('used');
  const [price, setPrice] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [description, setDescription] = useState('');
  const [deliveryOption, setDeliveryOption] = useState('In-person pickup or courier delivery countrywide.');

  // Photos
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80',
  ]);

  // Location
  const [county, setCounty] = useState(currentUser?.county || 'Nairobi');
  const [town, setTown] = useState(currentUser?.town || 'Westlands');
  const [approximateArea, setApproximateArea] = useState('');

  // Contact preferences
  const [prefChat, setPrefChat] = useState(true);
  const [prefWhatsApp, setPrefWhatsApp] = useState(true);
  const [prefPhone, setPrefPhone] = useState(true);

  // Category attributes
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [colorAttr, setColorAttr] = useState('');

  if (!isPostAdOpen) return null;

  const currentCategory = categories.find((c) => c.id === categoryId);
  const selectedCountyData = KENYA_COUNTIES.find((c) => c.name === county) || KENYA_COUNTIES[0];

  // Sample photo additions for testing
  const sampleImagesList = [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
  ];

  const handleAddSampleImage = (url: string) => {
    if (images.length >= platformSettings.maxImagesPerAd) {
      showToast(`Maximum ${platformSettings.maxImagesPerAd} photos allowed per listing`, 'error');
      return;
    }
    setImages((prev) => [...prev, url]);
  };

  const handleRemoveImage = (index: number) => {
    if (images.length <= 1) {
      showToast('At least 1 photo is required', 'error');
      return;
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Client-side Canvas image optimization utility (resizes & compresses for fast mobile upload)
  const [isCompressingImages, setIsCompressingImages] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > platformSettings.maxImagesPerAd) {
      showToast(`Maximum ${platformSettings.maxImagesPerAd} photos allowed per listing`, 'error');
      return;
    }

    setIsCompressingImages(true);
    showToast('Optimizing and compressing photos via Canvas...', 'info');

    try {
      const optimizedUrls: string[] = [];
      let totalBytesSaved = 0;

      for (const file of Array.from(files)) {
        const result = await optimizeImage(file, {
          maxWidth: 1200,
          maxHeight: 1200,
          quality: 0.82,
          mimeType: 'image/jpeg',
        });
        optimizedUrls.push(result.dataUrl);
        if (result.originalSize > result.compressedSize) {
          totalBytesSaved += result.originalSize - result.compressedSize;
        }
      }

      setImages((prev) => [...prev, ...optimizedUrls]);
      const savedKb = Math.round(totalBytesSaved / 1024);
      if (savedKb > 0) {
        showToast(`✅ ${optimizedUrls.length} photo(s) compressed (~${savedKb} KB saved for mobile loading)`, 'success');
      } else {
        showToast(`✅ ${optimizedUrls.length} photo(s) optimized ready for adBay!`, 'success');
      }
    } catch (err) {
      console.error('Image compression error:', err);
      showToast('Error compressing image, please try another photo', 'error');
    } finally {
      setIsCompressingImages(false);
      // Reset input value so same files can be re-selected if desired
      e.target.value = '';
    }
  };

  const handlePublish = () => {
    // Basic validation
    if (!title.trim() || title.length < 5) {
      showToast('Please enter a descriptive title (at least 5 characters)', 'error');
      setStep(1);
      return;
    }
    const numPrice = Number(price.replace(/[^0-9]/g, ''));
    if (!numPrice || numPrice <= 0) {
      showToast('Please enter a valid price in Kenyan Shillings (KES)', 'error');
      setStep(1);
      return;
    }
    if (!description.trim() || description.length < 15) {
      showToast('Please provide a detailed description (at least 15 characters)', 'error');
      setStep(1);
      return;
    }
    if (images.length === 0) {
      showToast('Please add at least 1 photo of the product', 'error');
      setStep(2);
      return;
    }

    // Build attributes object
    const attributes: Record<string, any> = {};
    if (brand) attributes['Brand'] = brand;
    if (model) attributes['Model'] = model;
    if (colorAttr) attributes['Color'] = colorAttr;

    // Check prohibited words for Kenya safety
    const prohibitedWords = ['gun', 'firearm', 'weed', 'cannabis', 'rhino horn', 'ivory', 'fake passport'];
    const titleLower = title.toLowerCase();
    const hasProhibited = prohibitedWords.some((w) => titleLower.includes(w));
    if (hasProhibited) {
      showToast('Advertisement contains prohibited items under Kenya law and cannot be published', 'error');
      return;
    }

    addListing({
      title,
      description,
      categoryId,
      subcategoryId,
      price: numPrice,
      isNegotiable,
      condition,
      images,
      county,
      town,
      approximateArea,
      sellerId: currentUser?.id || 'guest-seller',
      sellerName: currentUser?.name || 'adBay Member',
      sellerType: currentUser?.role === 'business' ? 'business' : 'individual',
      sellerAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      sellerRating: currentUser?.rating || 5.0,
      sellerPhone: currentUser?.phone || '+254 700 000 000',
      isVerifiedSeller: currentUser?.isVerifiedBusiness || false,
      contactPreferences: {
        inAppChat: prefChat,
        whatsapp: prefWhatsApp,
        phone: prefPhone,
      },
      deliveryOption,
      status: platformSettings.autoApproveAds ? 'active' : 'pending',
      promotionTier: 'standard',
      attributes,
    });

    setIsPostAdOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-2 sm:p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/40">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#F59E0B] text-gray-950 font-extrabold text-[12px] flex items-center justify-center">
              +
            </div>
            <h3 className="font-bold text-[15px] text-gray-900 dark:text-white">
              Post an Advertisement on adBay
            </h3>
          </div>
          <button
            onClick={() => setIsPostAdOpen(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-4 py-2 bg-gray-100/50 dark:bg-gray-800/30 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] font-semibold text-gray-500">
          <button
            onClick={() => setStep(1)}
            className={`flex items-center gap-1 ${step === 1 ? 'text-[#00A859] font-bold' : ''}`}
          >
            <span className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px]">1</span>
            <span>Details</span>
          </button>
          <span className="text-gray-300">→</span>
          <button
            onClick={() => setStep(2)}
            className={`flex items-center gap-1 ${step === 2 ? 'text-[#00A859] font-bold' : ''}`}
          >
            <span className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px]">2</span>
            <span>Photos ({images.length})</span>
          </button>
          <span className="text-gray-300">→</span>
          <button
            onClick={() => setStep(3)}
            className={`flex items-center gap-1 ${step === 3 ? 'text-[#00A859] font-bold' : ''}`}
          >
            <span className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px]">3</span>
            <span>Location & Contact</span>
          </button>
          <span className="text-gray-300">→</span>
          <button
            onClick={() => setStep(4)}
            className={`flex items-center gap-1 ${step === 4 ? 'text-[#00A859] font-bold' : ''}`}
          >
            <span className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px]">4</span>
            <span>Preview & Publish</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-[13px]">
          {/* STEP 1: Details */}
          {step === 1 && (
            <div className="space-y-3">
              <div>
                <label className="font-semibold text-gray-800 dark:text-gray-200 block mb-1">
                  Listing Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apple iPhone 15 Pro Max 256GB - Clean, Original Box"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px] text-gray-900 dark:text-white focus:outline-none focus:border-[#00A859]"
                />
                <span className="text-[11px] text-gray-400 mt-0.5 block">
                  Keep titles clear and descriptive. Mention brand, model, and key highlights.
                </span>
              </div>

              {/* Category & Subcategory Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-gray-800 dark:text-gray-200 block mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => {
                      const newCatId = e.target.value;
                      setCategoryId(newCatId);
                      const cat = categories.find((c) => c.id === newCatId);
                      if (cat && cat.subcategories.length > 0) {
                        setSubcategoryId(cat.subcategories[0].id);
                      }
                    }}
                    className="w-full px-2.5 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px] text-gray-900 dark:text-white focus:outline-none focus:border-[#00A859]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-gray-800 dark:text-gray-200 block mb-1">
                    Subcategory
                  </label>
                  <select
                    value={subcategoryId}
                    onChange={(e) => setSubcategoryId(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px] text-gray-900 dark:text-white focus:outline-none focus:border-[#00A859]"
                  >
                    {currentCategory?.subcategories.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price and Condition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-gray-800 dark:text-gray-200 block mb-1">
                    Price in Kenyan Shillings (KES) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1.5 text-gray-400 font-bold text-[12px]">KES</span>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 50000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full pl-12 pr-2.5 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px] text-gray-900 dark:text-white focus:outline-none focus:border-[#00A859]"
                    />
                  </div>
                  <label className="flex items-center gap-1.5 mt-1 cursor-pointer text-[12px] text-gray-600 dark:text-gray-400">
                    <input
                      type="checkbox"
                      checked={isNegotiable}
                      onChange={(e) => setIsNegotiable(e.target.checked)}
                      className="accent-[#00A859]"
                    />
                    <span>Price is Negotiable</span>
                  </label>
                </div>

                <div>
                  <label className="font-semibold text-gray-800 dark:text-gray-200 block mb-1">
                    Product Condition <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {(['new', 'used', 'refurbished'] as ListingCondition[]).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCondition(c)}
                        className={`py-1.5 px-2 rounded text-[12px] font-medium capitalize border transition ${
                          condition === c
                            ? 'bg-[#00A859] text-white border-[#00A859]'
                            : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Detailed Description */}
              <div>
                <label className="font-semibold text-gray-800 dark:text-gray-200 block mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your item in detail: features, specs, defects if any, reason for selling, accessories included..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px] text-gray-900 dark:text-white focus:outline-none focus:border-[#00A859]"
                />
              </div>

              {/* Quick attributes */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-gray-600 dark:text-gray-400 block mb-0.5">Brand</label>
                  <input
                    type="text"
                    placeholder="e.g. Apple, Toyota, Samsung"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[12px]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-gray-600 dark:text-gray-400 block mb-0.5">Model</label>
                  <input
                    type="text"
                    placeholder="e.g. 15 Pro, TX-L, 55CU7000"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[12px]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-gray-600 dark:text-gray-400 block mb-0.5">Color</label>
                  <input
                    type="text"
                    placeholder="e.g. Titanium, White, Black"
                    value={colorAttr}
                    onChange={(e) => setColorAttr(e.target.value)}
                    className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[12px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Photos */}
          {step === 2 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                    Product Photographs ({images.length}/{platformSettings.maxImagesPerAd})
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    The first photograph will be used as the main cover image in search results.
                  </p>
                </div>
                <label className="cursor-pointer bg-[#00A859] hover:bg-[#00924c] text-white px-2.5 py-1 rounded font-medium text-[12px] flex items-center gap-1 shadow-xs transition">
                  <Upload className={`w-3.5 h-3.5 ${isCompressingImages ? 'animate-bounce' : ''}`} />
                  <span>{isCompressingImages ? 'Optimizing...' : 'Upload & Compress'}</span>
                  <input type="file" multiple accept="image/*" disabled={isCompressingImages} onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              {/* Image Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded border border-gray-200 dark:border-gray-700 overflow-hidden group bg-gray-100 dark:bg-gray-800">
                    <img src={img} alt={`Upload ${i}`} className="w-full h-full object-cover" />
                    {i === 0 && (
                      <span className="absolute top-1 left-1 bg-[#00A859] text-white text-[9px] font-bold px-1 rounded">
                        Cover
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100 transition"
                      title="Remove image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Sample Images Picker for Instant Testing */}
              <div className="p-2.5 rounded bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800">
                <span className="text-[12px] font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  💡 Quick Add Demo Photos:
                </span>
                <div className="flex gap-2 overflow-x-auto py-1">
                  {sampleImagesList.map((sampleUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddSampleImage(sampleUrl)}
                      className="relative w-14 h-14 rounded overflow-hidden shrink-0 border border-gray-300 dark:border-gray-700 hover:border-[#00A859] transition"
                      title="Click to add photo"
                    >
                      <img src={sampleUrl} alt="sample" className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] text-center">
                        + Add
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Location & Contact */}
          {step === 3 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                Location in Kenya
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-gray-700 dark:text-gray-300 block mb-1">County</label>
                  <select
                    value={county}
                    onChange={(e) => {
                      const newCounty = e.target.value;
                      setCounty(newCounty);
                      const cData = KENYA_COUNTIES.find((c) => c.name === newCounty);
                      if (cData && cData.towns.length > 0) {
                        setTown(cData.towns[0]);
                      }
                    }}
                    className="w-full px-2.5 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px] text-gray-900 dark:text-white"
                  >
                    {KENYA_COUNTIES.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-medium text-gray-700 dark:text-gray-300 block mb-1">Town / Center</label>
                  <select
                    value={town}
                    onChange={(e) => setTown(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px] text-gray-900 dark:text-white"
                  >
                    {selectedCountyData.towns.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  Approximate Neighborhood / Landmark (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near Sarit Centre, Opp. Total Petrol Station"
                  value={approximateArea}
                  onChange={(e) => setApproximateArea(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px] text-gray-900 dark:text-white"
                />
                <span className="text-[11px] text-gray-400 mt-0.5 block">
                  Never publish your private residential house or apartment number.
                </span>
              </div>

              <div>
                <label className="font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  Delivery & Collection Terms
                </label>
                <input
                  type="text"
                  placeholder="e.g. In-person pickup in Westlands or courier across Kenya at buyer's cost"
                  value={deliveryOption}
                  onChange={(e) => setDeliveryOption(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px] text-gray-900 dark:text-white"
                />
              </div>

              {/* Contact Preferences */}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                <span className="font-semibold text-gray-800 dark:text-gray-200 block mb-1.5">
                  How should buyers contact you?
                </span>
                <div className="space-y-1.5 text-[12px]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prefChat}
                      onChange={(e) => setPrefChat(e.target.checked)}
                      className="accent-[#00A859]"
                    />
                    <span>adBay In-Platform Chat (Recommended for privacy)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prefWhatsApp}
                      onChange={(e) => setPrefWhatsApp(e.target.checked)}
                      className="accent-[#00A859]"
                    />
                    <span>WhatsApp message to seller phone ({currentUser?.phone || '+254...'})</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prefPhone}
                      onChange={(e) => setPrefPhone(e.target.checked)}
                      className="accent-[#00A859]"
                    />
                    <span>Direct phone call (shown via click-to-reveal)</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Live Preview */}
          {step === 4 && (
            <div className="space-y-3">
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded flex items-center gap-2 text-[12px] text-emerald-800 dark:text-emerald-300">
                <Eye className="w-4 h-4 shrink-0 text-[#00A859]" />
                <span>Here is how your advertisement will appear to shoppers across Kenya:</span>
              </div>

              {/* Preview Card */}
              <div className="border border-gray-200 dark:border-gray-800 rounded p-3 bg-white dark:bg-[#131c31] space-y-2">
                <div className="flex gap-3">
                  <div className="w-32 h-24 rounded overflow-hidden bg-black shrink-0">
                    <img src={images[0]} alt="cover" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-extrabold text-[18px] text-[#00A859]">
                      KES {Number(price || 0).toLocaleString()}
                    </span>
                    {isNegotiable && (
                      <span className="ml-2 text-[10px] text-amber-600 bg-amber-500/10 px-1 rounded">
                        Negotiable
                      </span>
                    )}
                    <h3 className="font-bold text-[14px] text-gray-900 dark:text-white line-clamp-1 mt-0.5">
                      {title || 'Untitled Listing'}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-1">
                      <span className="flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-[#00A859]" /> {county}, {town}
                      </span>
                      <span>•</span>
                      <span className="capitalize">{condition}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 dark:border-gray-800 text-[12px] text-gray-600 dark:text-gray-300">
                  <p className="line-clamp-2">{description}</p>
                </div>

                <div className="pt-1 text-[11px] text-gray-400">
                  Seller: <strong>{currentUser?.name || 'adBay Member'}</strong> ({currentUser?.role === 'business' ? 'Business Seller' : 'Individual Seller'})
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800/60 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => (prev - 1) as any)}
              className="px-3 py-1.5 rounded border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium text-[12px] hover:bg-gray-100"
            >
              Back
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsPostAdOpen(false)}
              className="px-3 py-1.5 rounded border border-gray-300 text-gray-700 dark:text-gray-300 font-medium text-[12px]"
            >
              Cancel
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => (prev + 1) as any)}
              className="px-4 py-1.5 rounded bg-[#00A859] hover:bg-[#00924c] text-white font-bold text-[12px] transition"
            >
              Next Step →
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePublish}
              className="px-5 py-1.5 rounded bg-[#F59E0B] hover:bg-[#d97706] text-gray-950 font-extrabold text-[13px] shadow-sm transition"
            >
              Publish Advertisement
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
