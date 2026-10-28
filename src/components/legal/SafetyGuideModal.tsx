import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, MapPin, Smartphone, CreditCard, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SafetyGuideModal: React.FC = () => {
  const { setActiveView } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-3 py-4 space-y-4 text-[13px]">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveView('home')}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="w-8 h-8 rounded bg-[#00A859] text-white flex items-center justify-center">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-extrabold text-[18px] text-gray-900 dark:text-white">
            adBay Trust, Buyer & Seller Safety Guide
          </h1>
          <p className="text-[12px] text-gray-500">
            Smart trading rules for buyers and sellers across Kenya
          </p>
        </div>
      </div>

      {/* Main warning card */}
      <div className="border border-red-300 dark:border-red-900/60 bg-red-500/5 rounded p-4 space-y-2">
        <h3 className="font-bold text-[14px] text-red-600 dark:text-red-400 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4" /> Golden Rule #1: NEVER Send Money in Advance!
        </h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Fraudsters frequently request upfront "commitment fees", "delivery deposits", or "fare" via M-Pesa before delivering goods. On adBay, <strong>legitimate sellers will always agree to meet in a public location</strong> or arrange payment upon inspection.
        </p>
      </div>

      {/* Buyer safety grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="border border-gray-200 dark:border-gray-800 rounded p-3.5 bg-white dark:bg-[#131c31] space-y-2">
          <h4 className="font-bold text-[14px] text-gray-900 dark:text-white flex items-center gap-1.5 text-[#00A859]">
            <MapPin className="w-4 h-4" /> Safe Meeting Places in Kenya
          </h4>
          <ul className="space-y-1.5 text-gray-600 dark:text-gray-300 list-disc list-inside">
            <li>Meet during daylight hours in busy, well-lit public venues.</li>
            <li>Recommended: Shopping malls (e.g. Sarit Centre, Two Rivers, The Hub, Westgate, Nyali City Mall).</li>
            <li>Banks, petrol station forecourts, or near police posts with active CCTV.</li>
            <li>Avoid secluded alleys, unfamiliar residential estates, or late-night rendezvous.</li>
            <li>Bring a companion along if you are viewing expensive items or vehicles.</li>
          </ul>
        </div>

        <div className="border border-gray-200 dark:border-gray-800 rounded p-3.5 bg-white dark:bg-[#131c31] space-y-2">
          <h4 className="font-bold text-[14px] text-gray-900 dark:text-white flex items-center gap-1.5 text-[#00A859]">
            <Smartphone className="w-4 h-4" /> Inspecting Tech & Electronics
          </h4>
          <ul className="space-y-1.5 text-gray-600 dark:text-gray-300 list-disc list-inside">
            <li><strong>iPhones:</strong> Verify that iCloud is signed out and "Find My" is off before leaving. Check battery health.</li>
            <li><strong>Smartphones:</strong> Dial *#06# to verify the IMEI matches the box and body. Insert your SIM to test network calls.</li>
            <li><strong>Laptops:</strong> Plug into power to verify battery charging, test all keyboard keys, Wi-Fi, and screen brightness.</li>
            <li><strong>TVs & Appliances:</strong> Ensure the unit powers on and functions correctly.</li>
          </ul>
        </div>

        <div className="border border-gray-200 dark:border-gray-800 rounded p-3.5 bg-white dark:bg-[#131c31] space-y-2">
          <h4 className="font-bold text-[14px] text-gray-900 dark:text-white flex items-center gap-1.5 text-[#00A859]">
            <CreditCard className="w-4 h-4" /> Vehicles & Land Verification
          </h4>
          <ul className="space-y-1.5 text-gray-600 dark:text-gray-300 list-disc list-inside">
            <li><strong>Vehicles:</strong> Conduct an official search on the NTSA TIMS portal to verify the logbook and genuine registered owner.</li>
            <li>Inspect the engine and chassis numbers against the logbook.</li>
            <li><strong>Property & Land:</strong> Conduct a title deed search at the Ministry of Lands registry. Never pay cash for plots without an advocate.</li>
          </ul>
        </div>

        <div className="border border-gray-200 dark:border-gray-800 rounded p-3.5 bg-white dark:bg-[#131c31] space-y-2">
          <h4 className="font-bold text-[14px] text-gray-900 dark:text-white flex items-center gap-1.5 text-[#00A859]">
            <CheckCircle className="w-4 h-4" /> Seller Safety Guidelines
          </h4>
          <ul className="space-y-1.5 text-gray-600 dark:text-gray-300 list-disc list-inside">
            <li>Verify M-Pesa payments yourself on your own phone before handing over the goods. Do not rely on SMS shown on the buyer's screen.</li>
            <li>Beware of fake M-Pesa SMS confirmation scams.</li>
            <li>Never ship goods on credit or against unverified cheques.</li>
            <li>Report suspicious buyers using the adBay report button.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
