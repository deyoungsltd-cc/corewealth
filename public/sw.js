// CoreWealth Bank — Service Worker
// Handles push notifications and in-app notification forwarding

const APP_ICON = '/favicon.ico';

self.addEventListener('push', (event) => {
  const data = event.data?.json() || { title: 'CoreWealth Bank', body: 'You have a new notification' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: APP_ICON,
      badge: APP_ICON,
      tag: 'corewealth-push',
      requireInteraction: false,
      vibrate: [200, 100, 200],
    })
  );
});

// Handle messages from the main app (via postMessage)
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SHOW_NOTIFICATION') {
    const { title, body } = event.data;
    self.registration.showNotification(title || 'CoreWealth Bank', {
      body: body || 'You have a new notification',
      icon: APP_ICON,
      badge: APP_ICON,
      tag: 'corewealth-notification',
      requireInteraction: false,
      vibrate: [200, 100, 200],
    });
  }
});

// When user clicks the notification, open the notifications page
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      // Try to focus an existing window first
      for (const client of clients) {
        if (client.url.includes('/notifications') && 'focus' in client) {
          return (client as any).focus();
        }
      }
      // Otherwise open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow('/notifications');
      }
    })
  );
});
