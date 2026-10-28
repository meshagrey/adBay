import React, { useState } from 'react';
import {
  Smartphone,
  Car,
  Home,
  Tv,
  Laptop,
  Sofa,
  Shirt,
  Wheat,
  Briefcase,
  Wrench,
  UserCheck,
  Baby,
  Dumbbell,
  BookOpen,
  Sparkles,
  Package,
  Grid,
  ChevronRight,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Category } from '../../types';

// Map icon names to Lucide icons
export const getCategoryIcon = (iconName: string, className = 'w-4 h-4') => {
  switch (iconName) {
    case 'Smartphone':
      return <Smartphone className={className} />;
    case 'Car':
      return <Car className={className} />;
    case 'Home':
      return <Home className={className} />;
    case 'Tv':
      return <Tv className={className} />;
    case 'Laptop':
      return <Laptop className={className} />;
    case 'Sofa':
      return <Sofa className={className} />;
    case 'Shirt':
      return <Shirt className={className} />;
    case 'Wheat':
      return <Wheat className={className} />;
    case 'Briefcase':
      return <Briefcase className={className} />;
    case 'Wrench':
      return <Wrench className={className} />;
    case 'UserCheck':
      return <UserCheck className={className} />;
    case 'Baby':
      return <Baby className={className} />;
    case 'Dumbbell':
      return <Dumbbell className={className} />;
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    default:
      return <Package className={className} />;
  }
};

export const CategoryBar: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory, setSelectedSubcategory, setActiveView } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    setSelectedSubcategory('all');
    setActiveView('search');
    setIsModalOpen(false);
  };

  const handleSubcategoryClick = (catId: string, subId: string) => {
    setSelectedCategory(catId);
    setSelectedSubcategory(subId);
    setActiveView('search');
    setIsModalOpen(false);
  };

  return (
    <div className="hidden md:block sticky top-[48px] z-30 bg-white/95 dark:bg-[#131c31]/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-2xs">
      <div className="max-w-[1250px] mx-auto px-3 sm:px-4">
        {/* Horizontal Category Strip */}
        <div className="flex items-center gap-[5px] py-1.5 overflow-x-auto no-scrollbar text-[13px]">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-[5px] bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-[#00A859] hover:text-white font-medium shrink-0 transition"
          >
            <Grid className="w-3.5 h-3.5 text-[#00A859]" />
            <span>All Categories</span>
          </button>

          <button
            onClick={() => handleCategoryClick('all')}
            className={`px-2.5 py-1 rounded shrink-0 font-medium transition ${
              selectedCategory === 'all'
                ? 'bg-[#00A859] text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            All Items
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded shrink-0 font-medium transition ${
                  isSelected
                    ? 'bg-[#00A859] text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span className={isSelected ? 'text-white' : 'text-gray-500 dark:text-gray-400'}>
                  {getCategoryIcon(cat.iconName, 'w-3.5 h-3.5')}
                </span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Full Categories & Subcategories Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-5">
          <div className="w-full max-w-4xl max-h-[85vh] bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Grid className="w-4 h-4 text-[#00A859]" />
                <h3 className="font-bold text-[15px] text-gray-900 dark:text-white">Explore All adBay Categories</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="border border-gray-200 dark:border-gray-800 rounded p-2.5 hover:border-[#00A859] transition bg-gray-50/50 dark:bg-gray-800/30"
                >
                  <button
                    onClick={() => handleCategoryClick(cat.id)}
                    className="w-full flex items-center justify-between text-left font-semibold text-[13px] text-gray-900 dark:text-white pb-1.5 border-b border-gray-200 dark:border-gray-800 group"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="p-1 rounded bg-[#00A859]/10 text-[#00A859]">
                        {getCategoryIcon(cat.iconName, 'w-4 h-4')}
                      </span>
                      <span className="group-hover:text-[#00A859] transition">{cat.name}</span>
                    </span>
                    <span className="text-[11px] font-normal text-gray-500">
                      {cat.count.toLocaleString()} ads
                    </span>
                  </button>

                  <ul className="mt-2 space-y-1 text-[12px] text-gray-600 dark:text-gray-400">
                    {cat.subcategories.map((sub) => (
                      <li key={sub.id}>
                        <button
                          onClick={() => handleSubcategoryClick(cat.id, sub.id)}
                          className="w-full text-left py-0.5 px-1 rounded hover:bg-[#00A859]/10 hover:text-[#00A859] flex items-center justify-between transition"
                        >
                          <span>{sub.name}</span>
                          <ChevronRight className="w-3 h-3 text-gray-400 opacity-60" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/60 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-[12px] font-medium hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
