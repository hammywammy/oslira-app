/**
 * @file Social Proof Notifications
 * @description Floating notifications showing real-time activity - Elegant Professional Design
 * Path: src/features/homepage/components/SocialProofNotifications.tsx
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// =============================================================================
// TYPES
// =============================================================================

interface Notification {
  id: string;
  name: string;
  location: string;
  action: string;
  time: string;
}

// =============================================================================
// DATA
// =============================================================================

const notificationData: Omit<Notification, 'id'>[] = [
  { name: 'Sarah M.', location: 'New York', action: 'signed up', time: '2 minutes ago' },
  { name: 'Mike T.', location: 'Los Angeles', action: 'started trial', time: '5 minutes ago' },
  { name: 'Alex P.', location: 'Chicago', action: 'analyzed a lead', time: '8 minutes ago' },
  { name: 'Jordan K.', location: 'Miami', action: 'signed up', time: '12 minutes ago' }
];

// =============================================================================
// COMPONENT
// =============================================================================

export function SocialProofNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    let currentIndex = 0;
    
    const showNotification = () => {
      const data = notificationData[currentIndex];
      const notification: Notification = {
        id: `${Date.now()}-${currentIndex}`,
        ...data
      };
      
      setNotifications(prev => [...prev, notification]);
      
      // Remove after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 5000);
      
      currentIndex = (currentIndex + 1) % notificationData.length;
    };

    // Show first notification after 3 seconds
    const initialTimer = setTimeout(() => {
      showNotification();
      // Show subsequent notifications every 15 seconds
      const interval = setInterval(showNotification, 15000);
      return () => clearInterval(interval);
    }, 3000);

    return () => clearTimeout(initialTimer);
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-50 space-y-3 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.8 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl shadow-xl shadow-slate-900/10 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                {notification.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-800">
                  <span className="font-semibold">{notification.name}</span> from {notification.location} {notification.action}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{notification.time}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default SocialProofNotifications;
