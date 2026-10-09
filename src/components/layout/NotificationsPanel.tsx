import React from 'react';
import {
  Bell,
  X,
  CheckCircle2,
  AlertTriangle,
  Package,
  HeartHandshake,
  ShieldCheck,
  Clock,
  Check,
} from 'lucide-react';
import { useFoodBridge } from '../../context/FoodBridgeContext';
import { NotificationItem } from '../../types/foodbridge';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setHotelSection,
    setTrustSection,
    setActiveView,
  } = useFoodBridge();

  if (!isOpen) return null;

  // Filter notifications relevant to current user
  const userNotifications = notifications.filter((n) => {
    if (!currentUser) return true;
    const isTargetUser = n.recipientUserId === currentUser.uid;
    const isTargetRole =
      (currentUser.role === 'hotel' && n.recipientOrgType === 'Hotel') ||
      (currentUser.role === 'trust' && n.recipientOrgType === 'Trust') ||
      (currentUser.role === 'admin' && (n.recipientOrgType === 'Admin' || n.recipientOrgType === 'All'));
    return isTargetUser || isTargetRole;
  });

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'request_received':
        return <Package className="w-4 h-4 text-emerald-600" />;
      case 'request_approved':
        return <CheckCircle2 className="w-4 h-4 text-emerald-700" />;
      case 'request_rejected':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'pickup_scheduled':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'pickup_completed':
        return <HeartHandshake className="w-4 h-4 text-emerald-700" />;
      case 'org_verified':
        return <ShieldCheck className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    markNotificationRead(notif.id);
    if (currentUser?.role === 'hotel') {
      if (notif.type === 'request_received') setHotelSection('requests-pending');
      else if (notif.type === 'pickup_scheduled') setHotelSection('pickup-schedule');
      else if (notif.type === 'pickup_completed') setHotelSection('pickup-completed');
    } else if (currentUser?.role === 'trust') {
      if (notif.type === 'request_approved') setTrustSection('requests-approved');
      else if (notif.type === 'pickup_scheduled') setTrustSection('pickup-reservations');
      else if (notif.type === 'new_food_available') setTrustSection('match-recommended');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-2xs flex justify-end">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Bell className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Notifications</h2>
              <span className="text-[11px] text-slate-500">
                Live alerts for requests, pickups, and safety
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={markAllNotificationsRead}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-medium px-2 py-1 rounded hover:bg-emerald-50 transition cursor-pointer"
            >
              Mark all read
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {userNotifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Bell className="w-10 h-10 mx-auto text-slate-300 mb-2 opacity-50" />
              <p className="text-xs font-medium">No notifications yet</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Activity from surplus listings and donation requests will appear here.
              </p>
            </div>
          ) : (
            userNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-3.5 rounded-xl border text-xs transition cursor-pointer flex gap-3 items-start ${
                  notif.read
                    ? 'bg-white border-slate-200/80 hover:bg-slate-50 text-slate-600'
                    : 'bg-emerald-50/40 border-emerald-200/90 hover:bg-emerald-50/70 text-slate-900 shadow-2xs font-medium'
                }`}
              >
                <div className="p-2 rounded-lg bg-white border border-slate-200/80 shrink-0 shadow-2xs">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-900 text-xs truncate">
                      {notif.title}
                    </span>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    {notif.message}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1.5 block">
                    {new Date(notif.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
