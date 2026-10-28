import React from 'react';
import { Smartphone, Download, CheckCircle, Code, ShieldCheck, ArrowLeft, Terminal, Copy } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PWAInstallButton } from '../pwa/PWAInstallButton';

export const AndroidAppGuideModal: React.FC = () => {
  const { setActiveView, showToast } = useApp();

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Command copied to clipboard!', 'success');
  };

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
          <Smartphone className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-extrabold text-[18px] text-gray-900 dark:text-white">
            adBay Android Application & Deployment Guide
          </h1>
          <p className="text-[12px] text-gray-500">
            Progressive Web App (PWA) & Trusted Web Activity (TWA) for Google Play Store
          </p>
        </div>
      </div>

      {/* Quick In-App Install Callout */}
      <div className="border border-[#00A859] rounded p-4 bg-emerald-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-[14px] text-gray-900 dark:text-white">
            Direct Instant Android Install
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-[12px]">
            adBay is fully PWA certified with web manifest, offline caching, and native standalone window mode.
          </p>
        </div>
        <PWAInstallButton />
      </div>

      {/* TWA Packaging Guide for Google Play Store */}
      <div className="border border-gray-200 dark:border-gray-800 rounded p-4 bg-white dark:bg-[#131c31] space-y-3">
        <h3 className="font-bold text-[15px] text-gray-900 dark:text-white flex items-center gap-1.5 text-[#00A859]">
          <Code className="w-4 h-4" /> How to Package adBay as an Android APK / AAB for Play Store
        </h3>

        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          Google recommends <strong>Trusted Web Activities (TWA)</strong> to package production web apps into native Android apps with zero overhead, automatic updates, and full Google Play Store distribution.
        </p>

        {/* Step 1 */}
        <div className="space-y-1">
          <div className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-[#00A859] text-white flex items-center justify-center text-[10px] font-bold">1</span>
            <span>Install Google's Bubblewrap CLI:</span>
          </div>
          <div className="p-2 bg-gray-900 text-emerald-400 rounded font-mono text-[11px] flex items-center justify-between">
            <code>npm install -g @bubblewrap/cli</code>
            <button onClick={() => copyCode('npm install -g @bubblewrap/cli')} className="text-gray-400 hover:text-white">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Step 2 */}
        <div className="space-y-1">
          <div className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-[#00A859] text-white flex items-center justify-center text-[10px] font-bold">2</span>
            <span>Initialize Android Project from adBay Manifest:</span>
          </div>
          <div className="p-2 bg-gray-900 text-emerald-400 rounded font-mono text-[11px] flex items-center justify-between">
            <code>bubblewrap init --manifest=https://YOUR_DOMAIN/manifest.webmanifest</code>
            <button onClick={() => copyCode('bubblewrap init --manifest=https://YOUR_DOMAIN/manifest.webmanifest')} className="text-gray-400 hover:text-white">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Step 3 */}
        <div className="space-y-1">
          <div className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-[#00A859] text-white flex items-center justify-center text-[10px] font-bold">3</span>
            <span>Generate Digital Asset Links:</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-[12px]">
            Place <code>assetlinks.json</code> in <code>/.well-known/assetlinks.json</code> with your app's package name (e.g. <code>ke.co.adbay.app</code>) and SHA-256 certificate fingerprint so the address bar is completely hidden on Android.
          </p>
        </div>

        {/* Step 4 */}
        <div className="space-y-1">
          <div className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-[#00A859] text-white flex items-center justify-center text-[10px] font-bold">4</span>
            <span>Build Release AAB (Android App Bundle):</span>
          </div>
          <div className="p-2 bg-gray-900 text-emerald-400 rounded font-mono text-[11px] flex items-center justify-between">
            <code>bubblewrap build</code>
            <button onClick={() => copyCode('bubblewrap build')} className="text-gray-400 hover:text-white">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Step 5 */}
        <div className="space-y-1">
          <div className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-[#00A859] text-white flex items-center justify-center text-[10px] font-bold">5</span>
            <span>Publish to Google Play Store Console:</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-[12px]">
            Upload the signed <code>app-release-bundle.aab</code> to the Google Play Console under "Production Release".
          </p>
        </div>
      </div>
    </div>
  );
};
