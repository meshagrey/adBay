import React from 'react';
import { ShieldCheck, ArrowLeft, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PrivacyModal: React.FC = () => {
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
          <Lock className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-extrabold text-[18px] text-gray-900 dark:text-white">
            adBay Kenya Privacy Policy
          </h1>
          <p className="text-[12px] text-gray-500">
            Compliance with the Kenya Data Protection Act, 2019 & Office of the Data Protection Commissioner (ODPC)
          </p>
        </div>
      </div>

      <div className="border border-gray-200 dark:border-gray-800 rounded p-4 bg-white dark:bg-[#131c31] space-y-3 leading-relaxed text-gray-700 dark:text-gray-300">
        <h3 className="font-bold text-[14px] text-gray-900 dark:text-white">1. Principles of Data Processing</h3>
        <p>
          adBay processes personal data lawfully, fairly, and transparently in strict compliance with Section 25 of the Kenya Data Protection Act, 2019. We collect only data strictly necessary to facilitate online classified advertising.
        </p>

        <h3 className="font-bold text-[14px] text-gray-900 dark:text-white">2. Telephone Numbers & Location Privacy Safeguards</h3>
        <p>
          We do not publish your private home address or exact coordinates. County and town selections are displayed for geographic relevance only. Furthermore, seller telephone numbers are masked by default behind an intentional click-to-reveal control to prevent automated telemarketing scrapers and unconsented robo-calls.
        </p>

        <h3 className="font-bold text-[14px] text-gray-900 dark:text-white">3. Data Subject Rights in Kenya</h3>
        <p>
          Under the Kenyan Data Protection Act, 2019, you retain the right to:
        </p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>Be informed of the use to which your personal data is put;</li>
          <li>Access your personal data held by adBay;</li>
          <li>Object to the processing of all or part of your personal data;</li>
          <li>Correction of false or misleading data; and</li>
          <li>Deletion of false or misleading data relating to you (Right to be Forgotten).</li>
        </ul>

        <h3 className="font-bold text-[14px] text-gray-900 dark:text-white">4. Data Protection Officer & ODPC Contact</h3>
        <p>
          For data inquiries, rectification requests, or deletion requests, contact our designated Data Protection Officer at: <strong>privacy@adbay.co.ke</strong>.
        </p>
      </div>
    </div>
  );
};
