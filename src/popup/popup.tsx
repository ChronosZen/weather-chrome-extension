import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client'
import { Box, Grid, InputBase, IconButton, Paper } from '@material-ui/core';
import {
  Add as AddIcon,
  PictureInPicture as PictureIcon,
} from '@material-ui/icons';

import 'fontsource-roboto';
import './popup.css';
import WeatherCard from '../components/WeatherCard';
import {
  setStoredCities,
  setStoredOptions,
  getStoredOptions,
  getStoredCities,
  LocalStorage,
  LocalStorageOptions,
} from '../utils/storage';
import { Messages } from '../utils/messages';

const App: React.FC = ({}) => {
  const [cities, setCities] = useState<string[]>([]);
  const [cityInput, setCityInput] = useState<string>('');
  const [options, setOptions] = useState<LocalStorageOptions | null>(null);
  useEffect(() => {
    getStoredCities().then((cities) => {
      console.log(cities);
      setCities(cities);
    });
    getStoredOptions().then((options) => setOptions(options));
  }, []);

  const handleCityButtonClick = () => {
    if (cityInput === '') {
      return;
    }
    const updatedCities = [...cities, cityInput];
    setStoredCities(updatedCities).then(() => {
      setCities(updatedCities);
      setCityInput('');
    });
  };

  const handleCityDeleteButtonClick = (index: number) => {
    cities.splice(index, 1);
    const updatedCities = [...cities];
    setStoredCities(updatedCities).then(() => {
      setCities(updatedCities);
    });
  };

  const handleTempScaleButtonClick = () => {
    const updateOptions: LocalStorageOptions = {
      ...options,
      tempScale: options.tempScale === 'metric' ? 'imperial' : 'metric',
    };
    setStoredOptions(updateOptions).then(() => {
      setOptions(updateOptions);
    });
  };
  const handleOverlayButton = () => {
    chrome.tabs.query(
      {
        active: true,
      },
      (tabs) => {
        if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, Messages.TOGGLE_OVERLAY);
        }
      }
    );
  };
  if (!options) {
    return null;
  }

  return (
    <Box mx="8px" my="16px">
      <Grid container justifyContent="space-evenly">
        <Grid item>
          <Paper>
            <Box px="15px" py="5px">
              <InputBase
                placeholder="Add a city name"
                value={cityInput}
                onChange={(event) => setCityInput(event.target.value)}
              />
              <IconButton onClick={handleCityButtonClick}>
                <AddIcon />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
        <Grid item>
          <Paper>
            <Box py="4px">
              <IconButton onClick={handleTempScaleButtonClick}>
                {options.tempScale === 'metric' ? '\u2103' : '\u2109'}
              </IconButton>
            </Box>
          </Paper>
        </Grid>
        <Grid item>
          <Paper>
            <Box py="4px">
              <IconButton onClick={handleOverlayButton}>
                <PictureIcon />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      {options.homeCity != '' && (
        <WeatherCard city={options.homeCity} tempScale={options.tempScale} />
      )}
      {cities.map((city, index) => (
        <WeatherCard
          city={city}
          tempScale={options.tempScale}
          key={index}
          onDelete={() => {
            handleCityDeleteButtonClick(index);
          }}
        />
      ))}
      <Box height="16px" />
    </Box>
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
