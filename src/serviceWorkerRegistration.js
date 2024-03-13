// serviceWorkerRegistration.js

export function register(config) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/sw.js`;

      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration);
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    if (config && config.onUpdate) {
                      config.onUpdate(registration);
                    }
                  } else {
                    console.log('Content is cached for offline use.');
                    if (config && config.onSuccess) {
                      config.onSuccess(registration);
                    }
                  }
                }
              };
            }
          };
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
          if (config && config.onError) {
            config.onError(error);
          }
        });
    });
  } else {
    console.log('Service Worker is not supported in this browser.');
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
    });
  }
}
