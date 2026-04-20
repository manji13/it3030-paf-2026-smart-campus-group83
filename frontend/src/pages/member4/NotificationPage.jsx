import React, { useEffect, useState } from 'react';
import { member4Api } from '../../api/member4Api';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDateTime } from '../../utils/date';
import { useNotifications } from '../../hooks/useNotifications';

function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { refreshUnreadCount } = useNotifications();

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await member4Api.getNotifications();
      setNotifications(response.data.data || []);
    } finally {
      setLoading(false);
      refreshUnreadCount();
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markRead = async (notificationId) => {
    await member4Api.markNotificationRead(notificationId);
    await loadNotifications();
  };

  const markAll = async () => {
    await member4Api.markAllNotificationsRead();
    await loadNotifications();
  };

  return (
    <section className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0 }}>Notification Panel (member4)</h2>
        <button className="btn secondary" onClick={markAll}>
          Mark All Read
        </button>
      </div>

      {loading ? (
        <p className="muted">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p className="muted">No notifications available.</p>
      ) : (
        <div className="grid">
          {notifications.map((notification) => (
            <article key={notification.id} className="panel" style={{ background: '#fdfefe' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <h4 style={{ margin: 0 }}>{notification.title}</h4>
                  <p className="muted" style={{ margin: '0.4rem 0' }}>
                    {notification.message}
                  </p>
                  <div className="muted" style={{ fontSize: '0.85rem' }}>
                    {formatDateTime(notification.createdAt)}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <StatusBadge status={notification.isRead ? 'RESOLVED' : 'PENDING'} />
                  {!notification.isRead && (
                    <div style={{ marginTop: '0.6rem' }}>
                      <button className="btn secondary" onClick={() => markRead(notification.id)}>
                        Mark Read
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default NotificationPage;
