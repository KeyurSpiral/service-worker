import React, { useEffect, useState } from "react";

const Location = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === "location") {
        setLocation({
          latitude: event.data.latitude,
          longitude: event.data.longitude,
        });
      }
    };

    navigator.serviceWorker.addEventListener("message", handleMessage);

    return () => {
      navigator.serviceWorker.removeEventListener("message", handleMessage);
    };
  }, []);

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          setError("Unable to retrieve your location");
          console.error("Error getting location:", error);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  };

  return (
    <div>
      <div className="App">
        <header className="App-header">
          <div>
            <h1>React Get Location Access Example</h1>
            <button onClick={handleGetLocation}>Get Location</button>
            <br />
            <br />
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
