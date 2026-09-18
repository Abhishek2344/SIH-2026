import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Sprout, 
  MapPin, 
  Calendar, 
  Clock, 
  FileText, 
  CreditCard, 
  Bell, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Globe, 
  Shield, 
  LayoutDashboard,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useWebSocket } from '../context/WebSocketContext';
import api from '../services/api';

const Navbar = () => {
  const { user, isAuthenticated, isFarmer, isStaff, isAdmin, logout } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const { unreadCount, setUnreadCount, latestAlert } = useWebSocket();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  const notifRef = useRef(null);
  const userRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch initial notifications if logged in
  useEffect(() => {
    if (isAuthenticated) {
      api.get('/api/notifications?limit=5')
        .then((res) => {
          setNotifications(res.data);
          const unread = res.data.filter((n) => !n.is_read).length;
          setUnreadCount(unread);
        })
        .catch((err) => console.error("Error fetching notifications", err));
    }
  }, [isAuthenticated]);

  // Update notification list when WebSocket alert arrives
  useEffect(() => {
    if (latestAlert) {
      setNotifications((prev) => [latestAlert, ...prev.slice(0, 4)]);
    }
  }, [latestAlert]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.put('/api/notifications/read-all');
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top emergency & language strip */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>🇮🇳 Govt. of India Digital Procurement Initiative</span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-emerald-400 font-medium">Toll Free: 1800-180-1551</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-0.5 rounded-full text-xs font-medium border border-slate-700 transition"
              title="Switch language between English and Hindi"
            >
              <Globe className="w-3.5 h-3.5 text-farmer-400" />
              <span>{lang === 'en' ? 'हिन्दी (Hindi)' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-farmer-600 flex items-center justify-center text-white shadow-md shadow-farmer-600/20 group-hover:bg-farmer-700 transition">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 tracking-tight block leading-tight">
                {t('appName')}
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide block uppercase">
                {t('appSubTitle')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive('/') ? 'bg-farmer-50 text-farmer-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t('home')}
            </Link>

            <Link
              to="/centres"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive('/centres') ? 'bg-farmer-50 text-farmer-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t('centres')}
            </Link>

            {/* Farmer Links */}
            {(!isAuthenticated || isFarmer) && (
              <>
                <Link
                  to="/book-slot"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive('/book-slot') ? 'bg-farmer-50 text-farmer-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {t('bookSlot')}
                </Link>

                <Link
                  to="/live-queue"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                    isActive('/live-queue') ? 'bg-farmer-50 text-farmer-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  {t('liveQueue')}
                </Link>

                {isAuthenticated && (
                  <>
                    <Link
                      to="/my-bookings"
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        isActive('/my-bookings') ? 'bg-farmer-50 text-farmer-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      {t('myBookings')}
                    </Link>

                    <Link
                      to="/procurement"
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        isActive('/procurement') ? 'bg-farmer-50 text-farmer-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      {t('procurement')}
                    </Link>

                    <Link
                      to="/payments"
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        isActive('/payments') ? 'bg-farmer-50 text-farmer-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      {t('payments')}
                    </Link>
                  </>
                )}
              </>
            )}

            {/* Staff Links */}
            {isStaff && (
              <Link
                to="/staff/dashboard"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                  isActive('/staff/dashboard') ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Shield className="w-4 h-4 text-emerald-600" />
                {t('staffPortal')}
              </Link>
            )}

            {/* Admin Links */}
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                  isActive('/admin/dashboard') ? 'bg-purple-50 text-purple-800 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-purple-600" />
                {t('adminPortal')}
              </Link>
            )}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 md:gap-3">
            {isAuthenticated ? (
              <>
                {/* Notification Dropdown */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full relative transition"
                    aria-label="View notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                        <span className="font-semibold text-sm text-slate-900">{t('notifications')}</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-xs text-farmer-700 hover:underline font-medium"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-500">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              className={`p-3 hover:bg-slate-50 transition text-left flex gap-2.5 ${
                                !n.is_read ? 'bg-farmer-50/50' : ''
                              }`}
                            >
                              <div className="shrink-0 mt-0.5">
                                {n.type === 'token_called' ? (
                                  <AlertCircle className="w-4 h-4 text-purple-600" />
                                ) : n.type === 'procurement_completed' ? (
                                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Bell className="w-4 h-4 text-farmer-600" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                                <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="px-4 pt-2 border-t border-slate-100 text-center">
                        <Link
                          to="/notifications"
                          onClick={() => setNotifDropdownOpen(false)}
                          className="text-xs text-farmer-700 font-medium hover:underline block"
                        >
                          View all notifications →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu Dropdown */}
                <div className="relative" ref={userRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 md:px-3 md:py-1.5 rounded-full hover:bg-slate-100 border border-slate-200 transition"
                  >
                    <div className="w-7 h-7 rounded-full bg-farmer-100 text-farmer-700 flex items-center justify-center font-bold text-xs">
                      {user?.farmer_profile?.full_name?.[0] || user?.staff_profile?.full_name?.[0] || user?.role?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden md:block text-xs font-semibold text-slate-800">
                      {user?.farmer_profile?.full_name || user?.staff_profile?.full_name || user?.email || user?.mobile}
                    </span>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {user?.farmer_profile?.full_name || user?.staff_profile?.full_name || "User Account"}
                        </p>
                        <p className="text-[10px] text-slate-500 capitalize">Role: {user?.role}</p>
                        {user?.farmer_profile?.farmer_id && (
                          <span className="inline-block mt-1 text-[10px] bg-farmer-100 text-farmer-800 font-mono font-semibold px-1.5 py-0.5 rounded">
                            {user.farmer_profile.farmer_id}
                          </span>
                        )}
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        {t('profile')}
                      </Link>

                      {isFarmer && (
                        <Link
                          to="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400" />
                          Dashboard
                        </Link>
                      )}

                      {isStaff && (
                        <Link
                          to="/staff/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                        >
                          <Shield className="w-4 h-4 text-slate-400" />
                          Staff Queue Dashboard
                        </Link>
                      )}

                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400" />
                          Admin Console
                        </Link>
                      )}

                      <div className="border-t border-slate-100 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        {t('logout')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs md:text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-2 text-xs md:text-sm font-semibold bg-farmer-600 hover:bg-farmer-700 text-white rounded-lg shadow-sm shadow-farmer-600/20 transition"
                >
                  {t('register')}
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-2 pb-6 space-y-1 shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {t('home')}
          </Link>
          <Link
            to="/centres"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {t('centres')}
          </Link>
          <Link
            to="/book-slot"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {t('bookSlot')}
          </Link>
          <Link
            to="/live-queue"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {t('liveQueue')}
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/my-bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {t('myBookings')}
              </Link>
              <Link
                to="/procurement"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {t('procurement')}
              </Link>
              <Link
                to="/payments"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {t('payments')}
              </Link>
            </>
          )}

          {isStaff && (
            <Link
              to="/staff/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-bold text-emerald-800 bg-emerald-50"
            >
              {t('staffPortal')}
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-bold text-purple-800 bg-purple-50"
            >
              {t('adminPortal')}
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
