import React from 'react';
import { Ban, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProhibitedItemsModal: React.FC = () => {
  const { setActiveView } = useApp();

  const prohibitedGroups = [
    {
      category: 'Weapons, Firearms & Explosives',
      items: [
        'Firearms, ammunition, magazines, silencers, and military hardware.',
        'Imitation firearms, air guns, and stun guns.',
        'Fireworks, pyrotechnics, dynamite, and explosive chemicals.',
        'Swords, machetes advertised as combat weapons, and ballistic knives.',
      ],
    },
    {
      category: 'Controlled Substances & Healthcare',
      items: [
        'Narcotics, cannabis, khat/miraa, psychotropic substances, and drug paraphernalia.',
        'Prescription medicines, injectables, steroids, and regulated veterinary pharmaceuticals.',
        'Human organs, blood, tissues, or biological remains.',
      ],
    },
    {
      category: 'Wildlife, Ivory & Environmental Protection (Kenya Wildlife Service)',
      items: [
        'Elephant ivory, rhino horns, pangolin scales, and lion claws.',
        'Skins, furs, skulls, or teeth of protected game animals.',
        'Endangered indigenous trees, sandalwood, and illegally logged timber.',
        'Live wild animals without legitimate KWS wildlife farming permits.',
      ],
    },
    {
      category: 'Counterfeits, Forgeries & Stolen Goods',
      items: [
        'Fake currency notes, forged coins, and counterfeit M-Pesa receipts.',
        'Fake university degree certificates, KCSE/KCPE certificates, and forged national IDs/passports.',
        'Stolen smartphones, blacklisted IMEI devices, and stolen motor vehicles.',
        'Counterfeit branded luxury goods, cloned gadgets, and fake software licenses.',
      ],
    },
    {
      category: 'Telecommunications & Digital Abuse',
      items: [
        'Unregistered SIM cards or pre-activated SIM lines.',
        'Hacking tools, spyware, card skimmers, and illegal signal boosters.',
        'Databases of private Kenyan citizen telephone numbers, emails, or PII.',
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-3 py-4 space-y-4 text-[13px]">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveView('home')}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="w-8 h-8 rounded bg-red-600 text-white flex items-center justify-center">
          <Ban className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-extrabold text-[18px] text-gray-900 dark:text-white">
            adBay Prohibited Items & Banned Listings Policy
          </h1>
          <p className="text-[12px] text-gray-500">
            Enforced under Kenya Penal Code, Wildlife Act, and adBay Terms of Service
          </p>
        </div>
      </div>

      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-[12px] text-red-800 dark:text-red-300">
        <span className="font-bold block mb-0.5">⚠️ Zero Tolerance Enforcement:</span>
        Listing any of the prohibited items below will result in instant ad removal, permanent account suspension, and referral to the Directorate of Criminal Investigations (DCI) where applicable.
      </div>

      <div className="space-y-3">
        {prohibitedGroups.map((group, idx) => (
          <div key={idx} className="border border-gray-200 dark:border-gray-800 rounded p-3 bg-white dark:bg-[#131c31]">
            <h3 className="font-bold text-[14px] text-gray-900 dark:text-white mb-1.5 pb-1 border-b border-gray-100 dark:border-gray-800 flex items-center gap-1.5 text-red-600">
              <ShieldAlert className="w-4 h-4" /> {group.category}
            </h3>
            <ul className="space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside">
              {group.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
