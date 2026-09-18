import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Bell,
  CheckCircle,
  PlayCircle,
  RefreshCw,
  Sliders,
  ChevronDown,
  Scale,
  Building2,
  FileCheck,
  ShieldAlert,
  BarChart3,
  User,
  LogOut,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const {
    currentUser,
    currentRole,
    switchUserRole,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    executeRameshDemoScenario,
    resetDemoData,
  } = useApp();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read);

  const rolesList: { role: UserRole; label: string; icon: string; desc: string }[] = [
    { role: 'farmer', label: 'Farmer Portal', icon: '👨‍🌾', desc: 'Ramesh Kumar (Jaipur)' },
    { role: 'vendor', label: 'Verified Vendor', icon: '🏢', desc: 'AgriCorp Agro Flour Mills' },
    { role: 'centre_operator', label: 'Centre Operator', icon: '⚖️', desc: 'Jaipur Central Mandi' },
    { role: 'quality_inspector', label: 'Quality Inspector', icon: '🔬', desc: 'Grain Assaying Bay' },
    { role: 'district_authority', label: 'District DMO', icon: '🏛️', desc: 'District Collectorate' },
    { role: 'ministry_admin', label: 'Ministry Control Room', icon: '🇮🇳', desc: 'Krishi Bhavan, New Delhi' },
    { role: 'super_admin', label: 'Super Admin', icon: '⚙️', desc: 'System Audit & Logs' },
  ];

  const getNavLinks = () => {
    switch (currentRole) {
      case 'farmer':
        return [
          { id: 'farmer-dashboard', label: 'Farmer Dashboard' },
          { id: 'farmer-book-slot', label: 'Book Procurement Slot' },
          { id: 'farmer-queue', label: 'Live Queue Status' },
          { id: 'farmer-stocks', label: 'My Farm Stocks' },
          { id: 'farmer-transactions', label: 'Receipts & Payments' },
          { id: 'farmer-grievance', label: 'Lodge Grievance' },
        ];
      case 'vendor':
        return [
          { id: 'vendor-dashboard', label: 'Vendor Dashboard' },
          { id: 'vendor-market', label: 'Aggregated Farmer Stock' },
          { id: 'vendor-requests', label: 'Procurement Interests' },
          { id: 'vendor-prices', label: 'Commodity Price Watch' },
        ];
      case 'centre_operator':
      case 'quality_inspector':
        return [
          { id: 'centre-dashboard', label: 'Centre Live Console' },
          { id: 'centre-queue-mgmt', label: 'Token Queue Controller' },
          { id: 'centre-intake', label: 'Weighment & Assaying' },
          { id: 'centre-transactions', label: 'Completed Intakes' },
        ];
      case 'district_authority':
        return [
          { id: 'district-dashboard', label: 'District Overview' },
          { id: 'district-centres', label: 'Mandi Capacity Monitor' },
          { id: 'district-grievances', label: 'Citizen Grievances' },
          { id: 'district-audit', label: 'Audit Trail' },
        ];
      case 'ministry_admin':
      case 'super_admin':
        return [
          { id: 'ministry-dashboard', label: 'National Dashboard' },
          { id: 'doca-intelligence', label: 'DoCA Price & Market' },
          { id: 'ministry-stocks', label: 'Buffer Stock Management' },
          { id: 'ministry-alerts', label: 'Supply & Price Alerts' },
          { id: 'ministry-audit', label: 'System Audit Logs' },
        ];
      default:
        return [];
    }
  };

  return (
    <header className="w-full bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      {/* Top National Prototype Ribbon */}
      <div className="bg-slate-900 text-slate-200 text-xs px-4 py-1 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold text-[11px] border border-amber-500/30">
            SIH 2026 PROTOTYPE
          </span>
          <span className="hidden sm:inline text-slate-300">
            Demonstration Platform — Not an Official Government Portal
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={executeRameshDemoScenario}
            className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors shadow-sm"
            title="1-Click benchmark walkthrough (Ramesh Kumar - 12 Qtl Wheat)"
          >
            <PlayCircle className="w-3.5 h-3.5 text-white" />
            <span>Run Benchmark Scenario</span>
          </button>
          
          <button
            onClick={resetDemoData}
            className="flex items-center space-x-1 text-slate-400 hover:text-slate-200 text-xs transition-colors"
            title="Reset to default prototype state"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden md:inline">Reset State</span>
          </button>
        </div>
      </div>

      {/* Main Ministry Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between">
          {/* Logo & Government Identity */}
          <div className="flex items-center space-x-3.5">
            {/* National Emblem Inspired Vector Icon */}
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#0b2238] to-[#133e66] flex items-center justify-center text-white shadow-md border border-slate-300 relative overflow-hidden flex-shrink-0">
              <div className="absolute inset-x-0 top-0 h-1 bg-amber-500"></div>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-green-600"></div>
              <div className="text-center">
                <span className="text-sm font-bold tracking-tight">अ•से</span>
                <div className="w-4 h-0.5 bg-amber-400 mx-auto mt-0.5"></div>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-black tracking-tight text-slate-900 leading-tight">
                  ANNADATA SETU
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                  DoCA • GOI
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-600 leading-none mt-0.5 hidden sm:block">
                Ministry of Consumer Affairs, Food & Public Distribution • भारत सरकार
              </p>
            </div>
          </div>

          {/* Right Action Tools: Role Switcher, Notifications, Quick Profile */}
          <div className="flex items-center space-x-3">
            {/* 1-Click Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-white text-xs font-semibold text-slate-800 transition-all shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="capitalize">{currentUser.role.replace('_', ' ')}</span>
                <span className="text-slate-400 text-[11px]">({currentUser.fullName.split(' ')[0]})</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {showRoleDropdown && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1"
                  onMouseLeave={() => setShowRoleDropdown(false)}
                >
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Switch Role (7 Active Portals)
                    </p>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {rolesList.map((r) => (
                      <button
                        key={r.role}
                        onClick={() => {
                          switchUserRole(r.role);
                          setShowRoleDropdown(false);
                          // Default view per role
                          if (r.role === 'farmer') setActiveTab('farmer-dashboard');
                          else if (r.role === 'vendor') setActiveTab('vendor-dashboard');
                          else if (r.role === 'centre_operator' || r.role === 'quality_inspector') setActiveTab('centre-dashboard');
                          else if (r.role === 'district_authority') setActiveTab('district-dashboard');
                          else setActiveTab('ministry-dashboard');
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center space-x-3 hover:bg-slate-50 transition-colors ${
                          currentRole === r.role ? 'bg-blue-50/70 border-l-4 border-blue-600' : ''
                        }`}
                      >
                        <span className="text-lg">{r.icon}</span>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{r.label}</p>
                          <p className="text-[11px] text-slate-500">{r.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
                title="Notifications (In-App & Mock SMS)"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {showNotifDropdown && (
                <div
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50"
                  onMouseLeave={() => setShowNotifDropdown(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Notifications & Alerts</h4>
                      <p className="text-[10px] text-slate-500">In-App + Simulated SMS Gateway</p>
                    </div>
                    {unreadNotifs.length > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-[11px] text-blue-600 hover:underline font-semibold"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-500">No notifications</div>
                    ) : (
                      notifications.slice(0, 8).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationAsRead(n.id)}
                          className={`p-3 text-xs hover:bg-slate-50 transition cursor-pointer ${
                            !n.read ? 'bg-amber-50/40' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-slate-800">{n.title}</span>
                            <span className="text-[10px] text-slate-400">
                              {n.deliveryStatus === 'SMS Mock Sent' ? '📱 SMS' : '🔔 In-App'}
                            </span>
                          </div>
                          <p className="text-slate-600 text-[11px] leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Public Quick Links */}
            <div className="hidden lg:flex items-center space-x-2 pl-2 border-l border-slate-200">
              <button
                onClick={() => setActiveTab('public-verify')}
                className={`text-xs font-medium px-2.5 py-1 rounded transition-colors ${
                  activeTab === 'public-verify'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Verify Receipt
              </button>
              <button
                onClick={() => setActiveTab('public-transparency')}
                className={`text-xs font-medium px-2.5 py-1 rounded transition-colors ${
                  activeTab === 'public-transparency'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Transparency
              </button>
              <button
                onClick={() => setActiveTab('public-technology')}
                className={`text-xs font-medium px-2.5 py-1 rounded transition-colors ${
                  activeTab === 'public-technology'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Architecture
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Role-Specific Navigation Tabs Strip */}
      <div className="bg-slate-50 border-t border-slate-200 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-3 py-1.5">
            {getNavLinks().map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#133e66] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
