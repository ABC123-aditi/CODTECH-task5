if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.log('Service Worker registration failed:', error);
        });
    });
  }
  if ('Notification' in window && 'PushManager' in window) {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        subscribeUserToPush();
      }
    });
  }
  
  function subscribeUserToPush() {
    navigator.serviceWorker.ready.then(serviceWorkerRegistration => {
      serviceWorkerRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: '<YOUR_VAPID_PUBLIC_KEY>'
      })
      .then(subscription => {
        console.log('User is subscribed:', subscription);
        // Send the subscription to your server
      })
      .catch(error => {
        console.error('Failed to subscribe the user:', error);
      });
    });
  }
    