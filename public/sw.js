// this event listener is for debugging purposes
self.addEventListener("install", (event) => {
  console.log("here in service worker");
  self.skipWaiting();
  //event.waitUntil();
});

self.addEventListener("notificationclick", (event) => {
  const notification = event.notification;
  const ourKey = notification.data.ourKey;
  const action = event.action;
  if (action === "close") {
    console.log("action close for notification", ourKey);
    notification.close();
  } else if (action === "go") {
    console.log("action go for notification", ourKey);
    clients.openWindow("https://workout-logger-omega.vercel.app/");
  } else {
    notification.close();
  }
});

self.addEventListener("notificationclose", (event) => {
  const notification = event.notification;
  const ourKey = notification.data.ourKey;
  console.log("closed notification", ourKey);
});

self.addEventListener("push", (event) => {
  const title = "Web Push Notification";
  const body = event.data.text();

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: "favicon.png",
      vibrate: [100, 50, 100],
      data: { ourKey: 1 },
      requireInteraction: true,
      actions: [{ action: "go", title: "go to site" }],
    })
  );
});
