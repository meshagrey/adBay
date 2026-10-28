import React from 'react';

interface ListingCardSkeletonProps {
  layout?: 'grid' | 'list';
  count?: number;
}

export const ListingCardSkeletonItem: React.FC<{ layout?: 'grid' | 'list' }> = ({ layout = 'grid' }) => {
  if (layout === 'list') {
    return (
      <div className="adbay-card flex items-start gap-2 p-1.5 animate-pulse rounded-[7px] border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-[#131c31] overflow-hidden">
        {/* 3:4 portrait thumbnail placeholder */}
        <div className="w-24 sm:w-28 aspect-[3/4] max-h-[160px] shrink-0 rounded-[7px] bg-gray-200 dark:bg-gray-800/90 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
        </div>

        {/* Content details placeholder */}
        <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5 space-y-2">
          <div>
            {/* Price & Heart placeholder */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded-[4px]" />
              <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-800 shrink-0" />
            </div>

            {/* Title lines placeholder */}
            <div className="space-y-1.5">
              <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-800 rounded-[3px]" />
              <div className="h-3 w-3/5 bg-gray-200 dark:bg-gray-800 rounded-[3px]" />
            </div>

            {/* Description placeholder */}
            <div className="h-2.5 w-4/5 bg-gray-100 dark:bg-gray-800/60 rounded-[3px] mt-2" />
          </div>

          {/* Footer location & time */}
          <div className="pt-1.5 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between">
            <div className="h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded-[3px]" />
            <div className="h-3 w-14 bg-gray-200 dark:bg-gray-800 rounded-[3px]" />
          </div>
        </div>
      </div>
    );
  }

  // Grid layout skeleton matching exact 3:4 portrait card dimensions
  return (
    <div className="adbay-card flex flex-col h-full justify-between animate-pulse rounded-[7px] border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-[#131c31] overflow-hidden">
      {/* Product Image placeholder (3:4 portrait aspect ratio, target ~150-170px mobile, ~190-220px desktop) */}
      <div className="relative aspect-[3/4] w-full min-h-[145px] max-h-[175px] md:min-h-[190px] md:max-h-[220px] bg-gray-200 dark:bg-gray-800/90 rounded-t-[7px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />

        {/* Placeholder badge chip in top-left */}
        <div className="absolute top-1 left-1 w-12 h-3.5 bg-gray-300 dark:bg-gray-700/70 rounded-[3px]" />

        {/* Placeholder heart circle in top-right */}
        <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-gray-300/80 dark:bg-gray-700/70" />

        {/* Placeholder condition badge in bottom-left */}
        <div className="absolute bottom-1 left-1 w-9 h-3 bg-gray-300/90 dark:bg-gray-700/80 rounded-[3px]" />
      </div>

      {/* Card Content placeholder */}
      <div className="p-1.5 flex-1 flex flex-col justify-between space-y-2">
        <div>
          {/* Price placeholder */}
          <div className="flex items-baseline justify-between gap-1 mb-1">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded-[4px]" />
            <div className="h-2.5 w-10 bg-gray-100 dark:bg-gray-800/60 rounded-[3px]" />
          </div>

          {/* Title lines placeholder */}
          <div className="space-y-1">
            <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded-[3px]" />
            <div className="h-3 w-4/5 bg-gray-200 dark:bg-gray-800 rounded-[3px]" />
          </div>
        </div>

        {/* Footer location & time */}
        <div className="mt-1.5 pt-1 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between">
          <div className="h-2.5 w-20 bg-gray-200 dark:bg-gray-800 rounded-[3px]" />
          <div className="h-2.5 w-10 bg-gray-200 dark:bg-gray-800 rounded-[3px]" />
        </div>
      </div>
    </div>
  );
};

export const ListingCardSkeleton: React.FC<ListingCardSkeletonProps> = ({
  layout = 'grid',
  count = 1,
}) => {
  if (count <= 1) {
    return <ListingCardSkeletonItem layout={layout} />;
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <ListingCardSkeletonItem key={`listing-skeleton-${index}`} layout={layout} />
      ))}
    </>
  );
};
