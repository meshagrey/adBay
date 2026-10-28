import React from 'react';
import { FileText, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TermsModal: React.FC = () => {
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
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-extrabold text-[18px] text-gray-900 dark:text-white">
            adBay Terms & Conditions of Service
          </h1>
          <p className="text-[12px] text-gray-500">
            Applicable to all users in Kenya and international visitors
          </p>
        </div>
      </div>

      <div className="border border-gray-200 dark:border-gray-800 rounded p-4 bg-white dark:bg-[#131c31] space-y-3 leading-relaxed text-gray-700 dark:text-gray-300">
        <h3 className="font-bold text-[14px] text-gray-900 dark:text-white">1. Nature of the Service</h3>
        <p>
          adBay operates as an online electronic classifieds marketplace that allows registered users and commercial merchants in Kenya to publish advertisements, discover products, and communicate directly with interested counterparties.
        </p>

        <h3 className="font-bold text-[14px] text-gray-900 dark:text-white">2. No Guarantee of Products or Seller Legitimacy</h3>
        <p>
          An advertisement published on adBay constitutes an invitation to treat and does NOT guarantee product availability, authenticity, title, or the financial integrity of any counterparty. Buyers and sellers transact at their own risk and are strictly required to observe adBay Safety Guidelines (including in-person physical inspection and payment upon delivery).
        </p>

        <h3 className="font-bold text-[14px] text-gray-900 dark:text-white">3. User Obligations and Accurate Representations</h3>
        <p>
          Sellers warrant that all information, photographs, and condition attributes provided in their listings are truthful, accurate, and not misleading under the Kenya Consumer Protection Act, 2012. You may not advertise stolen property, counterfeit goods, or goods subject to third-party encumbrances.
        </p>

        <h3 className="font-bold text-[14px] text-gray-900 dark:text-white">4. Moderation & Termination Rights</h3>
        <p>
          adBay administrators reserve the unhindered right to edit, suspend, decline, or remove any advertisement or suspend any user account suspected of fraud, harassment, violation of the Prohibited Items Policy, or conduct detrimental to the community.
        </p>

        <h3 className="font-bold text-[14px] text-gray-900 dark:text-white">5. Governing Law</h3>
        <p>
          These Terms of Service are governed by and construed in accordance with the Laws of Kenya, including the Kenya Information and Communications Act (KICA) and the Computer Misuse and Cybercrimes Act, 2018.
        </p>
      </div>
    </div>
  );
};
