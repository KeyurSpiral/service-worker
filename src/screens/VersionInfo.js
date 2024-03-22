import React from "react";

const VersionInfo = ({ oldVersion, newVersion }) => {
  return (
    <div className="App">
      <header className="App-header">
        <p>Old Version: {oldVersion}</p>
        <p>New Version: {newVersion}</p>
      </header>
    </div>
  );
};

export default VersionInfo;
