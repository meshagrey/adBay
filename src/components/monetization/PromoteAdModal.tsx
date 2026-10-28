import React, { useState } from 'react';
import {
  X,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  CheckCircle,
  Smartphone,
  Check,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PromoteAdModal: React.FC = () => {
  const {
    isPromoteModalOpen,
    setIsPromoteModalOpen,
    listingToPromote,
    promotionPackages,
    boostListing,
    currentUser,
    showToast,
  } = useApp();

  const [selectedPackageId, setSelectedPackageId] = useState<string>('package-featured');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phone || '0722123456');
  const [mpesaPin, setMpesaPin] = useState('');
  const [step, setStep] = useState<'select' | 'mpesa-prompt' | 'success'>('select');
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptCode, setReceiptCode] = useState('');

  if (!isPromoteModalOpen || !listingToPromote) return null;

  const selectedPkg = promotionPackages.find((p) => p.id === selectedPackageId) || promotionPackages[1];

  const handleInitiateSTK = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 9) {
      showToast('Please enter a valid Kenyan Safaricom phone number', 'error');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('mpesa-prompt');
    }, 1200);
  };

  const handleConfirmPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (mpesaPin.length < 4) {
      showToast('Please enter your 4-digit PIN', 'error');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const code = `QJK${Math.floor(100000 + Math.random() * 900000)}KE`;
      setReceiptCode(code);
      boostListing(listingToPromote.id, selectedPackageId);
      setStep('success');
    }, 1500);
  };

  const handleDone = () => {
    setIsPromoteModalOpen(false);
    setStep('select');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-3 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/40">
          <div className="flex items-center gap-1.5 font-bold text-[14px] text-gray-900 dark:text-white">
            <Sparkles className="w-4 h-4 text-[#F59E0B]" />
            <span>Promote Advertisement on adBay</span>
          </div>
          <button
            onClick={() => setIsPromoteModalOpen(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1 text-[13px]">
          {/* Target listing pill */}
          <div className="p-2 rounded bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 flex items-center gap-2">
            <img
              src={listingToPromote.images[0]}
              alt={listingToPromote.title}
              className="w-10 h-10 rounded object-cover shrink-0"
            />
            <div className="min-w-0">
              <span className="font-semibold text-gray-900 dark:text-white truncate block">
                {listingToPromote.title}
              </span>
              <span className="text-[#00A859] font-bold text-[12px]">
                KES {listingToPromote.price.toLocaleString()}
              </span>
            </div>
          </div>

          {step === 'select' && (
            <div className="space-y-3">
              <span className="font-semibold text-gray-800 dark:text-gray-200 block">
                Choose Promotion Tier:
              </span>

              {/* Package cards */}
              <div className="space-y-2">
                {promotionPackages.slice(1).map((pkg) => {
                  const isSelected = selectedPackageId === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={`p-3 rounded border cursor-pointer transition ${
                        isSelected
                          ? 'border-[#00A859] bg-[#00A859]/5 ring-1 ring-[#00A859]'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                              isSelected ? 'bg-[#00A859] border-[#00A859] text-white' : 'border-gray-400'
                            }`}
                          >
                            {isSelected && '✓'}
                          </span>
                          <span className="font-bold text-[14px] text-gray-900 dark:text-white">
                            {pkg.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 font-bold">
                            {pkg.multiplier}
                          </span>
                        </div>

                        <span className="font-extrabold text-[15px] text-[#00A859]">
                          KES {pkg.priceKES.toLocaleString()}
                        </span>
                      </div>

                      <p className="text-[12px] text-gray-500 mt-1 pl-5.5">{pkg.description}</p>

                      <div className="mt-2 pl-5.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-600 dark:text-gray-400">
                        {pkg.features.map((f, i) => (
                          <span key={i} className="flex items-center gap-1">
                            <Check className="w-3 h-3 text-[#00A859]" /> {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* M-Pesa Phone Form */}
              <form onSubmit={handleInitiateSTK} className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2">
                <label className="font-semibold text-gray-800 dark:text-gray-200 block text-[12px]">
                  Pay via Lipa Na M-Pesa (Online STK Push):
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-2 text-gray-400 font-semibold text-[12px]">🇰🇪</span>
                    <input
                      type="tel"
                      required
                      placeholder="07XX XXX XXX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-8 pr-2 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px] text-gray-900 dark:text-white focus:outline-none focus:border-[#00A859]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="px-4 py-1.5 rounded bg-[#00A859] hover:bg-[#00924c] disabled:opacity-50 text-white font-bold text-[12px] transition flex items-center gap-1 shrink-0"
                  >
                    <span>{isProcessing ? 'Sending Prompt...' : 'Pay with M-Pesa'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[10px] text-gray-400 block">
                  Simulated prompt: Enter any Kenyan mobile number and test the live push workflow.
                </span>
              </form>
            </div>
          )}

          {/* Step 2: Realistic M-Pesa STK Prompt Simulation */}
          {step === 'mpesa-prompt' && (
            <div className="space-y-3 py-2 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#00A859] flex items-center justify-center mx-auto animate-pulse">
                <Smartphone className="w-7 h-7" />
              </div>

              <div className="border border-emerald-500/40 rounded-lg p-3 bg-emerald-500/5 max-w-xs mx-auto text-left shadow-sm">
                <div className="flex items-center gap-1.5 font-bold text-[#00A859] text-[13px] pb-1 border-b border-emerald-500/20">
                  <span>🟢 SIM Toolkit: Lipa Na M-Pesa</span>
                </div>
                <div className="mt-2 text-[12px] space-y-1 text-gray-700 dark:text-gray-300">
                  <p>Pay <strong>adBay Kenya Ltd</strong>?</p>
                  <p>Amount: <strong>KES {selectedPkg.priceKES.toLocaleString()}</strong></p>
                  <p>Account: <strong>{listingToPromote.id.slice(0, 8)}</strong></p>
                </div>

                <form onSubmit={handleConfirmPin} className="mt-3 space-y-2">
                  <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block">
                    Enter M-Pesa PIN:
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    autoFocus
                    placeholder="••••"
                    value={mpesaPin}
                    onChange={(e) => setMpesaPin(e.target.value)}
                    className="w-full text-center tracking-widest px-2 py-1.5 rounded border border-gray-300 bg-white dark:bg-gray-800 text-[15px] font-bold"
                  />
                  <button
                    type="submit"
                    disabled={isProcessing || mpesaPin.length < 4}
                    className="w-full bg-[#00A859] hover:bg-[#00924c] disabled:opacity-40 text-white font-bold py-1.5 rounded text-[12px]"
                  >
                    {isProcessing ? 'Verifying with Safaricom...' : 'Authorize Payment'}
                  </button>
                </form>
              </div>

              <p className="text-[11px] text-gray-400">
                A prompt was dispatched to <strong>{phoneNumber}</strong>
              </p>
            </div>
          )}

          {/* Step 3: Success Screen */}
          {step === 'success' && (
            <div className="py-4 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#00A859] text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle className="w-7 h-7" />
              </div>

              <div>
                <h3 className="font-bold text-[16px] text-gray-900 dark:text-white">
                  Payment Confirmed!
                </h3>
                <p className="text-[12px] text-gray-500">
                  Receipt Code: <strong className="text-[#00A859]">{receiptCode}</strong>
                </p>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded text-left text-[12px] space-y-1 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-800">
                <p>• Listing: <strong>{listingToPromote.title}</strong></p>
                <p>• Tier: <strong>{selectedPkg.name} ({selectedPkg.multiplier})</strong></p>
                <p>• Duration: <strong>{selectedPkg.durationDays} Days</strong></p>
                <p>• Status: <strong className="text-[#00A859]">Live & Promoted on Homepage</strong></p>
              </div>

              <button
                onClick={handleDone}
                className="w-full bg-[#00A859] hover:bg-[#00924c] text-white font-bold py-2 rounded text-[13px]"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
