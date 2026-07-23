// Service Worker fallback to prevent 404 console warnings from browser extensions or stale PWA registrations
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
