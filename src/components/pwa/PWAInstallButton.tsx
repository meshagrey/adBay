import React, { useState } from 'react';
import { Download, Smartphone, X, Check } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showAndroidGuide, setShowAndroidGuide] = useState(false);

  // If already running inside an installed PWA, render nothing or small badge
  if (isInstalled) {
    return null;
  }

  // Chromium / Android prompt available
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`inline-flex items-center gap-1.5 font-semibold text-white bg-[#00A859] hover:bg-[#00924c] rounded transition shadow-sm ${
          compact ? 'px-2 py-1 text-[12px]' : 'px-2.5 py-1.5 text-[13px]'
        }`}
        title="Install adBay app on your device"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`inline-flex items-center gap-1.5 font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition ${
            compact ? 'px-2 py-1 text-[12px]' : 'px-2.5 py-1.5 text-[13px]'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5 text-[#00A859]" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-sm rounded bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 p-4 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-[#00A859] text-white flex items-center justify-center font-bold text-xs">
                    ad
                  </div>
                  <h3 className="font-semibold text-[14px] text-gray-900 dark:text-white">Install adBay on iPhone</h3>
                </div>
                <button onClick={() => setShowIOSGuide(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3 space-y-2 text-[13px] text-gray-600 dark:text-gray-300">
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#00A859]/10 text-[#00A859] flex items-center justify-center font-bold text-xs">1</span>
                  <p>Open this website in <strong>Safari</strong> on your iPhone or iPad.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#00A859]/10 text-[#00A859] flex items-center justify-center font-bold text-xs">2</span>
                  <p>Tap the <strong>Share</strong> button (box with an upward arrow) at the bottom.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#00A859]/10 text-[#00A859] flex items-center justify-center font-bold text-xs">3</span>
                  <p>Scroll down and select <strong>"Add to Home Screen"</strong>.</p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded bg-[#00A859] py-1.5 text-[13px] font-semibold text-white hover:bg-[#00924c]"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback Android / Desktop manual install guide trigger
  return (
    <>
      <button
        onClick={() => setShowAndroidGuide(true)}
        className={`inline-flex items-center gap-1.5 font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition ${
          compact ? 'px-2 py-1 text-[12px]' : 'px-2.5 py-1.5 text-[13px]'
        }`}
        title="How to install adBay as an app"
      >
        <Smartphone className="w-3.5 h-3.5 text-[#00A859]" />
        <span>Get App</span>
      </button>

      {showAndroidGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 p-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-[#00A859] text-white flex items-center justify-center font-bold text-xs">
                  ad
                </div>
                <h3 className="font-semibold text-[14px] text-gray-900 dark:text-white">Install adBay on Android</h3>
              </div>
              <button onClick={() => setShowAndroidGuide(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 space-y-2 text-[13px] text-gray-600 dark:text-gray-300">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#00A859] shrink-0 mt-0.5" />
                <p>On Chrome/Firefox Android, tap the <strong>three dots menu (⋮)</strong> in your browser.</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#00A859] shrink-0 mt-0.5" />
                <p>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#00A859] shrink-0 mt-0.5" />
                <p>adBay will install as a native Android app with full offline cache and fast loading!</p>
              </div>
            </div>

            <button
              onClick={() => setShowAndroidGuide(false)}
              className="mt-4 w-full rounded bg-[#00A859] py-1.5 text-[13px] font-semibold text-white hover:bg-[#00924c]"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};
