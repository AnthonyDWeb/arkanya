const CACHE_NAME = "arkcare-v6";
const STATIC_CACHE_URLS = ["/", "/manifest.webmanifest"];
const reminderTimers = new Map();

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_CACHE_URLS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
    }),
  );
  self.clients.claim();
});

self.addEventListener("message", (event) => {
  if (event.data?.type !== "MEDTRACK_SCHEDULE") return;
  scheduleReminders(event.data.reminders || []);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(openApp(event.notification.data?.url || "/doses"));
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  if (requestUrl.pathname === "/app-version.json") {
    event.respondWith(fetch(event.request, { cache: "no-store" }));
    return;
  }

  if (event.request.mode === "navigate" || requestUrl.pathname === "/manifest.webmanifest") {
    event.respondWith(networkFirst(event.request));
    return;
  }

  event.respondWith(cacheFirst(event.request));
});

function scheduleReminders(reminders) {
  const ids = new Set(reminders.map((reminder) => reminder.id));
  reminderTimers.forEach((timer, id) => {
    if (!ids.has(id)) {
      clearTimeout(timer);
      reminderTimers.delete(id);
    }
  });

  reminders.forEach((reminder) => {
    if (reminderTimers.has(reminder.id)) return;
    const delay = new Date(reminder.scheduledAt).getTime() - Date.now();
    if (delay <= 0) return;
    const timer = setTimeout(() => showReminder(reminder), delay);
    reminderTimers.set(reminder.id, timer);
  });
}

function showReminder(reminder) {
  reminderTimers.delete(reminder.id);
  self.registration.showNotification(`Il est temps de prendre : ${reminder.treatmentName}`, {
    body: "Ouvrez ArkCare pour valider la prise.",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    tag: `arkcare-${reminder.id}`,
    renotify: true,
    data: { url: "/doses" },
  });
}

async function openApp(url) {
  const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  const existing = windows.find((client) => "focus" in client);
  if (existing) {
    await existing.focus();
    return existing.navigate(url);
  }
  return self.clients.openWindow(url);
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch {
    return (await cache.match(request)) || cache.match("/");
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}
