import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client'
import {
  Card,
  Box,
  Button,
  CardContent,
  Grid,
  Switch,
  TextField,
  Typography,
} from '@material-ui/core';
import 'fontsource-roboto';

import './options.css';
import {
  getStoredOptions,
  setStoredOptions,
  LocalStorageOptions,
} from '../utils/storage';

type FormState = 'ready' | 'saving';

const App: React.FC = () => {
  const [options, setOptions] = useState<LocalStorageOptions | null>(null);
  const [formState, setFormState] = useState<FormState>('ready');
  useEffect(() => {
    getStoredOptions().then((options) => setOptions(options));
  }, []);

  const handleAutoOverlayChange = (hasAutoOverlay: boolean) => {
    setOptions({
      ...options,
      hasAutoOverlay,
    });
  };

  const handleHomeCityChange = (homeCity: string) => {
    console.log(homeCity);
    setOptions({
      ...options,
      homeCity,
    });
  };

  const handleSaveButtonClick = () => {
    setFormState('saving');
    setStoredOptions(options).then(() => {
      setTimeout(() => {
        setFormState('ready');
      }, 1000);
    });
  };
  if (!options) {
    return null;
  }
  const isFieldsDisabled = formState === 'saving';
  return (
    <Box mx="10%" my="2%">
      <Card>
        <CardContent>
          <Grid container direction="column" spacing={4}>
            <Grid item>
              <Typography variant="h4">Weather Extension Options</Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1">Home city name</Typography>
              <TextField
                fullWidth
                placeholder="Enter a home city name"
                value={options.homeCity}
                disabled={isFieldsDisabled}
                onChange={(event) => handleHomeCityChange(event.target.value)}
              />
            </Grid>
            <Grid item>
              <Typography variant="body1">Overlay Toggle on webpage</Typography>
              <Switch
                color="primary"
                checked={options.hasAutoOverlay}
                onChange={(event, checked) => handleAutoOverlayChange(checked)}
                disabled={isFieldsDisabled}
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                disabled={isFieldsDisabled}
                onClick={handleSaveButtonClick}>
                {formState === 'ready' ? 'Save' : 'Saving...'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
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
