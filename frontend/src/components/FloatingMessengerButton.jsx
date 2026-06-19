import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { getNotifications } from '../api/notificationsClient';
import { useAuth } from '../context/AuthContext';

function FloatingMessengerButton() {
  const { isLoggedIn, currentUser } = useAuth();
  const isAdmin = String(currentUser?.role || '').toLowerCase() === 'admin';
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!isLoggedIn) {
      setUnread(0);
      return undefined;
    }
    let alive = true;
    async function tick() {
      try {
        const n = await getNotifications();
        if (!alive) return;
        setUnread(Number(n?.unreadMessages || 0));
      } catch {
        // ignore
      }
    }
    void tick();
    const id = window.setInterval(tick, 20000);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, [isLoggedIn]);

  if (!isLoggedIn || isAdmin) return null;

  return (
    <Link
      to="/messages"
      className="fixed right-5 bottom-5 z-40 flex h-14 w-14 items-center justify-center bg-[#304826] text-white shadow-lg
        transition-colors duration-200 hover:bg-[#24381d]"
      aria-label="Open messages"
      title="Messages"
    >
      <MessageCircle size={22} />
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1.5 bg-red-500 text-white text-[10px]
          flex items-center justify-center font-bold shadow">
          {unread > 99 ? '99+' : unread}
        </span>
      )}
    </Link>
  );
}

export default FloatingMessengerButton;
