import React from 'react';
import { ShieldCheck, Smartphone, MapPin, Mail, Phone, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DesktopFooter: React.FC = () => {
  const { setActiveView, setSelectedCategory, platformSettings, currentRole } = useApp();

  return (
    <footer className="hidden md:block bg-white dark:bg-[#0f172a] border-t border-gray-200 dark:border-gray-800 text-[13px] text-gray-600 dark:text-gray-400 mt-6">
      <div className="max-w-[1250px] mx-auto px-4 py-8">
        <div className="grid grid-cols-4 gap-6">
          {/* Col 1: Brand & About */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded bg-[#00A859] flex items-center justify-center text-white font-extrabold text-[14px]">
                ad<span className="text-[#F59E0B]">B</span>
              </div>
              <span className="font-extrabold text-[16px] text-gray-900 dark:text-white">
                ad<span className="text-[#F59E0B]">Bay</span>
              </span>
            </div>

            <p className="text-[12px] text-gray-500 leading-snug">
              adBay is Kenya's modern, lightweight online classifieds marketplace. Buy and sell phones, cars, electronics, property, furniture, and agriculture across all 47 counties.
            </p>

            <div className="pt-1 text-[11px] text-gray-400">
              <p>📍 Kimathi Chambers, Kimathi Street, Nairobi CBD, Kenya</p>
              <p>📞 {platformSettings.contactSupportPhone}</p>
              <p>✉️ {platformSettings.contactSupportEmail}</p>
            </div>
          </div>

          {/* Col 2: Marketplace Categories */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-[13px] text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">
              Top Categories
            </h4>
            <ul className="space-y-1 text-[12px]">
              {[
                { name: 'Phones & Tablets', id: 'phones-tablets' },
                { name: 'Vehicles & Motorcycles', id: 'vehicles' },
                { name: 'Property & Rentals', id: 'property' },
                { name: 'Electronics & Appliances', id: 'electronics' },
                { name: 'Computers & Laptops', id: 'computers' },
                { name: 'Agriculture & Livestock', id: 'agriculture' },
              ].map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => {
                      setSelectedCategory(c.id);
                      setActiveView('search');
                    }}
                    className="hover:text-[#00A859] transition text-left"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Trust, Safety & Legal */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-[13px] text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">
              Trust & Safety
            </h4>
            <ul className="space-y-1 text-[12px]">
              <li>
                <button
                  onClick={() => setActiveView('safety')}
                  className="hover:text-[#00A859] transition text-left font-medium text-emerald-600 dark:text-emerald-400"
                >
                  🛡️ Buyer & Seller Safety Tips
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('prohibited')}
                  className="hover:text-[#00A859] transition text-left text-red-500 font-medium"
                >
                  🚫 Prohibited Items Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('terms')}
                  className="hover:text-[#00A859] transition text-left"
                >
                  Terms and Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('privacy')}
                  className="hover:text-[#00A859] transition text-left"
                >
                  Privacy Policy (Kenya Data Protection Act 2019)
                </button>
              </li>
              {currentRole === 'admin' && (
                <li>
                  <button
                    onClick={() => setActiveView('admin')}
                    className="hover:text-[#00A859] transition text-left text-purple-600 dark:text-purple-400 font-medium"
                  >
                    Admin & Moderation Portal
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 4: Mobile & Android Application */}
          <div className="space-y-2">
            <h4 className="font-bold text-[13px] text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">
              adBay for Android
            </h4>
            <p className="text-[12px] text-gray-500 leading-snug">
              Install adBay on your Android smartphone for instant access, push alerts, and low data usage.
            </p>

            <button
              onClick={() => setActiveView('android-guide')}
              className="w-full bg-gray-100 dark:bg-gray-800 hover:bg-[#00A859] hover:text-white p-2 rounded text-[12px] font-semibold flex items-center justify-center gap-1.5 transition border border-gray-200 dark:border-gray-700"
            >
              <Smartphone className="w-4 h-4 text-[#00A859]" />
              <span>Android App & TWA Guide</span>
            </button>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-400">
          <p>
            © 2026 adBay. All rights reserved. Buy and Sell Online.
          </p>
        </div>
      </div>
    </footer>
  );
};
