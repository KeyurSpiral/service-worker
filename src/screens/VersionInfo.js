import React from "react";

const VersionInfo = ({ oldVersion, newVersion }) => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Old Version: {oldVersion}</h1>
        <h1>New Version: {newVersion}</h1>
      </header>
    </div>
  );
};

export default VersionInfo;
