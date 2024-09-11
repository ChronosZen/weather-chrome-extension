// TODO: content script
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Card } from '@material-ui/core';
import WeatherCard from '../components/WeatherCard';
import { getStoredOptions, LocalStorageOptions } from '../utils/storage';
import { Messages } from '../utils/messages';
import './contentScript.css';
const App: React.FC<{}> = () => {
  const [options, setOptions] = useState<LocalStorageOptions | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  useEffect(() => {
    getStoredOptions().then((options) => {
      setOptions(options);
      setIsActive(options.hasAutoOverlay);
    });
  }, []);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg === Messages.TOGGLE_OVERLAY) {
        console.log(msg);
        console.log(Messages.TOGGLE_OVERLAY);
        setIsActive(!isActive);
      }
    });
  }, [isActive]);

  if (!options) {
    return null;
  }

  return (
    <>
      {isActive && (
        <Card className="overlayCard">
          <WeatherCard
            city={options.homeCity}
            tempScale={options.tempScale}
            onDelete={() => setIsActive(false)}
          />
        </Card>
      )}
    </>
  );
};
// Creating a root container if it does not already exist in the HTML.
const rootElement = document.createElement('div');
rootElement.id = 'root'; // It's good to assign an ID for possible CSS/JS targeting
document.body.appendChild(rootElement);

// Using the new root API from React 18
const root = ReactDOM.createRoot(rootElement);

// Rendering the React component into the root container
root.render(<App />);
