'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


function AdminLogo({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <div className={`w-8 h-8 rounded-lg bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18"/><path d="M3 7v1a3 3 0 0 0 6 0V7"/><path d="M9 7v1a3 3 0 0 0 6 0V7"/><path d="M15 7v1a3 3 0 0 0 6 0V7"/><path d="M3 7h18l-1.5-4H4.5L3 7z"/>
      </svg>
    </div>
  );
}

const navItems = [
  { label: 'Dashboard', key: 'dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg> },
  { label: 'Users', key: 'users', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
  { label: 'Deposits', key: 'deposits', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></svg> },
  { label: 'Withdrawals', key: 'withdrawals', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></svg> },
  { label: 'KYC Review', key: 'kyc', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 4h18v16H3z" /><path d="M3 10h18" /></svg> },

  { label: 'Messages', key: 'messages', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg> },
  { label: 'Audit Log', key: 'audit', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg> },
  { label: 'Settings', key: 'settings', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg> },
];

function apiCall(url: string, options?: RequestInit) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers as Record<string, string> || {}),
    },
  });
}

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    active: 'bg-green-900/30 text-green-400',
    suspended: 'bg-red-900/30 text-red-400',
    banned: 'bg-red-900/50 text-red-300',
    pending: 'bg-yellow-900/30 text-yellow-400',
    pending_verification: 'bg-yellow-900/30 text-yellow-400',
    confirmed: 'bg-green-900/30 text-green-400',
    approved: 'bg-green-900/30 text-green-400',
    rejected: 'bg-red-900/30 text-red-400',
    completed: 'bg-green-900/30 text-green-400',
    processing: 'bg-blue-900/30 text-blue-400',
    failed: 'bg-red-900/30 text-red-400',
    expired: 'bg-gray-700/50 text-gray-400',
    closed: 'bg-gray-700/50 text-gray-400',
  };
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${map[status] || 'bg-gray-700/50 text-gray-400'}`}>{status}</span>;
};

export default function AdminPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [kycList, setKycList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [depositFilter, setDepositFilter] = useState('');
  const [withdrawalFilter, setWithdrawalFilter] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [settingsPhotoUrl, setSettingsPhotoUrl] = useState<string | null>(null);
  const [managementPhotoUrl, setCEOPhotoUrl] = useState<string | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [messageDialog, setMessageDialog] = useState<{type: 'kyc'|'deposit'|'withdrawal', id: string, action: 'approve'|'reject', defaultReason?: string} | null>(null);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogAttachment, setDialogAttachment] = useState('');
  // Bank accounts state
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [bankAccountsLoading, setBankAccountsLoading] = useState(false);
  const [showAddBank, setShowAddBank] = useState(false);
  const [editingBank, setEditingBank] = useState<any | null>(null);
  const [bankForm, setBankForm] = useState({ label: '', bankName: '', accountNumber: '', routingNumber: '', accountType: 'Checking', isActive: true });
  // Messages state
  const [msgSubject, setMsgSubject] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [msgType, setMsgType] = useState('custom');
  const [msgSendEmail, setMsgSendEmail] = useState(true);
  const [msgBroadcast, setMsgBroadcast] = useState(true);
  const [msgSelectedUsers, setMsgSelectedUsers] = useState<string[]>([]);
  const [msgSending, setMsgSending] = useState(false);

  // Audit log state
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditPage, setAuditPage] = useState(1);
  const [auditTotal, setAuditTotal] = useState(0);

  // User detail modal state
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userDetail, setUserDetail] = useState<any>(null);
  const [userDetailLoading, setUserDetailLoading] = useState(false);
  // Fund editing state
  const [fundEditWalletType, setFundEditWalletType] = useState<string>('live');
  const [fundEditAmount, setFundEditAmount] = useState<string>('');
  const [fundEditMode, setFundEditMode] = useState<'adjust' | 'set'>('adjust');
  const [fundEditLoading, setFundEditLoading] = useState(false);

  // Auth check — verify admin access server-side, not just localStorage
  const [authChecking, setAuthChecking] = useState(true);
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const adminUser = localStorage.getItem('adminUser');
    if (!adminToken || !adminUser) {
      router.replace('/admin/login');
      return;
    }
    try {
      const parsed = JSON.parse(adminUser);
      if (!parsed.adminRecord) {
        router.replace('/admin/login');
        return;
      }
    } catch { router.replace('/admin/login'); return; }

    // Also verify the token is still valid server-side
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${adminToken}` },
    }).then((res) => res.json()).then((data) => {
      if (!data.success || !data.data?.adminRecord) {
        // Token invalid or user is not admin — clear and redirect
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        router.replace('/admin/login');
      } else {
        setAuthed(true);
      }
    }).catch(() => {
      setAuthed(true); // Allow on network error, API calls will fail naturally
    }).finally(() => setAuthChecking(false));
  }, [router]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const fetchStats = useCallback(async () => {
    try {
      const res = await apiCall('/api/admin/stats');
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch (e) { console.error(e); }
  }, []);

  const fetchUsers = useCallback(async (search = '') => {
    try {
      const res = await apiCall(`/api/admin/users?limit=100${search ? `&search=${search}` : ''}`);
      const data = await res.json();
      if (data.success) setUsers(data.data.users);
    } catch (e) { console.error(e); }
  }, []);

  const fetchDeposits = useCallback(async (status = '') => {
    try {
      const res = await apiCall(`/api/admin/deposits?limit=100${status ? `&status=${status}` : ''}`);
      const data = await res.json();
      if (data.success) setDeposits(data.data.deposits);
    } catch (e) { console.error(e); }
  }, []);

  const fetchWithdrawals = useCallback(async (status = '') => {
    try {
      const res = await apiCall(`/api/admin/withdrawals?limit=100${status ? `&status=${status}` : ''}`);
      const data = await res.json();
      if (data.success) setWithdrawals(data.data.withdrawals);
    } catch (e) { console.error(e); }
  }, []);

  const fetchKyc = useCallback(async (status = '') => {
    try {
      const res = await apiCall(`/api/admin/kyc?limit=100${status ? `&status=${status}` : ''}`);
      const data = await res.json();
      if (data.success) setKycList(data.data.verifications);
    } catch (e) { console.error(e); }
  }, []);

  const fetchBankAccounts = useCallback(async () => {
    setBankAccountsLoading(true);
    try {
      const res = await apiCall('/api/admin/bank-accounts');
      const data = await res.json();
      if (data.success) setBankAccounts(data.data.accounts || []);
    } catch (e) { console.error(e); }
    setBankAccountsLoading(false);
  }, []);

  const fetchAuditLog = useCallback(async (page: number) => {
    setAuditLoading(true);
    try {
      const res = await apiCall(`/api/admin/audit-log?page=${page}&limit=20`);
      const data = await res.json();
      if (data.success) {
        setAuditLogs(data.data.logs || []);
        setAuditTotal(data.data.total || 0);
      }
    } catch (e) { console.error(e); }
    setAuditLoading(false);
  }, []);

  const fetchUserDetail = useCallback(async (userId: string) => {
    setUserDetailLoading(true);
    try {
      const res = await apiCall(`/api/admin/users/${userId}`);
      const data = await res.json();
      if (data.success) setUserDetail(data.data);
      else showToast(data.error?.message || 'Failed to fetch user');
    } catch { showToast('Network error'); }
    setUserDetailLoading(false);
  }, []);

  const openUserDetail = (userId: string) => {
    setSelectedUserId(userId);
    setFundEditAmount('');
    setFundEditMode('adjust');
    setFundEditWalletType('live');
    setUserDetail(null);
    fetchUserDetail(userId);
  };

  const closeUserDetail = () => {
    setSelectedUserId(null);
    setUserDetail(null);
    setFundEditAmount('');
  };

  const handleFundEdit = async () => {
    if (!selectedUserId || !fundEditAmount) return;
    const amount = parseFloat(fundEditAmount);
    if (isNaN(amount)) { showToast('Enter a valid number'); return; }
    if (fundEditMode === 'adjust' && amount === 0) { showToast('Amount cannot be zero'); return; }
    if (fundEditMode === 'set' && amount < 0) { showToast('Balance cannot be negative'); return; }
    setFundEditLoading(true);
    try {
      const body: any = { userId: selectedUserId, walletType: fundEditWalletType };
      if (fundEditMode === 'adjust') {
        body.action = 'adjust_balance';
        body.amount = amount;
      } else {
        body.action = 'set_balance';
        body.balance = amount;
      }
      const res = await apiCall('/api/admin/users', { method: 'PATCH', body: JSON.stringify(body) });
      const data = await res.json();
      if (data.success) {
        showToast(`Funds ${fundEditMode === 'adjust' ? 'adjusted' : 'set'} successfully`);
        fetchUserDetail(selectedUserId);
        fetchUsers(searchTerm);
        setFundEditAmount('');
      } else {
        showToast(data.error?.message || 'Failed to update funds');
      }
    } catch { showToast('Network error'); }
    setFundEditLoading(false);
  };

  useEffect(() => { fetchStats(); }, [fetchStats]);

  useEffect(() => {
    if (activeTab === 'dashboard') { fetchStats(); fetchUsers(); }
    if (activeTab === 'users') fetchUsers(searchTerm);
    if (activeTab === 'deposits') fetchDeposits(depositFilter);
    if (activeTab === 'withdrawals') fetchWithdrawals(withdrawalFilter);
    if (activeTab === 'kyc') fetchKyc();
    if (activeTab === 'messages') fetchUsers('');
    if (activeTab === 'audit') fetchAuditLog(1);
    if (activeTab === 'settings') {
      apiCall('/api/admin/settings').then(r => r.json()).then(d => {
        if (d.success) {
          if (d.data?.aboutPhotoUrl) setSettingsPhotoUrl(d.data.aboutPhotoUrl);
          if (d.data?.managementPhotoUrl) setCEOPhotoUrl(d.data.managementPhotoUrl);
        }
      }).catch(() => {});
      fetchBankAccounts();
    }
  }, [activeTab, depositFilter, withdrawalFilter]);

  const updateUserStatus = async (userId: string, status: string) => {
    setActionLoading(userId);
    try {
      const res = await apiCall('/api/admin/users', {
        method: 'PATCH',
        body: JSON.stringify({ userId, action: 'status', value: status }),
      });
      const data = await res.json();
      if (data.success) { showToast(`User ${status} successfully`); fetchUsers(searchTerm); fetchStats(); }
      else showToast(data.error?.message || 'Action failed');
    } catch { showToast('Network error'); }
    setActionLoading(null);
  };

  const handleDepositAction = async (depositId: string, action: 'approve' | 'reject') => {
    setMessageDialog({ type: 'deposit', id: depositId, action });
    setDialogMessage('');
    setDialogAttachment('');
  };

  const executeDepositAction = async () => {
    if (!messageDialog) return;
    setActionLoading(messageDialog.id);
    setMessageDialog(null);
    try {
      const res = await apiCall('/api/admin/deposits', {
        method: 'PATCH',
        body: JSON.stringify({
          depositId: messageDialog.id,
          action: messageDialog.action,
          reason: messageDialog.action === 'reject' ? dialogMessage || undefined : undefined,
          adminMessage: dialogMessage || undefined,
          attachmentUrl: dialogAttachment || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) { showToast(`Deposit ${messageDialog.action}d, email sent to user`); fetchDeposits(depositFilter); fetchStats(); }
      else showToast(data.error?.message || 'Action failed');
    } catch { showToast('Network error'); }
    setActionLoading(null);
  };

  const handleWithdrawalAction = async (withdrawalId: string, action: 'approve' | 'reject') => {
    setActionLoading(withdrawalId);
    const reason = action === 'reject' ? prompt('Rejection reason:') : undefined;
    if (action === 'reject' && reason === null) { setActionLoading(null); return; }
    try {
      const res = await apiCall('/api/admin/withdrawals', {
        method: 'PATCH',
        body: JSON.stringify({ withdrawalId, action, reason }),
      });
      const data = await res.json();
      if (data.success) { showToast(`Withdrawal ${action}d`); fetchWithdrawals(withdrawalFilter); fetchStats(); }
      else showToast(data.error?.message || 'Action failed');
    } catch { showToast('Network error'); }
    setActionLoading(null);
  };

  const handleKycAction = async (verificationId: string, action: 'approve' | 'reject') => {
    setMessageDialog({ type: 'kyc', id: verificationId, action });
    setDialogMessage('');
    setDialogAttachment('');
  };

  const executeKycAction = async () => {
    if (!messageDialog) return;
    setActionLoading(messageDialog.id);
    setMessageDialog(null);
    try {
      const res = await apiCall('/api/admin/kyc', {
        method: 'PATCH',
        body: JSON.stringify({
          verificationId: messageDialog.id,
          action: messageDialog.action,
          reason: messageDialog.action === 'reject' ? dialogMessage || undefined : undefined,
          adminMessage: dialogMessage || undefined,
          attachmentUrl: dialogAttachment || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) { showToast(`KYC ${messageDialog.action}d, email sent to user`); fetchKyc(); fetchStats(); }
      else showToast(data.error?.message || 'Action failed');
    } catch { showToast('Network error'); }
    setActionLoading(null);
  };

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchUsers(searchTerm); };

  const saveCEOUrl = async (url?: string) => {
    const inputUrl = url || (document.getElementById('managementUrlInput') as HTMLInputElement)?.value.trim();
    if (!inputUrl) return;
    setSettingsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ managementPhotoUrl: inputUrl }),
      });
      const data = await res.json();
      if (data.success) { setCEOPhotoUrl(data.data.managementPhotoUrl); showToast('CEO photo URL updated!'); }
      else showToast(data.error?.message || 'Update failed');
    } catch { showToast('Update failed'); }
    setSettingsLoading(false);
  };

  // Don't render admin panel while checking auth or if not authed
  if (authChecking || !authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#2563EB]/30 border-t-[#2563EB] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white flex">
      {toast && (
        <div className="fixed top-4 right-4 z-[100] bg-card border border-border rounded-lg px-4 py-3 text-sm shadow-xl animate-fade-in">
          {toast}
        </div>
      )}

      {/* Message Dialog Modal */}
      {messageDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setMessageDialog(null)}>
          <div className="bg-[#1a1a1a] border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-semibold mb-1">
              {messageDialog.action === 'approve' ? 'Approve' : 'Reject'} {messageDialog.type === 'kyc' ? 'KYC' : messageDialog.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
            </h3>
            <p className="text-gray-500 text-xs mb-4">
              {messageDialog.action === 'approve'
                ? 'Add an optional message and the user will receive an email notification.'
                : 'Provide a reason for rejection. The user will be notified via email.'}
            </p>
            <textarea
              value={dialogMessage}
              onChange={e => setDialogMessage(e.target.value)}
              placeholder={messageDialog.action === 'reject' ? 'Rejection reason / billing message...' : 'Optional message to the user (e.g. billing details, instructions)...'}
              rows={4}
              className="w-full bg-[#111] border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#2563EB] transition-colors resize-none mb-3"
            />
            <input
              type="text"
              value={dialogAttachment}
              onChange={e => setDialogAttachment(e.target.value)}
              placeholder="Attachment URL (optional — document, receipt, invoice...)"
              className="w-full bg-[#111] border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#2563EB] transition-colors mb-5"
            />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setMessageDialog(null)} className="px-5 py-2.5 text-sm text-gray-400 hover:text-white border border-border rounded-xl transition-colors">Cancel</button>
              <button onClick={() => { if (messageDialog.type === 'kyc') executeKycAction(); else executeDepositAction(); }}
                className={`px-5 py-2.5 text-sm font-medium text-white rounded-xl transition-colors ${messageDialog.action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                Confirm &amp; Send Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Detail Modal — Fund Management */}
      {selectedUserId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={closeUserDetail}>
          <div className="bg-[#1a1a1a] border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            {userDetailLoading ? (
              <div className="p-10 text-center">
                <svg className="animate-spin h-8 w-8 mx-auto text-[#2563EB] mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                <p className="text-gray-400 text-sm">Loading user details...</p>
              </div>
            ) : userDetail ? (
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-bold text-lg">
                      {userDetail.profile?.firstName || '—'} {userDetail.profile?.lastName || ''}
                    </h3>
                    <p className="text-gray-500 text-sm">{userDetail.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {statusBadge(userDetail.status)}
                    <button onClick={closeUserDetail} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                  </div>
                </div>

                {/* User Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'KYC Level', value: userDetail.kycLevel || 'LEVEL_0', badge: true },
                    { label: 'Email Verified', value: userDetail.emailVerified ? 'Yes' : 'No' },
                    { label: '2FA', value: userDetail.twoFactorEnabled ? 'Enabled' : 'Disabled' },
                    { label: 'Joined', value: userDetail.createdAt ? new Date(userDetail.createdAt).toLocaleDateString() : '—' },
                    { label: 'Last Login', value: userDetail.lastLoginAt ? new Date(userDetail.lastLoginAt).toLocaleDateString() : 'Never' },
                    { label: 'Referrals', value: userDetail._count?.referrals?.toString() || '0' },
                    { label: 'Deposits', value: `$${(userDetail.deposits?.filter((d: any) => d.status === 'confirmed').reduce((s: number, d: any) => s + (d.amount || 0), 0) || 0).toLocaleString()}` },
                    { label: 'Investments', value: `$${(userDetail.investments?.filter((i: any) => i.status === 'active').reduce((s: number, i: any) => s + (i.amount || 0), 0) || 0).toLocaleString()}` },
                  ].map((item, i) => (
                    <div key={i} className="bg-[#111] border border-border rounded-lg p-3">
                      <p className="text-gray-500 text-[10px] font-medium uppercase tracking-wider">{item.label}</p>
                      {item.badge ? (
                        <p className="mt-1">{statusBadge(item.value)}</p>
                      ) : (
                        <p className="text-white text-sm font-semibold mt-0.5">{item.value}</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Wallet Balances & Fund Management */}
                <div className="space-y-4">
                  <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a4 4 0 0 0-8 0v2" /></svg>
                    Wallet Balances &amp; Fund Management
                  </h4>

                  {/* Wallet cards */}
                  {userDetail.wallets && userDetail.wallets.length > 0 ? (
                    <div className="space-y-3">
                      {userDetail.wallets.map((wallet: any) => (
                        <div key={wallet.id} className={`border rounded-xl p-4 transition-all ${fundEditWalletType === wallet.type ? 'border-[#2563EB]/50 bg-[#2563EB]/5' : 'border-border bg-[#111]'}`}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded ${wallet.type === 'live' ? 'bg-green-600/15 text-green-400' : 'bg-blue-600/15 text-blue-400'}`}>
                                {wallet.type.toUpperCase()} WALLET
                              </span>
                            </div>
                            <button
                              onClick={() => { setFundEditWalletType(wallet.type); setFundEditAmount(''); }}
                              className={`text-xs font-medium px-3 py-1 rounded-lg transition-colors ${fundEditWalletType === wallet.type ? 'bg-[#2563EB] text-white' : 'bg-white/5 text-gray-400 hover:text-white border border-border'}`}
                            >
                              {fundEditWalletType === wallet.type ? 'Editing' : 'Edit'}
                            </button>
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <p className="text-gray-500 text-[10px] uppercase tracking-wider">Total Balance</p>
                              <p className="text-white font-bold text-lg">${(wallet.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-[10px] uppercase tracking-wider">Available</p>
                              <p className="text-green-400 font-semibold">${(wallet.availableBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-[10px] uppercase tracking-wider">Locked</p>
                              <p className="text-yellow-400 font-semibold">${(wallet.lockedBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-6 text-sm bg-[#111] border border-border rounded-xl">
                      No wallets found for this user
                    </div>
                  )}

                  {/* Fund Edit Controls */}
                  {fundEditWalletType && userDetail.wallets?.some((w: any) => w.type === fundEditWalletType) && (
                    <div className="bg-[#111] border border-border rounded-xl p-5 space-y-4">
                      <h5 className="text-white text-sm font-medium">Modify {fundEditWalletType.toUpperCase()} Wallet</h5>

                      {/* Mode toggle */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setFundEditMode('adjust'); setFundEditAmount(''); }}
                          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all border ${fundEditMode === 'adjust' ? 'bg-[#2563EB]/10 border-[#2563EB]/30 text-[#2563EB]' : 'bg-white/5 border-border text-gray-500 hover:border-gray-600'}`}
                        >
                          Adjust (+/-)
                        </button>
                        <button
                          onClick={() => { setFundEditMode('set'); setFundEditAmount(''); }}
                          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all border ${fundEditMode === 'set' ? 'bg-[#2563EB]/10 border-[#2563EB]/30 text-[#2563EB]' : 'bg-white/5 border-border text-gray-500 hover:border-gray-600'}`}
                        >
                          Set Exact Amount
                        </button>
                      </div>

                      <div>
                        <label className="block text-gray-400 text-xs font-medium mb-1.5">
                          {fundEditMode === 'adjust' ? 'Amount (use positive to add, negative to deduct)' : 'Set balance to this exact amount ($)'}
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">$</span>
                          <input
                            type="number"
                            value={fundEditAmount}
                            onChange={(e) => setFundEditAmount(e.target.value)}
                            placeholder={fundEditMode === 'adjust' ? 'e.g. 500 or -200' : 'e.g. 10000'}
                            className="w-full bg-[#1a1a1a] border border-border rounded-lg pl-7 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#2563EB] transition-colors"
                          />
                        </div>
                      </div>

                      {fundEditMode === 'adjust' && fundEditAmount && !isNaN(parseFloat(fundEditAmount)) && parseFloat(fundEditAmount) !== 0 && (
                        <div className="bg-[#1a1a1a] rounded-lg px-4 py-3 border border-border/50">
                          <p className="text-xs text-gray-500 mb-1">Preview</p>
                          {(() => {
                            const currentWallet = userDetail.wallets?.find((w: any) => w.type === fundEditWalletType);
                            const currentBal = currentWallet?.balance || 0;
                            const amt = parseFloat(fundEditAmount);
                            const newBal = currentBal + amt;
                            return (
                              <p className={`text-sm font-semibold ${newBal < 0 ? 'text-red-400' : 'text-green-400'}`}>
                                Current: ${currentBal.toLocaleString(undefined, { minimumFractionDigits: 2 })} → New: ${newBal.toLocaleString(undefined, { minimumFractionDigits: 2 })} ({amt > 0 ? '+' : ''}{amt})
                              </p>
                            );
                          })()}
                        </div>
                      )}

                      <div className="flex items-center gap-3 pt-1">
                        <button
                          onClick={handleFundEdit}
                          disabled={fundEditLoading || !fundEditAmount || isNaN(parseFloat(fundEditAmount)) || (fundEditMode === 'adjust' && parseFloat(fundEditAmount) === 0)}
                          className={`flex-1 font-medium py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 ${
                            fundEditMode === 'set'
                              ? 'bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white'
                              : parseFloat(fundEditAmount) > 0
                                ? 'bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white'
                                : 'bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white'
                          }`}
                        >
                          {fundEditLoading ? (
                            <>
                              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                              Processing...
                            </>
                          ) : fundEditMode === 'set' ? (
                            <>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /></svg>
                              Set Balance
                            </>
                          ) : (
                            <>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></svg>
                              {parseFloat(fundEditAmount) > 0 ? 'Add Funds' : 'Deduct Funds'}
                            </>
                          )}
                        </button>
                        <button onClick={() => setFundEditAmount('')} className="px-4 py-3 bg-white/5 hover:bg-white/10 text-gray-400 text-sm rounded-xl border border-border transition-colors">
                          Clear
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Recent Deposits */}
                {userDetail.deposits && userDetail.deposits.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-white font-semibold text-sm">Recent Deposits</h4>
                    <div className="bg-[#111] border border-border rounded-xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead><tr className="border-b border-border">
                            <th className="text-left text-gray-500 font-medium px-3 py-2">Amount</th>
                            <th className="text-left text-gray-500 font-medium px-3 py-2">Method</th>
                            <th className="text-left text-gray-500 font-medium px-3 py-2">Status</th>
                            <th className="text-right text-gray-500 font-medium px-3 py-2">Date</th>
                          </tr></thead>
                          <tbody>
                            {userDetail.deposits.slice(0, 5).map((d: any) => (
                              <tr key={d.id} className="border-b border-border/50 last:border-0">
                                <td className="text-green-400 font-medium px-3 py-2">${(d.amount || 0).toLocaleString()}</td>
                                <td className="text-gray-400 px-3 py-2 capitalize">{d.method}</td>
                                <td className="px-3 py-2">{statusBadge(d.status)}</td>
                                <td className="text-gray-500 px-3 py-2 text-right">{new Date(d.createdAt).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Account Activity */}
                {userDetail.deposits && userDetail.deposits.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-white font-semibold text-sm">Account Activity</h4>
                    <div className="bg-[#111] border border-border rounded-xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead><tr className="border-b border-border">
                            <th className="text-left text-gray-500 font-medium px-3 py-2">Type</th>
                            <th className="text-left text-gray-500 font-medium px-3 py-2">Amount</th>
                            <th className="text-left text-gray-500 font-medium px-3 py-2">Date</th>
                            <th className="text-left text-gray-500 font-medium px-3 py-2">Status</th>
                          </tr></thead>
                          <tbody>
                            {userDetail.deposits.slice(0, 5).map((d: any) => (
                              <tr key={d.id} className="border-b border-border/50 last:border-0">
                                <td className="text-white font-medium px-3 py-2">Deposit</td>
                                <td className="text-blue-400 font-medium px-3 py-2">${(d.amount || 0).toLocaleString()}</td>
                                <td className="text-gray-400 px-3 py-2">{new Date(d.createdAt).toLocaleDateString()}</td>
                                <td className="px-3 py-2">{statusBadge(d.status)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-10 text-center">
                <p className="text-gray-500 text-sm">Failed to load user details</p>
              </div>
            )}
          </div>
        </div>
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-border">
          <AdminLogo />
          <span className="font-bold text-sm">CoreWealth Admin</span>
          <button className="lg:hidden ml-auto text-gray-400" onClick={() => setSidebarOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => { setActiveTab(item.key); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.key ? 'bg-[#2563EB]/10 text-[#2563EB]' : 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
              }`}
            >
              {item.icon}
              {item.label}
              {item.key === 'deposits' && stats?.pendingDeposits > 0 && (
                <span className="ml-auto bg-yellow-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{stats.pendingDeposits}</span>
              )}
              {item.key === 'withdrawals' && stats?.pendingWithdrawals > 0 && (
                <span className="ml-auto bg-yellow-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{stats.pendingWithdrawals}</span>
              )}
              {item.key === 'kyc' && stats?.pendingKyc > 0 && (
                <span className="ml-auto bg-yellow-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{stats.pendingKyc}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('adminUser'); localStorage.removeItem('user'); router.push('/admin/login'); }} className="text-gray-500 hover:text-red-400 text-xs transition-colors">
            Sign Out
          </button>
          <Link href="/" className="text-gray-500 hover:text-gray-300 text-xs block mt-2 transition-colors">
            &larr; Back to Main Site
          </Link>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <main className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border h-14 flex items-center px-4 gap-3">
          <button className="lg:hidden text-gray-400" onClick={() => setSidebarOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </button>
          <h1 className="font-semibold">{navItems.find((n) => n.key === activeTab)?.label || 'Dashboard'}</h1>
        </header>
        <div className="p-4 sm:p-6 max-w-7xl">

          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Users', value: stats?.totalUsers?.toLocaleString() || '—', color: 'text-white', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg> },
                  { label: 'Total Deposits', value: `$${(stats?.totalDeposits || 0).toLocaleString()}`, color: 'text-green-400', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></svg> },
                  { label: 'Active Accounts', value: stats?.activeInvestments?.toString() || '—', color: 'text-blue-400', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg> },
                  { label: 'Total Deposits', value: `$${(stats?.totalInvestments || 0).toLocaleString()}`, color: 'text-purple-400', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a4 4 0 0 0-8 0v2" /></svg> },
                ].map((s, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-500 text-xs font-medium">{s.label}</p>
                      <span className="text-gray-600">{s.icon}</span>
                    </div>
                    <p className={`text-lg sm:text-xl font-bold ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Pending actions row */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Pending KYC', value: stats?.pendingKyc || 0, color: 'text-yellow-400', tab: 'kyc' },
                  { label: 'Pending Deposits', value: stats?.pendingDeposits || 0, color: 'text-green-400', tab: 'deposits' },
                  { label: 'Pending Withdrawals', value: stats?.pendingWithdrawals || 0, color: 'text-red-400', tab: 'withdrawals' },
                ].map((s, i) => (
                  <button key={i} onClick={() => setActiveTab(s.tab)} className="bg-card border border-border rounded-xl p-4 text-left hover:border-gray-500 transition-colors">
                    <p className="text-gray-500 text-xs font-medium mb-1">{s.label}</p>
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  </button>
                ))}
              </div>

              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold text-sm">Recent Users</h3>
                  <button onClick={() => setActiveTab('users')} className="text-[#2563EB] text-xs hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border">
                      <th className="text-left text-gray-500 font-medium px-3 py-2">Name</th>
                      <th className="text-left text-gray-500 font-medium px-3 py-2 hidden sm:table-cell">Email</th>
                      <th className="text-left text-gray-500 font-medium px-3 py-2">Status</th>
                      <th className="text-right text-gray-500 font-medium px-3 py-2">Joined</th>
                    </tr></thead>
                    <tbody>
                      {(stats?.recentUsers || users.slice(0, 5)).map((u: any) => (
                        <tr key={u.id} className="border-b border-border/50 last:border-0">
                          <td className="text-white px-3 py-2.5 font-medium">{u.profile?.firstName || '—'} {u.profile?.lastName || ''}</td>
                          <td className="text-gray-400 px-3 py-2.5 hidden sm:table-cell">{u.email}</td>
                          <td className="px-3 py-2.5">{statusBadge(u.status)}</td>
                          <td className="text-gray-500 px-3 py-2.5 text-right text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                      {(stats?.recentUsers || users).length === 0 && (
                        <tr><td colSpan={4} className="text-center text-gray-500 py-8">No users yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or email..."
                  className="flex-1 bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#2563EB]"
                />
                <button type="submit" className="bg-card border border-border hover:border-gray-500 px-4 py-2.5 rounded-lg text-sm transition-colors">Search</button>
                <button type="button" onClick={() => { setSearchTerm(''); fetchUsers(''); }} className="bg-card border border-border hover:border-gray-500 px-4 py-2.5 rounded-lg text-sm transition-colors">Clear</button>
              </form>
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border">
                      <th className="text-left text-gray-500 font-medium px-4 py-3">Name</th>
                      <th className="text-left text-gray-500 font-medium px-4 py-3 hidden sm:table-cell">Email</th>
                      <th className="text-left text-gray-500 font-medium px-4 py-3">Status</th>
                      <th className="text-left text-gray-500 font-medium px-4 py-3 hidden md:table-cell">KYC</th>
                      <th className="text-left text-gray-500 font-medium px-4 py-3 hidden lg:table-cell">Wallets</th>
                      <th className="text-right text-gray-500 font-medium px-4 py-3">Actions</th>
                    </tr></thead>
                    <tbody>
                      {users.map((u: any) => (
                        <tr key={u.id} className="border-b border-border/50 last:border-0">
                          <td className="text-white px-4 py-3 font-medium">{u.profile?.firstName || '—'} {u.profile?.lastName || ''}</td>
                          <td className="text-gray-400 px-4 py-3 hidden sm:table-cell">{u.email}</td>
                          <td className="px-4 py-3">{statusBadge(u.status)}</td>
                          <td className="px-4 py-3 hidden md:table-cell">{statusBadge(u.kycLevel || 'LEVEL_0')}</td>
                          <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-400">
                            {u.wallets?.map((w: any) => `${w.type}: $${(w.balance||0).toLocaleString()}`).join(' | ') || '—'}
                          </td>
                          <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                            <button onClick={() => openUserDetail(u.id)} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">Edit Funds</button>
                            {u.status !== 'active' && (
                              <button onClick={() => updateUserStatus(u.id, 'active')} disabled={actionLoading === u.id} className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">Activate</button>
                            )}
                            {u.status !== 'suspended' && u.status !== 'banned' && (
                              <button onClick={() => updateUserStatus(u.id, 'suspended')} disabled={actionLoading === u.id} className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">Suspend</button>
                            )}
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && <tr><td colSpan={6} className="text-center text-gray-500 py-8">No users found</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* DEPOSITS TAB */}
          {activeTab === 'deposits' && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {['', 'pending', 'pending_verification', 'confirmed', 'rejected'].map((s) => (
                  <button key={s} onClick={() => setDepositFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${depositFilter === s ? 'border-[#2563EB] text-[#2563EB]' : 'border-border text-gray-400 hover:text-white'}`}>
                    {s || 'All'}
                  </button>
                ))}
              </div>
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border">
                      <th className="text-left text-gray-500 font-medium px-4 py-3">User</th>
                      <th className="text-left text-gray-500 font-medium px-4 py-3">Amount</th>
                      <th className="text-left text-gray-500 font-medium px-4 py-3 hidden sm:table-cell">Method</th>
                      <th className="text-left text-gray-500 font-medium px-4 py-3">Status</th>
                      <th className="text-left text-gray-500 font-medium px-4 py-3 hidden md:table-cell">Date</th>
                      <th className="text-right text-gray-500 font-medium px-4 py-3">Actions</th>
                    </tr></thead>
                    <tbody>
                      {deposits.map((d: any) => (
                        <tr key={d.id} className="border-b border-border/50 last:border-0">
                          <td className="text-white px-4 py-3">
                            <div className="font-medium">{d.user?.profile?.firstName || '—'} {d.user?.profile?.lastName || ''}</div>
                            <div className="text-gray-500 text-xs">{d.user?.email}</div>
                          </td>
                          <td className="text-green-400 font-semibold px-4 py-3">${d.amount?.toLocaleString()}</td>
                          <td className="text-gray-400 px-4 py-3 hidden sm:table-cell capitalize">{d.method?.replace('_', ' ')}</td>
                          <td className="px-4 py-3">{statusBadge(d.status)}</td>
                          <td className="text-gray-500 px-4 py-3 text-xs hidden md:table-cell">{new Date(d.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                            {(d.status === 'pending' || d.status === 'pending_verification') && (
                              <>
                                <button onClick={() => handleDepositAction(d.id, 'approve')} disabled={actionLoading === d.id} className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">Approve</button>
                                <button onClick={() => handleDepositAction(d.id, 'reject')} disabled={actionLoading === d.id} className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">Reject</button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                      {deposits.length === 0 && <tr><td colSpan={6} className="text-center text-gray-500 py-12">No deposits found</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* WITHDRAWALS TAB */}
          {activeTab === 'withdrawals' && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {['', 'pending', 'processing', 'completed', 'rejected'].map((s) => (
                  <button key={s} onClick={() => setWithdrawalFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${withdrawalFilter === s ? 'border-[#2563EB] text-[#2563EB]' : 'border-border text-gray-400 hover:text-white'}`}>
                    {s || 'All'}
                  </button>
                ))}
              </div>
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border">
                      <th className="text-left text-gray-500 font-medium px-4 py-3">User</th>
                      <th className="text-left text-gray-500 font-medium px-4 py-3">Amount</th>
                      <th className="text-left text-gray-500 font-medium px-4 py-3 hidden sm:table-cell">Destination</th>
                      <th className="text-left text-gray-500 font-medium px-4 py-3">Status</th>
                      <th className="text-left text-gray-500 font-medium px-4 py-3 hidden md:table-cell">Date</th>
                      <th className="text-right text-gray-500 font-medium px-4 py-3">Actions</th>
                    </tr></thead>
                    <tbody>
                      {withdrawals.map((w: any) => (
                        <tr key={w.id} className="border-b border-border/50 last:border-0">
                          <td className="text-white px-4 py-3">
                            <div className="font-medium">{w.user?.profile?.firstName || '—'} {w.user?.profile?.lastName || ''}</div>
                            <div className="text-gray-500 text-xs">{w.user?.email}</div>
                          </td>
                          <td className="text-red-400 font-semibold px-4 py-3">${w.amount?.toLocaleString()}</td>
                          <td className="text-gray-400 px-4 py-3 hidden sm:table-cell capitalize">{w.destinationType}</td>
                          <td className="px-4 py-3">{statusBadge(w.status)}</td>
                          <td className="text-gray-500 px-4 py-3 text-xs hidden md:table-cell">{new Date(w.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                            {w.status === 'pending' && (
                              <>
                                <button onClick={() => handleWithdrawalAction(w.id, 'approve')} disabled={actionLoading === w.id} className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">Approve</button>
                                <button onClick={() => handleWithdrawalAction(w.id, 'reject')} disabled={actionLoading === w.id} className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">Reject</button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                      {withdrawals.length === 0 && <tr><td colSpan={6} className="text-center text-gray-500 py-12">No withdrawals found</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* KYC TAB */}
          {activeTab === 'kyc' && (
            <div className="space-y-4">
              {/* ─── KYC Review Table ─── */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border">
                      <th className="text-left text-gray-500 font-medium px-4 py-3">User</th>
                      <th className="text-left text-gray-500 font-medium px-4 py-3 hidden sm:table-cell">Email</th>
                      <th className="text-left text-gray-500 font-medium px-4 py-3">Level</th>
                      <th className="text-left text-gray-500 font-medium px-4 py-3">Status</th>
                      <th className="text-left text-gray-500 font-medium px-4 py-3 hidden md:table-cell">Submitted</th>
                      <th className="text-right text-gray-500 font-medium px-4 py-3">Actions</th>
                    </tr></thead>
                    <tbody>
                      {kycList.map((k: any) => (
                        <tr key={k.id} className="border-b border-border/50 last:border-0">
                          <td className="text-white px-4 py-3 font-medium">{k.user?.profile?.firstName || '—'} {k.user?.profile?.lastName || ''}</td>
                          <td className="text-gray-400 px-4 py-3 hidden sm:table-cell">{k.user?.email}</td>
                          <td className="px-4 py-3 text-xs font-mono text-gray-300">{k.level}</td>
                          <td className="px-4 py-3">{statusBadge(k.status)}</td>
                          <td className="text-gray-500 px-4 py-3 text-xs hidden md:table-cell">{k.submittedAt ? new Date(k.submittedAt).toLocaleDateString() : '—'}</td>
                          <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                            {k.status === 'pending' && (
                              <>
                                <button onClick={() => handleKycAction(k.id, 'approve')} disabled={actionLoading === k.id} className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">Approve KYC</button>
                                <button onClick={() => handleKycAction(k.id, 'reject')} disabled={actionLoading === k.id} className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">Reject KYC</button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                      {kycList.length === 0 && <tr><td colSpan={6} className="text-center text-gray-500 py-12">No KYC submissions found</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MESSAGES TAB */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-white font-semibold mb-1 flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg>
                  Send Message to Clients
                </h3>
                <p className="text-gray-500 text-xs mb-5">Broadcast announcements, billing notices, or custom messages. Messages appear as in-app notifications and optionally as emails.</p>

                {/* Recipient toggle */}
                <div className="mb-5">
                  <label className="block text-gray-400 text-xs font-medium mb-2">Recipients</label>
                  <div className="flex gap-3">
                    <button onClick={() => setMsgBroadcast(true)} className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all border ${msgBroadcast ? 'bg-[#2563EB]/10 border-[#2563EB]/30 text-[#2563EB]' : 'bg-white/5 border-border text-gray-500 hover:border-gray-600'}`}>
                      All Users (Broadcast)
                    </button>
                    <button onClick={() => setMsgBroadcast(false)} className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all border ${!msgBroadcast ? 'bg-[#2563EB]/10 border-[#2563EB]/30 text-[#2563EB]' : 'bg-white/5 border-border text-gray-500 hover:border-gray-600'}`}>
                      Selected Users
                    </button>
                  </div>
                </div>

                {/* User picker */}
                {!msgBroadcast && (
                  <div className="mb-5">
                    <label className="block text-gray-400 text-xs font-medium mb-2">Select Users</label>
                    <div className="max-h-48 overflow-y-auto border border-border rounded-lg bg-[#111]">
                      {users.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 text-sm">No users found. They will appear here when registered.</div>
                      ) : (
                        users.map(u => (
                          <label key={u.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 cursor-pointer border-b border-border/50 last:border-0">
                            <input type="checkbox" checked={msgSelectedUsers.includes(u.id)} onChange={(e) => {
                              if (e.target.checked) setMsgSelectedUsers([...msgSelectedUsers, u.id]);
                              else setMsgSelectedUsers(msgSelectedUsers.filter(id => id !== u.id));
                            }} className="accent-[#2563EB] w-4 h-4" />
                            <span className="text-sm text-gray-300">{u.email}</span>
                            <span className="ml-auto text-[10px] text-gray-600 capitalize">{u.status}</span>
                          </label>
                        ))
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1.5">{msgSelectedUsers.length} user(s) selected</p>
                  </div>
                )}

                {/* Message type */}
                <div className="mb-5">
                  <label className="block text-gray-400 text-xs font-medium mb-2">Message Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'custom', label: 'Custom', desc: 'General message' },
                      { value: 'billing', label: 'Billing', desc: 'Payment notice' },
                      { value: 'announcement', label: 'Announcement', desc: 'Platform update' },
                    ].map(t => (
                      <button key={t.value} onClick={() => setMsgType(t.value)} className={`py-3 px-3 rounded-lg text-center transition-all border ${msgType === t.value ? 'bg-[#2563EB]/10 border-[#2563EB]/30 text-[#2563EB]' : 'bg-white/5 border-border text-gray-500 hover:border-gray-600'}`}>
                        <p className="text-sm font-medium">{t.label}</p>
                        <p className="text-[10px] text-gray-600 mt-0.5">{t.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject */}
                <div className="mb-5">
                  <label className="block text-gray-400 text-xs font-medium mb-2">Subject</label>
                  <input type="text" value={msgSubject} onChange={e => setMsgSubject(e.target.value)} placeholder="Enter message subject..." className="w-full bg-[#111] border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#2563EB] transition-colors" />
                </div>

                {/* Message body */}
                <div className="mb-5">
                  <label className="block text-gray-400 text-xs font-medium mb-2">Message</label>
                  <textarea value={msgBody} onChange={e => setMsgBody(e.target.value)} placeholder="Type your message to clients... Include billing details, payment instructions, announcements, or any important information." rows={6} className="w-full bg-[#111] border border-border rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#2563EB] transition-colors resize-none" />
                </div>

                {/* Email toggle */}
                <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-white/5 border border-border mb-6">
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg>
                    <span className="text-sm text-gray-400">Also send as email</span>
                    <span className="text-xs text-gray-600">(requires email configuration)</span>
                  </div>
                  <button onClick={() => setMsgSendEmail(!msgSendEmail)} className={`w-11 h-6 rounded-full transition-all relative ${msgSendEmail ? 'bg-[#2563EB]' : 'bg-gray-700'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${msgSendEmail ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>

                {/* Send button */}
                <button
                  onClick={async () => {
                    if (!msgSubject.trim() || !msgBody.trim()) { showToast('Subject and message are required'); return; }
                    if (!msgBroadcast && msgSelectedUsers.length === 0) { showToast('Select at least one user'); return; }
                    setMsgSending(true);
                    try {
                      const payload: any = {
                        subject: msgSubject.trim(),
                        message: msgBody.trim(),
                        type: msgType,
                        sendEmail: msgSendEmail,
                      };
                      if (msgBroadcast) payload.allUsers = true;
                      else payload.userIds = msgSelectedUsers;
                      const res = await apiCall('/api/admin/messages', { method: 'POST', body: JSON.stringify(payload) });
                      const data = await res.json();
                      if (data.success) {
                        showToast(`Message sent to ${data.data?.recipients || 0} users!`);
                        setMsgSubject(''); setMsgBody(''); setMsgSelectedUsers([]);
                      } else showToast(data.error?.message || 'Failed to send');
                    } catch { showToast('Network error'); }
                    setMsgSending(false);
                  }}
                  disabled={msgSending}
                  className="w-full bg-[#2563EB] hover:bg-[#ff1a1a] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                >
                  {msgSending ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg>
                      {msgBroadcast ? 'Broadcast to All Users' : `Send to ${msgSelectedUsers.length} User(s)`}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* AUDIT LOG TAB */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text-sm">Audit Log</h3>
                <span className="text-gray-500 text-xs">{auditTotal} total entries</span>
              </div>

              {auditLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-card border border-border rounded-lg p-4 animate-pulse">
                      <div className="flex gap-3">
                        <div className="h-4 w-24 bg-gray-700 rounded" />
                        <div className="h-4 w-16 bg-gray-700 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : auditLogs.length === 0 ? (
                <div className="bg-card border border-border rounded-xl p-10 text-center">
                  <p className="text-gray-500 text-sm">No audit log entries found.</p>
                  <p className="text-gray-600 text-xs mt-1">Admin actions will appear here as you manage users, deposits, and withdrawals.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    {auditLogs.map((log: any) => {
                      let parsedDetails: any = null;
                      try { parsedDetails = log.details ? JSON.parse(log.details) : null; } catch { /* ignore */ }

                      const actionColors: Record<string, string> = {
                        update_status: 'bg-blue-600/15 text-blue-400',
                        update_kyc_level: 'bg-purple-600/15 text-purple-400',
                        email_verify: 'bg-green-600/15 text-green-400',
                        adjust_balance: 'bg-amber-600/15 text-amber-400',
                        delete_user: 'bg-red-600/15 text-red-400',
                        approve_deposit: 'bg-green-600/15 text-green-400',
                        reject_deposit: 'bg-red-600/15 text-red-400',
                        approve_withdrawal: 'bg-green-600/15 text-green-400',
                        reject_withdrawal: 'bg-red-600/15 text-red-400',
                        approve_kyc: 'bg-green-600/15 text-green-400',
                        reject_kyc: 'bg-red-600/15 text-red-400',
                      };

                      return (
                        <div key={log.id} className="bg-card border border-border rounded-lg p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${actionColors[log.action] || 'bg-gray-600/15 text-gray-400'}`}>
                                  {log.action?.replace(/_/g, ' ') || 'Unknown'}
                                </span>
                                {log.adminEmail && (
                                  <span className="text-gray-500 text-xs">by {log.adminEmail}</span>
                                )}
                              </div>
                              {log.userEmail && (
                                <p className="text-gray-400 text-xs mt-1">Target: {log.userEmail}</p>
                              )}
                              {parsedDetails && (
                                <div className="mt-1.5 bg-[#1a1a1a] rounded px-2.5 py-1.5 text-[11px] text-gray-500 font-mono max-w-md truncate">
                                  {typeof parsedDetails === 'string' ? parsedDetails : JSON.stringify(parsedDetails)}
                                </div>
                              )}
                            </div>
                            <span className="text-gray-600 text-[10px] whitespace-nowrap shrink-0">
                              {log.createdAt ? new Date(log.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {auditTotal > 20 && (
                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => { const p = auditPage - 1; setAuditPage(p); fetchAuditLog(p); }}
                        disabled={auditPage <= 1}
                        className="px-4 py-2 rounded-lg text-xs font-semibold border border-border text-gray-400 hover:text-white hover:border-gray-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="text-gray-500 text-xs">Page {auditPage}</span>
                      <button
                        onClick={() => { const p = auditPage + 1; setAuditPage(p); fetchAuditLog(p); }}
                        disabled={auditLogs.length < 20}
                        className="px-4 py-2 rounded-lg text-xs font-semibold border border-border text-gray-400 hover:text-white hover:border-gray-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-white font-semibold text-sm">Site Settings</h3>

              {/* About Page Photo */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h4 className="text-white font-medium mb-1">About Page Photo</h4>
                <p className="text-gray-500 text-xs mb-5">Upload a photo for the About page leadership section. Max 5MB. JPG, PNG, WebP.</p>

                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <div className="w-40 h-40 rounded-2xl overflow-hidden border border-border bg-[#1a1a1a] shrink-0">
                    {settingsPhotoUrl ? (
                      <img src={settingsPhotoUrl} alt="Current About Photo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No photo set</div>
                    )}
                  </div>
                  <div className="flex flex-col gap-3 flex-1">
                    <label className="cursor-pointer inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#ff1a1a] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                      {settingsLoading ? 'Uploading...' : 'Upload Photo'}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (file.size > 5 * 1024 * 1024) { showToast('File too large. Max 5MB.'); return; }
                          setSettingsLoading(true);
                          try {
                            const fd = new FormData();
                            fd.append('photo', file);
                            fd.append('target', 'about');
                            const token = localStorage.getItem('adminToken');
                            const res = await fetch('/api/admin/settings', { method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {}, body: fd });
                            const data = await res.json();
                            if (data.success) { setSettingsPhotoUrl(data.data.aboutPhotoUrl); showToast('Photo updated!'); }
                            else showToast(data.error?.message || 'Upload failed');
                          } catch { showToast('Upload failed'); }
                          setSettingsLoading(false);
                        }}
                      />
                    </label>
                    <input type="text" placeholder="Or paste an image URL..." className="bg-[#1a1a1a] border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#2563EB] transition-colors" defaultValue={settingsPhotoUrl || ''} id="aboutUrlInput"
                      onKeyDown={async (e) => { if (e.key === 'Enter') { const url = (e.target as HTMLInputElement).value.trim(); if (!url) return; setSettingsLoading(true); try { const token = localStorage.getItem('adminToken'); const res = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ aboutPhotoUrl: url }) }); const data = await res.json(); if (data.success) { setSettingsPhotoUrl(data.data.aboutPhotoUrl); showToast('Photo URL updated!'); } else showToast(data.error?.message || 'Update failed'); } catch { showToast('Update failed'); } setSettingsLoading(false); } }}
                    />
                    <button onClick={async () => { const url = (document.getElementById('aboutUrlInput') as HTMLInputElement)?.value.trim(); if (!url) return; setSettingsLoading(true); try { const token = localStorage.getItem('adminToken'); const res = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ aboutPhotoUrl: url }) }); const data = await res.json(); if (data.success) { setSettingsPhotoUrl(data.data.aboutPhotoUrl); showToast('Photo URL updated!'); } else showToast(data.error?.message || 'Update failed'); } catch { showToast('Update failed'); } setSettingsLoading(false); }} className="bg-white/5 hover:bg-white/10 text-white text-xs font-medium px-4 py-2 rounded-lg border border-border transition-colors self-start">Save URL</button>
                  </div>
                </div>
              </div>

              {/* Bank Account Details */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-white font-medium">Bank Account Details</h4>
                  <button
                    onClick={() => { setEditingBank(null); setBankForm({ label: '', bankName: '', accountNumber: '', routingNumber: '', accountType: 'Checking', isActive: true }); setShowAddBank(true); }}
                    className="inline-flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#ff1a1a] text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    Add Account
                  </button>
                </div>
                <p className="text-gray-500 text-xs mb-4">Manage bank account details shown to users for wire transfers and deposits.</p>

                {bankAccountsLoading && bankAccounts.length === 0 ? (
                  <div className="text-center text-gray-500 py-6 text-sm">Loading accounts...</div>
                ) : bankAccounts.length === 0 && !showAddBank ? (
                  <div className="text-center text-gray-500 py-6 text-sm">No bank accounts configured. Click "Add Account" to create one.</div>
                ) : (
                  <div className="space-y-3">
                    {bankAccounts.map((acct: any) => (
                      <div key={acct.id} className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${acct.isActive ? 'bg-[#1a1a1a] border-border' : 'bg-[#111] border-border/50 opacity-50'}`}>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white text-sm font-medium">{acct.label}</span>
                            <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-[#2563EB]/10 text-[#2563EB]">{acct.accountType}</span>
                            {!acct.isActive && <span className="text-[10px] text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">Inactive</span>}
                          </div>
                          <div className="text-gray-400 text-xs">{acct.bankName} — ****{acct.accountNumber?.slice(-4)}</div>
                          <div className="text-gray-500 text-[10px] mt-0.5">Routing/SWIFT: {acct.routingNumber || '—'}</div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => { setEditingBank(acct); setBankForm({ label: acct.label, bankName: acct.bankName, accountNumber: acct.accountNumber, routingNumber: acct.routingNumber, accountType: acct.accountType, isActive: acct.isActive }); setShowAddBank(true); }}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors" title="Edit"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                          </button>
                          <button
                            onClick={async () => {
                              if (!confirm(`Delete ${acct.label} (${acct.bankName})?`)) return;
                              setBankAccountsLoading(true);
                              try {
                                const res = await apiCall(`/api/admin/bank-accounts?id=${acct.id}`, { method: 'DELETE' });
                                const data = await res.json();
                                if (data.success) { showToast('Account deleted'); fetchBankAccounts(); }
                                else showToast(data.error?.message || 'Delete failed');
                              } catch { showToast('Delete failed'); }
                              setBankAccountsLoading(false);
                            }}
                            className="p-1.5 rounded-lg hover:bg-red-900/30 text-gray-400 hover:text-red-400 transition-colors" title="Delete"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                          </button>
                          <button
                            onClick={async () => {
                              setBankAccountsLoading(true);
                              try {
                                const res = await apiCall('/api/admin/bank-accounts', { method: 'PUT', body: JSON.stringify({ id: acct.id, isActive: !acct.isActive }) });
                                const data = await res.json();
                                if (data.success) { showToast(acct.isActive ? 'Account deactivated' : 'Account activated'); fetchBankAccounts(); }
                                else showToast(data.error?.message || 'Toggle failed');
                              } catch { showToast('Toggle failed'); }
                              setBankAccountsLoading(false);
                            }}
                            className={`p-1.5 rounded-lg transition-colors ${acct.isActive ? 'hover:bg-yellow-900/30 text-green-400 hover:text-yellow-400' : 'hover:bg-green-900/30 text-gray-400 hover:text-green-400'}`} title={acct.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {acct.isActive ? (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                            ) : (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add/Edit Bank Account Form */}
                {showAddBank && (
                  <div className="mt-4 bg-[#111] border border-border rounded-xl p-4 space-y-3">
                    <h5 className="text-white text-sm font-medium">{editingBank ? 'Edit Account' : 'New Bank Account'}</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-400 text-xs font-medium mb-1">Label</label>
                        <input type="text" value={bankForm.label} onChange={e => setBankForm({ ...bankForm, label: e.target.value })} placeholder="e.g. Primary Business Account" className="w-full bg-[#1a1a1a] border border-border rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#2563EB] transition-colors" />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-xs font-medium mb-1">Bank Name</label>
                        <input type="text" value={bankForm.bankName} onChange={e => setBankForm({ ...bankForm, bankName: e.target.value })} placeholder="e.g. JPMorgan Chase" className="w-full bg-[#1a1a1a] border border-border rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#2563EB] transition-colors" />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-xs font-medium mb-1">Account Number</label>
                        <input type="text" value={bankForm.accountNumber} onChange={e => setBankForm({ ...bankForm, accountNumber: e.target.value })} placeholder="Enter account number" className="w-full bg-[#1a1a1a] border border-border rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#2563EB] transition-colors" />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-xs font-medium mb-1">Routing Number / SWIFT</label>
                        <input type="text" value={bankForm.routingNumber} onChange={e => setBankForm({ ...bankForm, routingNumber: e.target.value })} placeholder="e.g. 021000021 or CHASUS33" className="w-full bg-[#1a1a1a] border border-border rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#2563EB] transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs font-medium mb-1">Account Type</label>
                      <select value={bankForm.accountType} onChange={e => setBankForm({ ...bankForm, accountType: e.target.value })} className="w-full bg-[#1a1a1a] border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#2563EB] transition-colors">
                        <option value="Checking">Checking</option>
                        <option value="Savings">Savings</option>
                        <option value="Wire">Wire</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="bankActive" checked={bankForm.isActive} onChange={e => setBankForm({ ...bankForm, isActive: e.target.checked })} className="accent-[#2563EB]" />
                      <label htmlFor="bankActive" className="text-gray-300 text-sm">Active (visible to users)</label>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={async () => {
                          if (!bankForm.label.trim() || !bankForm.bankName.trim() || !bankForm.accountNumber.trim()) { showToast('Label, bank name, and account number are required'); return; }
                          setBankAccountsLoading(true);
                          try {
                            const method = editingBank ? 'PUT' : 'POST';
                            const body = editingBank ? { ...bankForm, id: editingBank.id } : bankForm;
                            const res = await apiCall('/api/admin/bank-accounts', { method, body: JSON.stringify(body) });
                            const data = await res.json();
                            if (data.success) {
                              showToast(editingBank ? 'Account updated!' : 'Account created!');
                              setShowAddBank(false);
                              setEditingBank(null);
                              fetchBankAccounts();
                            } else {
                              showToast(data.error?.message || 'Save failed');
                            }
                          } catch { showToast('Save failed'); }
                          setBankAccountsLoading(false);
                        }}
                        disabled={bankAccountsLoading}
                        className="bg-[#2563EB] hover:bg-[#ff1a1a] disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                      >
                        {bankAccountsLoading ? 'Saving...' : editingBank ? 'Update Account' : 'Create Account'}
                      </button>
                      <button onClick={() => { setShowAddBank(false); setEditingBank(null); }} className="bg-white/5 hover:bg-white/10 text-gray-300 text-sm px-4 py-2 rounded-lg border border-border transition-colors">Cancel</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Management Photo */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h4 className="text-white font-medium mb-1">Homepage Hero Photo (CEO Portrait)</h4>
                <p className="text-gray-500 text-xs mb-5">Upload a photo displayed on the homepage hero section. This appears as a circular portrait. Max 5MB.</p>

                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#2563EB]/30 bg-[#1a1a1a] shrink-0">
                    {managementPhotoUrl ? (
                      <img src={managementPhotoUrl} alt="Current Management Photo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No photo set</div>
                    )}
                  </div>
                  <div className="flex flex-col gap-3 flex-1">
                    <label className="cursor-pointer inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#ff1a1a] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                      {settingsLoading ? 'Uploading...' : 'Upload Management Photo'}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (file.size > 5 * 1024 * 1024) { showToast('File too large. Max 5MB.'); return; }
                          setSettingsLoading(true);
                          try {
                            const fd = new FormData();
                            fd.append('photo', file);
                            fd.append('target', 'management');
                            const token = localStorage.getItem('adminToken');
                            const res = await fetch('/api/admin/settings', { method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {}, body: fd });
                            const data = await res.json();
                            if (data.success) { setCEOPhotoUrl(data.data.managementPhotoUrl); showToast('CEO photo updated!'); }
                            else showToast(data.error?.message || 'Upload failed');
                          } catch { showToast('Upload failed'); }
                          setSettingsLoading(false);
                        }}
                      />
                    </label>
                    <input type="text" placeholder="Or paste management photo URL..." className="bg-[#1a1a1a] border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#2563EB] transition-colors" defaultValue={managementPhotoUrl || ''} id="managementUrlInput"
                      onKeyDown={(e) => { if (e.key === 'Enter') { saveCEOUrl((e.target as HTMLInputElement).value.trim()); } }}
                    />
                    <button onClick={() => saveCEOUrl()} className="bg-white/5 hover:bg-white/10 text-white text-xs font-medium px-4 py-2 rounded-lg border border-border transition-colors self-start">Save URL</button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}