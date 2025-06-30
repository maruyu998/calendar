
self.addEventListener('push', (event: any) => {
  console.log({event});
  const data = event.data.json();
  (self as any).registration.showNotification(data.title, {
    body: data.body,
    icon: data.icon
  });
});

export {}