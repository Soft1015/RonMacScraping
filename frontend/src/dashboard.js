import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, DrawingManager } from "@react-google-maps/api";
import Marker from "./marker"
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  Grid,
  InputAdornment,
  Button,
  Popover,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  IconButton
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ScaleLoader from "react-spinners/ScaleLoader";
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';
const mapContainerStyle = {
  height: "100%",
  width: "100%",
};

const center = {
  lat: 55.7755801,
  lng: -4.8580114,
};

const options = {
  drawingControl: false,
  drawingControlOptions: {
    drawingModes: ["marker"],
  },
  polygonOptions: {
    fillColor: `#2196F3`,
    strokeColor: `#2196F3`,
    fillOpacity: 0.5,
    strokeWeight: 2,
    clickable: true,
    editable: true,
    draggable: true,
    zIndex: 1,
  },
};

const style = {
  display: "flex",
  height: "86vh",
};

const groupStyle = {
  display: "flex",
};

const formStyle = {
  backgroundColor: "white",
  position: "absolute",
  zIndex: "5",
  width: "430px",
  left: "5%",
  top: "20%",
  boxShadow: `0px 0px 8px 0px #999999`,
};

const formResultStyle = {
  backgroundColor: "white",
  position: "absolute",
  zIndex: "5",
  width: "430px",
  left: "5%",
  top: "20%",
  boxShadow: `0px 0px 8px 0px #999999`,
  maxHeight: "600px",
  overflowY: "auto",
  overflowX: "hidde",
};

const searchButtonStyle = {
  width: "40px",
  height: "40px",
  marginTop: "10px",
  marginLeft: "10px",
  backgroundColor: "#0f2761",
  border: "none",
  color: "white",
  cursor: "pointer",
};


const maxLength = 5;
const Dashboard = () => {
  const [showingResult, setShowState] = useState(0);
  const [open, setOpen] = useState(false);

  const [MarkInfos, setMarkInfo] = useState([]);
  const [dealInfo, setDealInfo] = useState([]);
  const [isLoading, setLoadingState] = useState(false);
  const [postcode, setPostcode] = useState("");

  const [propertyType, setPropertyType] = useState(0);
  const [timeInvestor, setTimeInvestor] = useState(0);
  const [flatInfos, setFlatInfo] = useState([]);
  const [filterData, setFilterData] = useState([]);


  const onChangeTimeInvestor = (event) => {
    setTimeInvestor(event.target.value);
  };

  const onChangePropertyType = (event) => {
    setPropertyType(event.target.value);
  };

  const onLoad = (drawingManager) => {
    // console.log(drawingManager);
  };

  const onSearch = () => {
    filter();
    setShowState(1);
  };

  const filter = async () => {
    let data = MarkInfos.filter(function (item) {
      if (item.type !== currType) return false;
      return true;
    });
    if (postcode != "") {
      data.sort(async function (a, b) {
        const dis1 = await getDistance(postcode, a.postcode);
        const dis2 = await getDistance(postcode, b.postcode);
        return dis1 - dis2;
      });
      data.splice(maxLength);
    }
    setDealInfo(data);
  };

  const onMarkerComplete = (marker) => {
    marker.setMap(null);
    // console.log(marker);
  };

  const onPolygonComplete = (polygon) => {
    // console.log(polygon);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => { }, [dealInfo]);

  const getData = async () => {
    fetch("http://localhost:3300/items")
      .then((response) => response.json())
      .then((data) => {
        setFlatInfo(data);
        setFilterData(data);
      })
      .catch((error) => {
      });
  };

  /**
   * Menu
   */
  //YOC
  const [anchorYocEl, setAnchorYocEl] = useState(null);
  const handleYocClose = () => {
    setAnchorYocEl(null);
  };

  const handleYocClick = (event) => {
    setAnchorYocEl(event.currentTarget);
  };
  //Price
  const [anchorPriceEl, setAnchorPriceEl] = useState(null);
  const handlePriceClose = () => {
    setAnchorPriceEl(null);
  };

  const handlePriceClick = (event) => {
    setAnchorPriceEl(event.currentTarget);
  };
  //Room Number
  const [anchorRmNumEl, setAnchorRmNumEl] = useState(null);
  const handleRmNumClose = () => {
    setAnchorPriceEl(null);
  };

  const handleRmNumClick = (event) => {
    setAnchorRmNumEl(event.currentTarget);
  };
  //Area
  const [anchorAreaEl, setAnchorAreaEl] = useState(null);
  const handleAreaClose = () => {
    setAnchorAreaEl(null);
  };

  const handleAreaClick = (event) => {
    setAnchorAreaEl(event.currentTarget);
  };
  //Acq Cost
  const [anchorAcqEl, setAnchorAcqEl] = useState(null);
  const handleAcqClose = () => {
    setAnchorAcqEl(null);
  };

  const handleAcqClick = (event) => {
    setAnchorAcqEl(event.currentTarget);
  };
  //Time Setting
  const [anchorTimeEl, setAnchorTimeEl] = useState(null);
  const handleTimeClose = () => {
    setAnchorTimeEl(null);
  };

  const handleTimeClick = (event) => {
    setAnchorTimeEl(event.currentTarget);
  };
  /**
   * end Menu
   */

  return (
    <LoadScript
      id="script-loader"
      googleMapsApiKey="AIzaSyCctCn5BfzuPui4BHWF5IUbgvrPUnvfWKQ"
      libraries={["drawing"]}
    >
      {isLoading ? (
        <div style={{ top: "50%", position: "absolute", left: "50%" }}>
          <ScaleLoader color="#36d7b7" />
        </div>
      ) : (
        <>
          <h2>Google Map Dealer</h2>
          <hr />
          <Grid container spacing={0.5} sx={{ p: 1 }}>
            <Grid xs={1.3} sx={{ ml: 1.5 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  PropertyType
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  style={{ width: "100%" }}
                  size="small"
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
            <Grid xs={1} sx={{ ml: 1.5 }}>
              <div>
                <Button
                  variant="outlined"
                  style={{ height: '40px', color: 'black', fontWeight: 'normal', borderColor: 'gray', width: '100%', justifyContent: 'space-between' }}
                  onClick={handleYocClick}
                  endIcon={<KeyboardArrowDownIcon />}
                >
                  YOC Range
                </Button>
                <Popover
                  open={Boolean(anchorYocEl)}
                  anchorEl={anchorYocEl}
                  onClose={handleYocClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                >
                  <div>
                    <p className="popup-menu-header">Yield on cost</p>
                    <Grid container style={{ justifyContent: 'space-between' }} sx={{ p: 1.5 }}>
                      <Grid item xs={5.8} md={5.8}>
                        <FormControl>
                          <InputLabel htmlFor="outlined-adornment-amount">Min</InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-amount"
                            size="small"
                            startAdornment={<InputAdornment position="start">%</InputAdornment>}
                            label="Min"
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={5.8} md={5.8}>
                        <FormControl>
                          <InputLabel htmlFor="outlined-adornment-amount">Max</InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-amount"
                            size="small"
                            startAdornment={<InputAdornment position="start">%</InputAdornment>}
                            label="Max"
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </div>
                </Popover>
              </div>
            </Grid>
            <Grid xs={1} sx={{ ml: 1.5 }}>
              <div>
                <Button
                  variant="outlined"
                  style={{ height: '40px', color: 'black', fontWeight: 'normal', borderColor: 'gray', width: '100%', justifyContent: 'space-between' }}
                  onClick={handlePriceClick}
                  endIcon={<KeyboardArrowDownIcon />}
                >
                  Price
                </Button>
                <Popover
                  open={Boolean(anchorPriceEl)}
                  anchorEl={anchorPriceEl}
                  onClose={handlePriceClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                >
                  <div>
                    <p className="popup-menu-header">Price</p>
                    <Grid container style={{ justifyContent: 'space-between' }} sx={{ p: 1.5 }}>
                      <Grid item xs={5.8} md={5.8}>
                        <FormControl>
                          <InputLabel htmlFor="outlined-adornment-amount">Min</InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-amount"
                            size="small"
                            startAdornment={<InputAdornment position="start">€</InputAdornment>}
                            label="Min"
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={5.8} md={5.8}>
                        <FormControl>
                          <InputLabel htmlFor="outlined-adornment-amount">Max</InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-amount"
                            size="small"
                            startAdornment={<InputAdornment position="start">€</InputAdornment>}
                            label="Max"
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </div>
                </Popover>
              </div>
            </Grid>
            <Grid xs={1.2} sx={{ ml: 1.5 }}>
              <div>
                <Button
                  variant="outlined"
                  style={{ height: '40px', color: 'black', fontWeight: 'normal', borderColor: 'gray', width: '100%', justifyContent: 'space-between' }}
                  onClick={handleRmNumClick}
                  endIcon={<KeyboardArrowDownIcon />}
                >
                  Room Number
                </Button>
                <Popover
                  open={Boolean(anchorRmNumEl)}
                  anchorEl={anchorRmNumEl}
                  onClose={handleRmNumClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                >
                  <div>
                    <p className="popup-menu-header">Room Number</p>
                    <Grid container style={{ justifyContent: 'space-between' }} sx={{ p: 1.5 }}>
                      <Grid item xs={5.8} md={5.8}>
                        <FormControl>
                          <InputLabel htmlFor="outlined-adornment-amount" size="small">Min</InputLabel>
                          <OutlinedInput id="outlined-adornment-amount" size="small" label="Min" />
                        </FormControl>
                      </Grid>

                      <Grid item xs={5.8} md={5.8}>
                        <FormControl>
                          <InputLabel htmlFor="outlined-adornment-amount" size="small">Min</InputLabel>
                          <OutlinedInput id="outlined-adornment-amount" size="small" label="Min" />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </div>
                </Popover>
              </div>
            </Grid>
            <Grid xs={1} sx={{ ml: 1.5 }}>
              <div>
                <Button
                  variant="outlined"
                  style={{ height: '40px', color: 'black', fontWeight: 'normal', borderColor: 'gray', width: '100%', justifyContent: 'space-between' }}
                  onClick={handleAreaClick}
                  endIcon={<KeyboardArrowDownIcon />}
                >
                  Area
                </Button>
                <Popover
                  open={Boolean(anchorAreaEl)}
                  anchorEl={anchorAreaEl}
                  onClose={handleAreaClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                >
                  <div>
                    <p className="popup-menu-header">Area</p>
                    <Grid container style={{ justifyContent: 'space-between' }} sx={{ p: 1.5 }}>
                      <Grid item xs={5.8} md={5.8}>
                        <FormControl>
                          <InputLabel htmlFor="outlined-adornment-amount">Min</InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-amount"
                            size="small"
                            startAdornment={<InputAdornment position="start">m²</InputAdornment>}
                            label="Min"
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={5.8} md={5.8}>
                        <FormControl>
                          <InputLabel htmlFor="outlined-adornment-amount">Max</InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-amount"
                            size="small"
                            startAdornment={<InputAdornment position="start">m²</InputAdornment>}
                            label="Max"
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </div>
                </Popover>
              </div>
            </Grid>
            <Grid xs={1} sx={{ ml: 1.5 }}>
              <FormControl fullWidth>
                <InputLabel htmlFor="outlined-adornment-amount">Capex</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  size="small"
                  startAdornment={<InputAdornment position="start">€</InputAdornment>}
                  label="Capex"
                />
              </FormControl>
            </Grid>
            <Grid xs={1.5} sx={{ ml: 1.5 }}>
              <div>
                <Button
                  variant="outlined"
                  style={{ height: '40px', color: 'black', fontWeight: 'normal', borderColor: 'gray' }}
                  onClick={handleAcqClick}
                  endIcon={<KeyboardArrowDownIcon />}
                >
                  AcqCostWithoutCapex
                </Button>
                <Popover
                  open={Boolean(anchorAcqEl)}
                  anchorEl={anchorAcqEl}
                  onClose={handleAcqClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                >
                  <div>
                    <p className="popup-menu-header">AcqCostWithoutCapex</p>
                    <Grid container style={{ justifyContent: 'space-between' }} sx={{ p: 1.5 }}>
                      <Grid item xs={5.8} md={5.8}>
                        <FormControl>
                          <InputLabel htmlFor="outlined-adornment-amount">Min</InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-amount"
                            size="small"
                            startAdornment={<InputAdornment position="start">€</InputAdornment>}
                            label="Min"
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={5.8} md={5.8}>
                        <FormControl>
                          <InputLabel htmlFor="outlined-adornment-amount">Max</InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-amount"
                            size="small"
                            startAdornment={<InputAdornment position="start">€</InputAdornment>}
                            label="Max"
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </div>
                </Popover>
              </div>
            </Grid>
            <Grid xs={1} sx={{ ml: 1.5 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Time
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  style={{ width: "100%" }}
                  size="small"
                  value={timeInvestor}
                  label="Time"
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
            <Grid xs={1} sx={{ ml: 1.5 }}>
              <OutlinedInput
                id="outlined-adornment-weight"
                aria-describedby="outlined-weight-helper-text"
                size="small"
                placeholder="Enter location"
                onChange={(e) => setPostcode(e.target.value)}
                value={postcode}
              />
            </Grid>
            <Button sx={{ ml: 1.5 }} variant="outlined" style={{ color: 'black', fontWeight: 'normal', borderColor: 'gray' }} startIcon={<SearchIcon />}>
              Search
            </Button>
            <IconButton
              aria-label="send"
              sx={{ ml: 1.5 }}
              onClick={handleTimeClick}
            >
              <AccessAlarmsIcon />
            </IconButton>
            <Popover
                  open={Boolean(anchorTimeEl)}
                  anchorEl={anchorTimeEl}
                  onClose={handleTimeClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                >
                  <div>
                    <p className="popup-menu-header">Time Setting</p>
                    <Grid container style={{ justifyContent: 'space-between' }} sx={{ p: 1.5 }}>
                      <Grid item xs={5.8} md={5.8}>
                        <FormControl>
                          <InputLabel htmlFor="outlined-adornment-amount">Min</InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-amount"
                            size="small"
                            startAdornment={<InputAdornment position="start">%</InputAdornment>}
                            label="Min"
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={5.8} md={5.8}>
                        <FormControl>
                          <InputLabel htmlFor="outlined-adornment-amount">Max</InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-amount"
                            size="small"
                            startAdornment={<InputAdornment position="start">%</InputAdornment>}
                            label="Max"
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </div>
                </Popover>
          </Grid>
          <div style={style}>
            <div style={{ width: "60%" }}>
              <GoogleMap
                id="drawing-manager-example"
                mapContainerStyle={mapContainerStyle}
                zoom={5}
                center={center}
              >
                <DrawingManager
                  onLoad={onLoad}
                  options={options}
                  onMarkerComplete={onMarkerComplete}
                  onPolygonComplete={onPolygonComplete}
                />
                {filterData.map(
                  (
                    {
                      adressline,
                      area,
                      img,
                      priceEUR,
                      rooms,
                      title,
                      type,
                      _id,
                      x,
                      y
                    },
                    index
                  ) => {
                    return (
                      <Marker
                        key={index}
                        position={{ lat: x, lng: y }}
                        img={img}
                        area={area}
                        address={adressline}
                        price={priceEUR}
                        rooms={rooms}
                        title={title}
                        type={type}
                        id={_id}
                      />
                    );
                  }
                )}
              </GoogleMap>
            </div>
            <div style={{ width: '40%', border: '1px solid grey', overflowY: 'auto' }}>
              <div className="show-result">
                <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold', color: 'gray', textAlign: 'left', padding: '10px', marginTop: '10px' }}> Showing Result </Typography>
                <Select
                  // value={age}
                  // onChange={handleChange}
                  displayEmpty
                  size="small"
                  inputProps={{ 'aria-label': 'Without label' }}
                  style={{ float: 'right', marginRight: '10px', height: '40px' }}
                >
                  <MenuItem value={1}>Payment (High to Low)</MenuItem>
                  <MenuItem value={2}>Payment (Low to High)</MenuItem>
                  <MenuItem value={3}>Rooms</MenuItem>
                  <MenuItem value={4}>Area</MenuItem>
                </Select>
              </div>
              <Grid container spacing={1} sx={{ p: 1 }}>
                <Grid item xs={6}>
                  <Card>
                    <a href="https://lt.balticsothebysrealty.com/en/real-estate/sell-apartment-vilniaus-apskritis-vilnius-pylimo-g-211470" target="_blank" style={{ textDecoration: 'none', color: 'black' }}>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="140"
                          image="https://balsir-ftp.scoro.com/Scoro/RealEstate/211470/wo_watermark/pylimo_19_46.jpg"
                          alt="green iguana"
                        />
                        <CardContent style={{ textAlign: 'left' }}>
                          <Typography gutterBottom variant="h5" component="div" style={{ fontWeight: 'bold' }}>
                            156000 €
                          </Typography>
                          <Typography variant="p" color="text.secondary">
                            1 Rooms | 26 m2
                          </Typography>
                          <Typography variant="h6" color="text.secondary" style={{ fontWeight: 'bold' }}>
                            Vilnius, Senamiestis, Pylimo g.
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </a>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card>
                    <a href="https://lt.balticsothebysrealty.com/en/real-estate/sell-apartment-vilniaus-apskritis-vilnius-pylimo-g-211470" target="_blank" style={{ textDecoration: 'none', color: 'black' }}>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="140"
                          image="https://balsir-ftp.scoro.com/Scoro/RealEstate/211470/wo_watermark/pylimo_19_46.jpg"
                          alt="green iguana"
                        />
                        <CardContent style={{ textAlign: 'left' }}>
                          <Typography gutterBottom variant="h5" component="div" style={{ fontWeight: 'bold' }}>
                            156000 €
                          </Typography>
                          <Typography variant="p" color="text.secondary">
                            1 Rooms | 26 m2
                          </Typography>
                          <Typography variant="h6" color="text.secondary" style={{ fontWeight: 'bold' }}>
                            Vilnius, Senamiestis, Pylimo g.
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </a>
                  </Card>
                </Grid><Grid item xs={6}>
                  <Card>
                    <a href="https://lt.balticsothebysrealty.com/en/real-estate/sell-apartment-vilniaus-apskritis-vilnius-pylimo-g-211470" target="_blank" style={{ textDecoration: 'none', color: 'black' }}>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="140"
                          image="https://balsir-ftp.scoro.com/Scoro/RealEstate/211470/wo_watermark/pylimo_19_46.jpg"
                          alt="green iguana"
                        />
                        <CardContent style={{ textAlign: 'left' }}>
                          <Typography gutterBottom variant="h5" component="div" style={{ fontWeight: 'bold' }}>
                            156000 €
                          </Typography>
                          <Typography variant="p" color="text.secondary">
                            1 Rooms | 26 m2
                          </Typography>
                          <Typography variant="h6" color="text.secondary" style={{ fontWeight: 'bold' }}>
                            Vilnius, Senamiestis, Pylimo g.
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </a>
                  </Card>
                </Grid><Grid item xs={6}>
                  <Card>
                    <a href="https://lt.balticsothebysrealty.com/en/real-estate/sell-apartment-vilniaus-apskritis-vilnius-pylimo-g-211470" target="_blank" style={{ textDecoration: 'none', color: 'black' }}>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="140"
                          image="https://balsir-ftp.scoro.com/Scoro/RealEstate/211470/wo_watermark/pylimo_19_46.jpg"
                          alt="green iguana"
                        />
                        <CardContent style={{ textAlign: 'left' }}>
                          <Typography gutterBottom variant="h5" component="div" style={{ fontWeight: 'bold' }}>
                            156000 €
                          </Typography>
                          <Typography variant="p" color="text.secondary">
                            1 Rooms | 26 m2
                          </Typography>
                          <Typography variant="h6" color="text.secondary" style={{ fontWeight: 'bold' }}>
                            Vilnius, Senamiestis, Pylimo g.
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </a>
                  </Card>
                </Grid><Grid item xs={6}>
                  <Card>
                    <a href="https://lt.balticsothebysrealty.com/en/real-estate/sell-apartment-vilniaus-apskritis-vilnius-pylimo-g-211470" target="_blank" style={{ textDecoration: 'none', color: 'black' }}>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="140"
                          image="https://balsir-ftp.scoro.com/Scoro/RealEstate/211470/wo_watermark/pylimo_19_46.jpg"
                          alt="green iguana"
                        />
                        <CardContent style={{ textAlign: 'left' }}>
                          <Typography gutterBottom variant="h5" component="div" style={{ fontWeight: 'bold' }}>
                            156000 €
                          </Typography>
                          <Typography variant="p" color="text.secondary">
                            1 Rooms | 26 m2
                          </Typography>
                          <Typography variant="h6" color="text.secondary" style={{ fontWeight: 'bold' }}>
                            Vilnius, Senamiestis, Pylimo g.
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </a>
                  </Card>
                </Grid><Grid item xs={6}>
                  <Card>
                    <a href="https://lt.balticsothebysrealty.com/en/real-estate/sell-apartment-vilniaus-apskritis-vilnius-pylimo-g-211470" target="_blank" style={{ textDecoration: 'none', color: 'black' }}>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="140"
                          image="https://balsir-ftp.scoro.com/Scoro/RealEstate/211470/wo_watermark/pylimo_19_46.jpg"
                          alt="green iguana"
                        />
                        <CardContent style={{ textAlign: 'left' }}>
                          <Typography gutterBottom variant="h5" component="div" style={{ fontWeight: 'bold' }}>
                            156000 €
                          </Typography>
                          <Typography variant="p" color="text.secondary">
                            1 Rooms | 26 m2
                          </Typography>
                          <Typography variant="h6" color="text.secondary" style={{ fontWeight: 'bold' }}>
                            Vilnius, Senamiestis, Pylimo g.
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </a>
                  </Card>
                </Grid><Grid item xs={6}>
                  <Card>
                    <a href="https://lt.balticsothebysrealty.com/en/real-estate/sell-apartment-vilniaus-apskritis-vilnius-pylimo-g-211470" target="_blank" style={{ textDecoration: 'none', color: 'black' }}>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="140"
                          image="https://balsir-ftp.scoro.com/Scoro/RealEstate/211470/wo_watermark/pylimo_19_46.jpg"
                          alt="green iguana"
                        />
                        <CardContent style={{ textAlign: 'left' }}>
                          <Typography gutterBottom variant="h5" component="div" style={{ fontWeight: 'bold' }}>
                            156000 €
                          </Typography>
                          <Typography variant="p" color="text.secondary">
                            1 Rooms | 26 m2
                          </Typography>
                          <Typography variant="h6" color="text.secondary" style={{ fontWeight: 'bold' }}>
                            Vilnius, Senamiestis, Pylimo g.
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </a>
                  </Card>
                </Grid><Grid item xs={6}>
                  <Card>
                    <a href="https://lt.balticsothebysrealty.com/en/real-estate/sell-apartment-vilniaus-apskritis-vilnius-pylimo-g-211470" target="_blank" style={{ textDecoration: 'none', color: 'black' }}>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="140"
                          image="https://balsir-ftp.scoro.com/Scoro/RealEstate/211470/wo_watermark/pylimo_19_46.jpg"
                          alt="green iguana"
                        />
                        <CardContent style={{ textAlign: 'left' }}>
                          <Typography gutterBottom variant="h5" component="div" style={{ fontWeight: 'bold' }}>
                            156000 €
                          </Typography>
                          <Typography variant="p" color="text.secondary">
                            1 Rooms | 26 m2
                          </Typography>
                          <Typography variant="h6" color="text.secondary" style={{ fontWeight: 'bold' }}>
                            Vilnius, Senamiestis, Pylimo g.
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </a>
                  </Card>
                </Grid><Grid item xs={6}>
                  <Card>
                    <a href="https://lt.balticsothebysrealty.com/en/real-estate/sell-apartment-vilniaus-apskritis-vilnius-pylimo-g-211470" target="_blank" style={{ textDecoration: 'none', color: 'black' }}>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="140"
                          image="https://balsir-ftp.scoro.com/Scoro/RealEstate/211470/wo_watermark/pylimo_19_46.jpg"
                          alt="green iguana"
                        />
                        <CardContent style={{ textAlign: 'left' }}>
                          <Typography gutterBottom variant="h5" component="div" style={{ fontWeight: 'bold' }}>
                            156000 €
                          </Typography>
                          <Typography variant="p" color="text.secondary">
                            1 Rooms | 26 m2
                          </Typography>
                          <Typography variant="h6" color="text.secondary" style={{ fontWeight: 'bold' }}>
                            Vilnius, Senamiestis, Pylimo g.
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </a>
                  </Card>
                </Grid><Grid item xs={6}>
                  <Card>
                    <a href="https://lt.balticsothebysrealty.com/en/real-estate/sell-apartment-vilniaus-apskritis-vilnius-pylimo-g-211470" target="_blank" style={{ textDecoration: 'none', color: 'black' }}>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="140"
                          image="https://balsir-ftp.scoro.com/Scoro/RealEstate/211470/wo_watermark/pylimo_19_46.jpg"
                          alt="green iguana"
                        />
                        <CardContent style={{ textAlign: 'left' }}>
                          <Typography gutterBottom variant="h5" component="div" style={{ fontWeight: 'bold' }}>
                            156000 €
                          </Typography>
                          <Typography variant="p" color="text.secondary">
                            1 Rooms | 26 m2
                          </Typography>
                          <Typography variant="h6" color="text.secondary" style={{ fontWeight: 'bold' }}>
                            Vilnius, Senamiestis, Pylimo g.
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </a>
                  </Card>
                </Grid>
              </Grid>
            </div>
          </div>
        </>
      )
      }
    </LoadScript >
  );
};

export default Dashboard;

