import React, { useState } from "react";

const Push = () => {
  const [notificationPermission, setNotificationPermission] = useState(
    Notification.permission
  );

  const handlePushNotification = () => {
    if (notificationPermission === "granted") {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification("New Message", {
            body: "You have a new message!",
            icon: "/icon.png",
            badge: "/badge.png",
          });
        });
      }
    } else if (notificationPermission === "denied") {
      console.error("Permission for notifications was denied");
      showNotificationPermissionDeniedMessage();
    } else {
      Notification.requestPermission().then((permission) => {
        setNotificationPermission(permission);
        if (permission === "granted") {
          // Permission granted, proceed to show notification
          handlePushNotification();
        } else {
          console.error("Permission for notifications was denied");
        }
      });
    }
  };

  const showNotificationPermissionDeniedMessage = () => {
    // You can display a message or a button here to direct users to enable notifications in their browser settings
    alert(
      "Permission for notifications was denied. Please enable notifications in your browser settings to receive notifications."
    );
  };
  return (
    <div>
      <div className="App">
        <header className="App-header">
          <div>
            <h1>React Push Notification Example</h1>
            <button onClick={handlePushNotification}>Send Notification</button>
          </div>
        </header>
      </div>
    </div>
  );
};

export default Push;