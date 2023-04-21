import { Helmet } from 'react-helmet-async';
import React, { useState } from 'react';
import { Grid, Container, Typography } from '@mui/material';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
// @mui
import GoogleMapReact from 'google-map-react';
import MyMarker from './MyMarker';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const points = [
    { id: 1, title: 'Round Pond', lat: 51.506, lng: -0.184 },
    { id: 2, title: 'The Long Water', lat: 51.508, lng: -0.175 },
    { id: 3, title: 'The Serpentine', lat: 51.505, lng: -0.164 },
  ];

  const [propertyType, setPropertyType] = useState(0);
  const [timeInvestor, setTimeInvestor] = useState(0);

  const onChangePropertyType = (event) => {
    setPropertyType(event.target.value);
  };

  const onChangeTimeInvestor = (event) => {
    setTimeInvestor(event.target.value);
  };

  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Dashboard
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={4} md={4} lg={4}>
            <Grid container rowSpacing={2} columnSpacing={2}>
              <Grid item xs={12} md={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label"> PropertyType </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={propertyType}
                    label="PropertyType"
                    onChange={onChangePropertyType}
                  >
                    <MenuItem value="0">Apartments for sale</MenuItem>
                    <MenuItem value="1">Houses for sale</MenuItem>
                    <MenuItem value="2">Apartments for rent</MenuItem>
                    <MenuItem value="3">Houses for rent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6} md={6}>
                <FormControl fullWidth sx={{ m: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-amount">Min(Yield on Cost (YOC))</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    startAdornment={<InputAdornment position="start">%</InputAdornment>}
                    label="Min(Yield on Cost (YOC))"
                  />
                </FormControl>
              </Grid>

              <Grid item xs={6} md={6}>
                <FormControl fullWidth sx={{ m: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-amount">Max(Yield on Cost (YOC))</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    startAdornment={<InputAdornment position="start">%</InputAdornment>}
                    label="Max(Yield on Cost (YOC))"
                  />
                </FormControl>
              </Grid>

              <Grid item xs={6} md={6}>
                <FormControl fullWidth sx={{ m: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-amount">Min(Price)</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    startAdornment={<InputAdornment position="start">€</InputAdornment>}
                    label="Min(Price)"
                  />
                </FormControl>
              </Grid>

              <Grid item xs={6} md={6}>
                <FormControl fullWidth sx={{ m: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-amount">Max(Price)</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    startAdornment={<InputAdornment position="start">€</InputAdornment>}
                    label="Max(Price)"
                  />
                </FormControl>
              </Grid>

              <Grid item xs={6} md={6}>
                <FormControl fullWidth sx={{ m: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-amount">Min(Room Number)</InputLabel>
                  <OutlinedInput id="outlined-adornment-amount" label="Min(Room Number)" />
                </FormControl>
              </Grid>

              <Grid item xs={6} md={6}>
                <FormControl fullWidth sx={{ m: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-amount">Max(Room Number)</InputLabel>
                  <OutlinedInput id="outlined-adornment-amount" label="Max(Room Number)" />
                </FormControl>
              </Grid>

              <Grid item xs={12} md={12}>
                <FormControl fullWidth sx={{ m: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-amount">City</InputLabel>
                  <OutlinedInput id="outlined-adornment-amount" label="City" />
                </FormControl>
              </Grid>

              <Grid item xs={6} md={6}>
                <FormControl fullWidth sx={{ m: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-amount">Min(Area)</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    startAdornment={<InputAdornment position="start">m2</InputAdornment>}
                    label="Min(Area)"
                  />
                </FormControl>
              </Grid>

              <Grid item xs={6} md={6}>
                <FormControl fullWidth sx={{ m: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-amount">Max(Area)</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    startAdornment={<InputAdornment position="start">m2</InputAdornment>}
                    label="Max(Area)"
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} md={12}>
                <FormControl fullWidth sx={{ m: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-amount">CaPex</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    startAdornment={<InputAdornment position="start">€</InputAdornment>}
                    label="CaPex"
                  />
                </FormControl>
              </Grid>

              <Grid item xs={6} md={6}>
                <FormControl fullWidth sx={{ m: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-amount">Min(AcqCostWithoutCapex)</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    startAdornment={<InputAdornment position="start">€</InputAdornment>}
                    label="Min(AcqCostWithoutCapex)"
                  />
                </FormControl>
              </Grid>

              <Grid item xs={6} md={6}>
                <FormControl fullWidth sx={{ m: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-amount">Max(AcqCostWithoutCapex)</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    startAdornment={<InputAdornment position="start">€</InputAdornment>}
                    label="Max(AcqCostWithoutCapex)"
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} md={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label"> Time of investment </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={timeInvestor}
                    label="Time of investment"
                    onChange={onChangeTimeInvestor}
                  >
                    <MenuItem value="0">1 year</MenuItem>
                    <MenuItem value="1">2 year</MenuItem>
                    <MenuItem value="2">3 year</MenuItem>
                    <MenuItem value="3">4 year</MenuItem>
                    <MenuItem value="3">5 year</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={8} md={8} lg={8}>
            <div style={{ height: '750px', width: '100%' }}>
              <GoogleMapReact
                bootstrapURLKeys={{
                  // remove the key if you want to fork
                  key: 'AIzaSyCctCn5BfzuPui4BHWF5IUbgvrPUnvfWKQ',
                  language: 'en',
                  region: 'US',
                }}
                defaultCenter={{ lat: 51.506, lng: -0.169 }}
                defaultZoom={15}
              >
                {points.map(({ lat, lng, id, title }) => {
                  const key = id;
                  return <MyMarker key={key} lat={lat} lng={lng} text={id} tooltip={title} />;
                })}
              </GoogleMapReact>
            </div>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
