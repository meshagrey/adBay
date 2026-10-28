import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  Layers,
  Settings,
  DollarSign,
  TrendingUp,
  Trash2,
  Plus,
  Edit,
  FolderTree,
  FileText,
  AlertCircle,
  Lock,
  Unlock,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    listings,
    approveListing,
    rejectListing,
    deleteListing,
    users,
    updateUserRole,
    toggleUserStatus,
    verifyBusinessAccount,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubcategory,
    deleteSubcategory,
    reports,
    resolveReport,
    promotionPackages,
    updatePromotionPackage,
    platformSettings,
    updatePlatformSettings,
    auditLogs,
    currentRole,
    currentUser,
    switchRole,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'users' | 'categories' | 'reports' | 'pricing' | 'logs' | 'settings'>('overview');

  // New Category form state
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [selectedCatForSub, setSelectedCatForSub] = useState(categories[0]?.id || '');
  const [newSubName, setNewSubName] = useState('');

  // Edit Category state
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatDesc, setEditCatDesc] = useState('');

  // Rejection reason state
  const [rejectingListingId, setRejectingListingId] = useState<string | null>(null);
  const [rejectionReasonText, setRejectionReasonText] = useState('Suspected scam or counterfeit item');

  // Stats calculation
  const totalListings = listings.length;
  const activeListings = listings.filter((l) => l.status === 'active').length;
  const pendingListings = listings.filter((l) => l.status === 'pending').length;
  const reportedCount = reports.filter((r) => r.status === 'pending').length;
  const totalViews = listings.reduce((acc, l) => acc + (l.viewsCount || 0), 0);
  const estimatedRevenue = listings.filter((l) => l.promotionTier !== 'standard').length * 750 + 2500;

  const handleApprove = (id: string) => {
    approveListing(id);
  };

  const handleConfirmReject = (id: string) => {
    if (!rejectionReasonText) return;
    rejectListing(id, rejectionReasonText);
    setRejectingListingId(null);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName.trim(), newCatDesc.trim() || 'Kenya marketplace category');
    setNewCatName('');
    setNewCatDesc('');
  };

  const handleCreateSubcategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim() || !selectedCatForSub) return;
    addSubcategory(selectedCatForSub, newSubName.trim());
    setNewSubName('');
  };

  return (
    <div className="max-w-[1250px] mx-auto px-2 sm:px-3 py-3 space-y-3">
      {/* Top Banner */}
      <div className="p-3 bg-slate-900 text-white rounded flex flex-wrap items-center justify-between gap-2 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#00A859] flex items-center justify-center text-white">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-[16px] flex items-center gap-2">
              <span>adBay Administration & Moderation Panel</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                Production Guard
              </span>
            </h1>
            <p className="text-[12px] text-gray-300">
              Admin: <strong>{currentUser?.name || 'Administrator'}</strong> • Role-based access control active
            </p>
          </div>
        </div>

        {/* If current role is not admin, warn & provide 1-click switch */}
        {currentRole !== 'admin' && (
          <div className="flex items-center gap-2 bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded text-[12px]">
            <span>⚠️ You are previewing as {currentRole}.</span>
            <button
              onClick={() => switchRole('admin')}
              className="bg-amber-500 text-gray-950 font-bold px-2 py-0.5 rounded text-[11px]"
            >
              Switch to Admin Role
            </button>
          </div>
        )}
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[12px] font-semibold border-b border-gray-200 dark:border-gray-800">
        {[
          { key: 'overview', label: '📊 Metrics Overview' },
          { key: 'listings', label: `📦 Ads Moderation (${pendingListings} pending)` },
          { key: 'reports', label: `🚩 Scam Reports (${reportedCount})` },
          { key: 'users', label: `👥 User Management (${users.length})` },
          { key: 'categories', label: `📁 Categories & Fields (${categories.length})` },
          { key: 'pricing', label: '💰 Monetization & Pricing' },
          { key: 'settings', label: '⚙️ Platform Controls' },
          { key: 'logs', label: `📜 Audit Logs (${auditLogs.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-3 py-1.5 rounded-t transition whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-white dark:bg-[#131c31] border-t-2 border-t-[#00A859] text-[#00A859] font-bold shadow-xs'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-3">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            <div className="p-3 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#131c31]">
              <span className="text-[11px] font-semibold text-gray-500 block">Total Ads</span>
              <span className="font-extrabold text-[20px] text-gray-900 dark:text-white">{totalListings}</span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">Active catalog</span>
            </div>

            <div className="p-3 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#131c31]">
              <span className="text-[11px] font-semibold text-gray-500 block">Pending Review</span>
              <span className="font-extrabold text-[20px] text-amber-500">{pendingListings}</span>
              <span className="text-[10px] text-gray-400 block mt-0.5">Needs moderation</span>
            </div>

            <div className="p-3 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#131c31]">
              <span className="text-[11px] font-semibold text-gray-500 block">Reported Ads</span>
              <span className="font-extrabold text-[20px] text-red-500">{reportedCount}</span>
              <span className="text-[10px] text-red-400 block mt-0.5">Scam/fraud flags</span>
            </div>

            <div className="p-3 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#131c31]">
              <span className="text-[11px] font-semibold text-gray-500 block">Total Users</span>
              <span className="font-extrabold text-[20px] text-gray-900 dark:text-white">{users.length}</span>
              <span className="text-[10px] text-blue-500 block mt-0.5">Buyers & merchants</span>
            </div>

            <div className="p-3 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#131c31]">
              <span className="text-[11px] font-semibold text-gray-500 block">Total Views</span>
              <span className="font-extrabold text-[20px] text-gray-900 dark:text-white">{totalViews.toLocaleString()}</span>
              <span className="text-[10px] text-emerald-500 block mt-0.5">Shopper traffic</span>
            </div>

            <div className="p-3 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#131c31]">
              <span className="text-[11px] font-semibold text-gray-500 block">Simulated Revenue</span>
              <span className="font-extrabold text-[20px] text-[#00A859]">KES {estimatedRevenue.toLocaleString()}</span>
              <span className="text-[10px] text-gray-400 block mt-0.5">M-Pesa promotions</span>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Pending Moderation Queue Preview */}
            <div className="border border-gray-200 dark:border-gray-800 rounded p-3 bg-white dark:bg-[#131c31] space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-[13px] text-gray-900 dark:text-white flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-500" /> Pending Approvals ({pendingListings})
                </h3>
                <button
                  onClick={() => setActiveTab('listings')}
                  className="text-[11px] text-[#00A859] hover:underline"
                >
                  View All
                </button>
              </div>

              {pendingListings === 0 ? (
                <div className="py-4 text-center text-gray-400 text-[12px]">
                  ✅ All advertisements are reviewed and cleared.
                </div>
              ) : (
                listings
                  .filter((l) => l.status === 'pending')
                  .slice(0, 3)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="p-2 rounded bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between text-[12px]"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="font-bold text-gray-900 dark:text-white truncate block">
                          {item.title}
                        </span>
                        <span className="text-gray-500">
                          KES {item.price.toLocaleString()} • {item.sellerName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="px-2 py-1 rounded bg-[#00A859] text-white font-bold text-[11px]"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setRejectingListingId(item.id)}
                          className="px-2 py-1 rounded bg-red-600 text-white font-bold text-[11px]"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>

            {/* Recent Scam & Abuse Reports Preview */}
            <div className="border border-gray-200 dark:border-gray-800 rounded p-3 bg-white dark:bg-[#131c31] space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-[13px] text-gray-900 dark:text-white flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-500" /> User Reports ({reportedCount} Open)
                </h3>
                <button
                  onClick={() => setActiveTab('reports')}
                  className="text-[11px] text-[#00A859] hover:underline"
                >
                  View Reports
                </button>
              </div>

              {reports.slice(0, 3).map((rep) => (
                <div
                  key={rep.id}
                  className="p-2 rounded bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between text-[12px]"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-bold text-red-600 dark:text-red-400 capitalize block">
                      [{rep.reason}] {rep.targetTitle}
                    </span>
                    <span className="text-gray-500 text-[11px] truncate block">{rep.details}</span>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${
                      rep.status === 'pending' ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-500'
                    }`}
                  >
                    {rep.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ADS MODERATION */}
      {activeTab === 'listings' && (
        <div className="space-y-3">
          <div className="border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-[#131c31] overflow-hidden">
            <div className="p-3 border-b border-gray-100 dark:border-gray-800 font-bold text-[14px]">
              Listing Moderation & Inspection Queue ({listings.length} listings)
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px]">
                <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-500 border-b border-gray-100 dark:border-gray-800 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-2.5">Ad Details</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5">Price</th>
                    <th className="p-2.5">Seller</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {listings.map((l) => (
                    <tr key={l.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                      <td className="p-2.5 flex items-center gap-2 max-w-xs">
                        <img src={l.images[0]} alt="" className="w-10 h-10 rounded object-cover shrink-0" />
                        <span className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                          {l.title}
                        </span>
                      </td>
                      <td className="p-2.5 text-gray-600 dark:text-gray-400">{l.categoryId}</td>
                      <td className="p-2.5 font-bold text-[#00A859]">KES {l.price.toLocaleString()}</td>
                      <td className="p-2.5 text-gray-600 dark:text-gray-400">
                        {l.sellerName} ({l.sellerType})
                      </td>
                      <td className="p-2.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                            l.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : l.status === 'pending'
                              ? 'bg-amber-500/10 text-amber-600'
                              : l.status === 'sold'
                              ? 'bg-gray-200 text-gray-700'
                              : 'bg-red-500/10 text-red-500'
                          }`}
                        >
                          {l.status}
                        </span>
                      </td>
                      <td className="p-2.5">
                        <div className="flex items-center gap-1">
                          {l.status !== 'active' && (
                            <button
                              onClick={() => handleApprove(l.id)}
                              className="p-1 rounded bg-[#00A859] text-white hover:bg-[#00924c]"
                              title="Approve ad"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {l.status !== 'rejected' && (
                            <button
                              onClick={() => setRejectingListingId(l.id)}
                              className="p-1 rounded bg-amber-500 text-white hover:bg-amber-600"
                              title="Reject ad"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (window.confirm('Delete advertisement permanently?')) deleteListing(l.id);
                            }}
                            className="p-1 rounded bg-red-600 text-white hover:bg-red-700"
                            title="Delete ad"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rejection Modal if active */}
          {rejectingListingId && (
            <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-3">
              <div className="w-full max-w-sm bg-white dark:bg-[#131c31] border border-gray-200 dark:border-gray-800 rounded p-4 shadow-xl space-y-3">
                <h4 className="font-bold text-[14px] text-red-600 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Reject Advertisement
                </h4>
                <div>
                  <label className="text-[12px] font-medium text-gray-700 dark:text-gray-300 block mb-1">
                    Select Rejection Reason:
                  </label>
                  <select
                    value={rejectionReasonText}
                    onChange={(e) => setRejectionReasonText(e.target.value)}
                    className="w-full p-1.5 rounded border border-gray-300 text-[12px] dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="Suspected scam or advance fee demand">Suspected scam or advance fee demand</option>
                    <option value="Prohibited item under Kenya Laws & ODPC guidelines">Prohibited item under Kenya Laws & ODPC guidelines</option>
                    <option value="Poor quality or deceptive product images">Poor quality or deceptive product images</option>
                    <option value="Unrealistic or misleading price">Unrealistic or misleading price</option>
                    <option value="Duplicate or spam advertisement">Duplicate or spam advertisement</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setRejectingListingId(null)}
                    className="px-3 py-1 rounded border border-gray-300 text-[12px]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleConfirmReject(rejectingListingId)}
                    className="px-4 py-1 rounded bg-red-600 text-white font-bold text-[12px]"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-[#131c31] overflow-hidden">
          <div className="p-3 border-b border-gray-100 dark:border-gray-800 font-bold text-[14px]">
            User Accounts & Role Permissions ({users.length} members)
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px]">
              <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-2.5">User</th>
                  <th className="p-2.5">Contact</th>
                  <th className="p-2.5">Role</th>
                  <th className="p-2.5">Location</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                    <td className="p-2.5 flex items-center gap-2">
                      <img src={u.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-white block">{u.name}</span>
                        <span className="text-[10px] text-gray-400">Joined {u.joinedDate}</span>
                      </div>
                    </td>
                    <td className="p-2.5">
                      <span className="block text-gray-700 dark:text-gray-300">{u.phone}</span>
                      <span className="text-[11px] text-gray-400">{u.email}</span>
                    </td>
                    <td className="p-2.5">
                      <select
                        value={u.role}
                        onChange={(e) => updateUserRole(u.id, e.target.value as UserRole)}
                        className="p-1 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[11px] font-bold"
                      >
                        <option value="guest">Guest</option>
                        <option value="buyer">Buyer</option>
                        <option value="seller">Seller</option>
                        <option value="business">Business</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-2.5 text-gray-600 dark:text-gray-400">
                      {u.county}, {u.town}
                    </td>
                    <td className="p-2.5">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-500'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-2.5">
                      <div className="flex items-center gap-1.5">
                        {!u.isVerifiedBusiness && (
                          <button
                            onClick={() => verifyBusinessAccount(u.id)}
                            className="px-2 py-0.5 rounded bg-blue-600 text-white font-medium text-[11px]"
                            title="Verify merchant"
                          >
                            Verify Store
                          </button>
                        )}
                        <button
                          onClick={() => toggleUserStatus(u.id)}
                          className={`p-1 rounded text-white ${u.status === 'active' ? 'bg-amber-600' : 'bg-emerald-600'}`}
                          title={u.status === 'active' ? 'Suspend account' : 'Reinstate account'}
                        >
                          {u.status === 'active' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CATEGORY MANAGER */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Add Category Form */}
          <div className="md:col-span-5 space-y-3">
            <form
              onSubmit={handleCreateCategory}
              className="border border-gray-200 dark:border-gray-800 rounded p-3 bg-white dark:bg-[#131c31] space-y-2 text-[13px]"
            >
              <h3 className="font-bold text-[14px] text-gray-900 dark:text-white flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-[#00A859]" /> Add New Category
              </h3>
              <div>
                <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-0.5">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solar & Renewable Energy"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-2 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[12px]"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-0.5">Description</label>
                <input
                  type="text"
                  placeholder="Solar panels, inverters, batteries, installation"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full px-2 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[12px]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#00A859] hover:bg-[#00924c] text-white font-bold py-1.5 rounded text-[12px]"
              >
                Create Category
              </button>
            </form>

            {/* Add Subcategory Form */}
            <form
              onSubmit={handleCreateSubcategory}
              className="border border-gray-200 dark:border-gray-800 rounded p-3 bg-white dark:bg-[#131c31] space-y-2 text-[13px]"
            >
              <h3 className="font-bold text-[14px] text-gray-900 dark:text-white flex items-center gap-1.5">
                <FolderTree className="w-4 h-4 text-blue-500" /> Add Nested Subcategory
              </h3>
              <div>
                <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-0.5">Parent Category</label>
                <select
                  value={selectedCatForSub}
                  onChange={(e) => setSelectedCatForSub(e.target.value)}
                  className="w-full px-2 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[12px]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-0.5">Subcategory Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lithium Solar Batteries"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  className="w-full px-2 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[12px]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 rounded text-[12px]"
              >
                Add Subcategory
              </button>
            </form>
          </div>

          {/* Existing Categories Directory */}
          <div className="md:col-span-7 border border-gray-200 dark:border-gray-800 rounded p-3 bg-white dark:bg-[#131c31] space-y-2 max-h-[600px] overflow-y-auto">
            <div className="flex items-center justify-between pb-1.5 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-[14px] text-gray-900 dark:text-white">
                Active Marketplace Categories ({categories.length})
              </h3>
              <span className="text-[11px] text-gray-400">Admin Control: Edit & Delete Enabled</span>
            </div>
            <div className="space-y-2 text-[12px]">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`p-2.5 rounded border transition ${
                    editingCatId === cat.id
                      ? 'border-[#00A859] bg-[#00A859]/5'
                      : 'border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30'
                  }`}
                >
                  {editingCatId === cat.id ? (
                    /* Inline Edit Mode */
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#00A859] text-[12px]">Editing Category: {cat.name}</span>
                        <span className="text-[10px] text-gray-400">ID: {cat.id}</span>
                      </div>
                      <div className="space-y-1.5">
                        <div>
                          <label className="text-[11px] font-semibold text-gray-500 block mb-0.5">Category Name</label>
                          <input
                            type="text"
                            value={editCatName}
                            onChange={(e) => setEditCatName(e.target.value)}
                            className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-[12px]"
                            placeholder="Category Name"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-gray-500 block mb-0.5">Description</label>
                          <input
                            type="text"
                            value={editCatDesc}
                            onChange={(e) => setEditCatDesc(e.target.value)}
                            className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-[12px]"
                            placeholder="Description"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingCatId(null)}
                          className="px-2.5 py-1 rounded border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-[11px]"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!editCatName.trim()) return;
                            updateCategory(cat.id, {
                              name: editCatName.trim(),
                              description: editCatDesc.trim(),
                            });
                            setEditingCatId(null);
                          }}
                          className="px-3 py-1 rounded bg-[#00A859] hover:bg-[#00924c] text-white font-bold text-[11px] flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Display Mode with Edit and Delete Buttons */
                    <div>
                      <div className="flex items-center justify-between font-bold text-gray-900 dark:text-white">
                        <div className="flex items-center gap-1.5">
                          <span>{cat.name}</span>
                          <span className="text-[11px] font-normal text-gray-400">({cat.count} ads)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCatId(cat.id);
                              setEditCatName(cat.name);
                              setEditCatDesc(cat.description);
                            }}
                            className="p-1 rounded text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition"
                            title={`Edit "${cat.name}" category`}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete category "${cat.name}"? This action cannot be undone.`)) {
                                deleteCategory(cat.id);
                              }
                            }}
                            className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                            title={`Delete "${cat.name}" category`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-500 text-[11px] mt-0.5">{cat.description}</p>
                      
                      {/* Subcategories list with remove buttons */}
                      <div className="flex flex-wrap gap-1 mt-1.5 items-center">
                        {cat.subcategories.map((sub) => (
                          <span
                            key={sub.id}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-[10px]"
                          >
                            <span>{sub.name}</span>
                            <button
                              type="button"
                              onClick={() => deleteSubcategory(cat.id, sub.id)}
                              className="text-gray-400 hover:text-red-500"
                              title={`Remove subcategory "${sub.name}"`}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: REPORTS & FRAUD MODERATION */}
      {activeTab === 'reports' && (
        <div className="border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-[#131c31] overflow-hidden">
          <div className="p-3 border-b border-gray-100 dark:border-gray-800 font-bold text-[14px] flex items-center justify-between">
            <span>Flagged Advertisements & Scam Reports ({reports.length})</span>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-800 text-[12px]">
            {reports.map((rep) => (
              <div key={rep.id} className="p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-red-600 bg-red-500/10 px-1.5 py-0.2 rounded uppercase text-[10px]">
                      {rep.reason}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Target: {rep.targetTitle}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-[13px]">{rep.details}</p>
                  <span className="text-[11px] text-gray-400">
                    Reported by {rep.reporterName} on {new Date(rep.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {rep.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => resolveReport(rep.id, 'resolved')}
                        className="px-2.5 py-1 rounded bg-[#00A859] text-white font-bold text-[11px]"
                      >
                        Take Action & Resolve
                      </button>
                      <button
                        onClick={() => resolveReport(rep.id, 'dismissed')}
                        className="px-2.5 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-[11px]"
                      >
                        Dismiss
                      </button>
                    </>
                  ) : (
                    <span className="text-emerald-500 font-bold uppercase text-[11px]">
                      ✓ {rep.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: PRICING & MONETIZATION */}
      {activeTab === 'pricing' && (
        <div className="space-y-3">
          <div className="p-3 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#131c31]">
            <h3 className="font-bold text-[14px] text-gray-900 dark:text-white mb-2">
              Configure Monetization Packages (KES)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {promotionPackages.slice(1).map((pkg) => (
                <div key={pkg.id} className="p-3 rounded border border-gray-200 dark:border-gray-700 space-y-2 text-[12px]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[14px] text-gray-900 dark:text-white">{pkg.name}</span>
                    <span className="text-amber-500 font-bold">{pkg.badge}</span>
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-400 block">Price (KES)</label>
                    <input
                      type="number"
                      value={pkg.priceKES}
                      onChange={(e) => updatePromotionPackage(pkg.id, { priceKES: Number(e.target.value) })}
                      className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px] font-bold text-[#00A859]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-400 block">Duration (Days)</label>
                    <input
                      type="number"
                      value={pkg.durationDays}
                      onChange={(e) => updatePromotionPackage(pkg.id, { durationDays: Number(e.target.value) })}
                      className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: PLATFORM SETTINGS */}
      {activeTab === 'settings' && (
        <div className="p-4 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-[#131c31] space-y-3 text-[13px]">
          <h3 className="font-bold text-[14px] text-gray-900 dark:text-white">Global Marketplace Controls</h3>

          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={platformSettings.autoApproveAds}
                onChange={(e) => updatePlatformSettings({ autoApproveAds: e.target.checked })}
                className="accent-[#00A859] w-4 h-4"
              />
              <span>
                <strong>Auto-Approve User Advertisements:</strong> Automatically publish newly posted ads without mandatory manual review.
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={platformSettings.showEmergencyBanner}
                onChange={(e) => updatePlatformSettings({ showEmergencyBanner: e.target.checked })}
                className="accent-[#00A859] w-4 h-4"
              />
              <span>
                <strong>Display Emergency Security Banner:</strong> Show anti-fraud notice at the top of all pages across Kenya.
              </span>
            </label>

            <div>
              <label className="font-medium text-gray-700 dark:text-gray-300 block mb-1">
                Emergency Banner Copy:
              </label>
              <input
                type="text"
                value={platformSettings.emergencyBannerText}
                onChange={(e) => updatePlatformSettings({ emergencyBannerText: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  Customer Support Phone
                </label>
                <input
                  type="text"
                  value={platformSettings.contactSupportPhone}
                  onChange={(e) => updatePlatformSettings({ contactSupportPhone: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px]"
                />
              </div>

              <div>
                <label className="font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  Customer Support Email
                </label>
                <input
                  type="email"
                  value={platformSettings.contactSupportEmail}
                  onChange={(e) => updatePlatformSettings({ contactSupportEmail: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[13px]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-[#131c31] overflow-hidden">
          <div className="p-3 border-b border-gray-100 dark:border-gray-800 font-bold text-[14px]">
            Security Audit Trail ({auditLogs.length} events logged)
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[500px] overflow-y-auto text-[12px]">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-2.5 flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#00A859]">{log.action}</span>
                    <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-1 rounded">
                      {log.targetType}:{log.targetId}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-[12px] mt-0.5">{log.details}</p>
                </div>
                <div className="text-right shrink-0 text-[11px] text-gray-400">
                  <span className="block font-medium">{log.adminName}</span>
                  <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
