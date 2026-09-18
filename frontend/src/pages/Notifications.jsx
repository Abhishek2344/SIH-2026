import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Calendar, 
  CreditCard, 
  Loader2,
  Check
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useWebSocket } from '../context/WebSocketContext';
import api from '../services/api';

const Notifications = () => {
  const { t } = useLanguage();
  const { setUnreadCount } = useWebSocket();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = () => {
    api.get('/api/notifications?limit=50')
      .then((res) => {
        setNotifications(res.data);
        const unread = res.data.filter((n) => !n.is_read).length;
        setUnreadCount(unread);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.put('/api/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkSingleRead = async (id) => {
    try {
      await api.put(`/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type) => {
    if (type === 'token_called') return <AlertCircle className="w-5 h-5 text-purple-600" />;
    if (type === 'procurement_completed') return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    if (type === 'payment_updated') return <CreditCard className="w-5 h-5 text-emerald-600" />;
    if (type === 'booking_confirmed') return <Calendar className="w-5 h-5 text-blue-600" />;
    return <Bell className="w-5 h-5 text-farmer-600" />;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t('notifications')}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Arrival reminders, token calls, procurement updates, and payment alerts
            </p>
          </div>

          {notifications.some((n) => !n.is_read) && (
            <button
              onClick={handleMarkAllRead}
              className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-20 bg-slate-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm space-y-3">
            <Bell className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">No notifications</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You will receive real-time notifications when your slot is approaching or payments are disbursed.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.is_read && handleMarkSingleRead(n.id)}
                className={`bg-white rounded-2xl border p-4 shadow-sm transition flex items-start gap-4 cursor-pointer hover:border-slate-300 ${
                  !n.is_read ? 'border-farmer-300 bg-farmer-50/20' : 'border-slate-200'
                }`}
              >
                <div className="shrink-0 mt-0.5 p-2 bg-slate-50 rounded-xl border border-slate-100">
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
                    <span className="text-[10px] text-slate-400">
                      {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(n.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                </div>

                {!n.is_read && (
                  <span className="h-2.5 w-2.5 rounded-full bg-farmer-600 shrink-0 self-center"></span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
