import React, { useEffect, useState } from "react";

const Location = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const handleGetLocation = () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.controller.postMessage("getLocation");
    }
  };

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === "location") {
        setLocation({
          latitude: event.data.latitude,
          longitude: event.data.longitude,
        });
      }
    };

    const handleGeolocationError = (error) => {
      setError(error.message);
    };

    navigator.serviceWorker.addEventListener("message", handleMessage);
    navigator.geolocation.getCurrentPosition(() => {}, handleGeolocationError);

    return () => {
      navigator.serviceWorker.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div>
      <div className="App">
        <header className="App-header">
          <div>
            <h1>React Get Location Access Example</h1>
            <button onClick={handleGetLocation}>Get Location</button>
            {location && (
              <div>
                <h3>Latitude: {location.latitude}</h3>
                <br />
                <h3>Longitude: {location.longitude}</h3>
              </div>
            )}
          </div>
        </header>
      </div>
    </div>
  );
};

export default Location;
