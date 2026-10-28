import React, { useState } from 'react';
import { X, MapPin, Search, Check, Globe } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KENYA_COUNTIES, KenyaCounty } from '../../data/kenyaLocations';

export const LocationPickerModal: React.FC = () => {
  const {
    isLocationPickerOpen,
    setIsLocationPickerOpen,
    selectedCounty,
    setSelectedCounty,
    selectedTown,
    setSelectedTown,
    showToast,
  } = useApp();

  const [searchCountyQuery, setSearchCountyQuery] = useState('');
  const [activeCountyTab, setActiveCountyTab] = useState<KenyaCounty | null>(() => {
    return KENYA_COUNTIES.find((c) => c.name === selectedCounty) || null;
  });

  if (!isLocationPickerOpen) return null;

  const filteredCounties = KENYA_COUNTIES.filter((c) =>
    c.name.toLowerCase().includes(searchCountyQuery.toLowerCase())
  );

  const handleSelectAllKenya = () => {
    setSelectedCounty('All Kenya');
    setSelectedTown('All Towns');
    setIsLocationPickerOpen(false);
    showToast('Showing listings across all of Kenya', 'info');
  };

  const handleSelectEntireCounty = (county: KenyaCounty) => {
    setSelectedCounty(county.name);
    setSelectedTown('All Towns');
    setIsLocationPickerOpen(false);
    showToast(`Location set to: ${county.name} (All Towns)`, 'success');
  };

  const handleSelectTown = (countyName: string, townName: string) => {
    setSelectedCounty(countyName);
    setSelectedTown(townName);
    setIsLocationPickerOpen(false);
    showToast(`Location set to: ${countyName}, ${townName}`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-3 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/40">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#00A859]" />
            <h3 className="font-bold text-[14px] text-gray-900 dark:text-white">
              Select Location in Kenya
            </h3>
          </div>
          <button
            onClick={() => setIsLocationPickerOpen(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search bar inside modal */}
        <div className="p-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search Kenya county (e.g. Nairobi, Mombasa, Nakuru, Kisumu)..."
              value={searchCountyQuery}
              onChange={(e) => setSearchCountyQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px] text-gray-900 dark:text-white focus:outline-none focus:border-[#00A859]"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
          </div>

          <button
            onClick={handleSelectAllKenya}
            className="px-3 py-1.5 rounded bg-gray-100 dark:bg-gray-800 hover:bg-[#00A859] hover:text-white text-gray-800 dark:text-gray-200 text-[12px] font-semibold shrink-0 transition flex items-center gap-1"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>All Kenya</span>
          </button>
        </div>

        {/* Counties & Towns 2-Column Split */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 sm:grid-cols-12 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-gray-800">
          {/* Left Column: Counties List */}
          <div className="sm:col-span-5 overflow-y-auto max-h-[50vh] p-1.5 space-y-0.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1 block">
              Counties (47)
            </span>
            {filteredCounties.map((c) => {
              const isSelected = selectedCounty === c.name;
              const isActiveTab = activeCountyTab?.name === c.name;
              return (
                <button
                  key={c.code}
                  onClick={() => setActiveCountyTab(c)}
                  className={`w-full text-left px-2 py-1.5 rounded text-[12px] flex items-center justify-between transition ${
                    isActiveTab
                      ? 'bg-[#00A859]/10 text-[#00A859] font-bold'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="truncate">
                    {c.name}{' '}
                    <span className="text-[10px] text-gray-400 font-normal">({c.towns.length})</span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#00A859]" />}
                </button>
              );
            })}
          </div>

          {/* Right Column: Towns in Selected County */}
          <div className="sm:col-span-7 overflow-y-auto max-h-[50vh] p-2 space-y-1">
            {activeCountyTab ? (
              <div>
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-gray-100 dark:border-gray-800">
                  <div>
                    <h4 className="font-bold text-[13px] text-gray-900 dark:text-white">
                      {activeCountyTab.name} County
                    </h4>
                    <p className="text-[11px] text-gray-400">Choose a town or select entire county</p>
                  </div>
                  <button
                    onClick={() => handleSelectEntireCounty(activeCountyTab)}
                    className="px-2 py-1 rounded bg-[#00A859] hover:bg-[#00924c] text-white font-medium text-[11px]"
                  >
                    All {activeCountyTab.name}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-1 text-[12px]">
                  {activeCountyTab.towns.map((townName) => {
                    const isSelected = selectedCounty === activeCountyTab.name && selectedTown === townName;
                    return (
                      <button
                        key={townName}
                        onClick={() => handleSelectTown(activeCountyTab.name, townName)}
                        className={`text-left px-2 py-1.5 rounded border transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#00A859]/15 border-[#00A859] text-[#00A859] font-bold'
                            : 'border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/60 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <span className="truncate">{townName}</span>
                        {isSelected && <Check className="w-3 h-3 text-[#00A859]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400 text-[12px]">
                Select a county on the left to see its major towns
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-gray-50 dark:bg-gray-800/60 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[12px]">
          <span className="text-gray-500">
            Current: <strong>{selectedCounty}</strong> {selectedTown !== 'All Towns' ? `(${selectedTown})` : ''}
          </span>
          <button
            onClick={() => setIsLocationPickerOpen(false)}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-[12px] font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
