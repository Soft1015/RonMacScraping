import React, { useState, useEffect, useMemo } from "react";
import { GoogleMap, LoadScript, DrawingManager } from "@react-google-maps/api";
import Marker from "./marker"
import logo from './imgs/logo.webp';
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
  IconButton,
  Pagination,
  Switch,
  FormControlLabel,
  Slider
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';
import CustomizedDialog from './modal';
/**
* Style
*/
const mapContainerStyle = {
  height: "100%",
  width: "100%",
};

const style = {
  display: "flex",
  height: "80vh",
};

/*
End Style
*/
/**
* Google Map Config
*/

const endpoint = 'https://maps.googleapis.com/maps/api/geocode/json';
const apiKey = 'AIzaSyCctCn5BfzuPui4BHWF5IUbgvrPUnvfWKQ';

const center = {
  lat: 55.91322900129,
  lng: 23.287003040314,
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
/**end */
const maxLength = 5;
const pagUnitLengh = 40;
const unitRequestLength = 200;
const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setLoadingState] = useState(true);
  const [isLoadingDetail, setLoadingDetailState] = useState(false);
  const [homeData, setFlatInfo] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [detailData, setDetailData] = useState([]);
  const [currentID, setCurrentID] = useState([]);
  const filterMarker = useMemo(() => {
    setLoadingDetailState(true);
    setDetailData(filterData);
    setCurrentPage(1);
    return filterData.map(
      (
        {
          adressline,
          area,
          img,
          priceEUR,
          rooms,
          title,
          type,
          id,
          x,
          y,
          url
        },
        index
      ) => {
        return (
          <Marker
            key={index}
            id={id}
            position={{ lat: x, lng: y }}
            img={img}
            area={area}
            address={adressline}
            price={priceEUR}
            rooms={rooms}
            title={title}
            type={type}
            url={url}
            showDetail={setCurrentID}
          />
        );
      }
    );
  }, [filterData]);

  /**
   * Get Data
  */
  const getData = async () => {
    fetch("http://localhost:3300/items")
      .then((response) => response.json())
      .then(async (data) => {
        const allData = data.map(elem => (
          {
            title: elem.title,
            x: parseFloat(elem.x),
            y: parseFloat(elem.y),
            area: parseFloat(elem.area),
            rooms: parseFloat(elem.rooms),
            img: elem.img,
            priceEUR: parseFloat(elem.priceEUR != "NaN" ? elem.priceEUR : 0),
            adressline: elem.adressline ? elem.adressline : "",
            url: elem.url,
            type: parseInt(elem.type),
            id: elem._id,
          }
        ));
        let newArray = [];
        for (let i = 0; i <= allData.length / unitRequestLength; i++) {
          const max = allData.length >= (i + 1) * unitRequestLength ? (i + 1) * unitRequestLength : allData.length;
          const min = i * unitRequestLength;
          const launchOptimistic = allData.slice(min, max);
          const promises = [];
          launchOptimistic.forEach(item => {
            const { x, y } = item;
            const params = `latlng=${x},${y}&key=${apiKey}`;
            const url = `${endpoint}?${params}`;
            const promise = fetch(url)
              .then(response => response.json())
              .then(data => {
                let city = null;
                let found = false;
                for (let j = 0; j < data.results.length; j++) {
                  if (found) break;
                  for (let k = 0; k < data.results[j].address_components.length; k++) {
                    if (data.results[j].address_components[k].types.includes('locality')) {
                      city = data.results[j].address_components[k].long_name;
                      found = true;
                      break;
                    }
                  }
                }
                item.city = city; // Add the city name to the position object
                newArray.push(item);
              })
              .catch(error => console.log(error));
            promises.push(promise);
          });
          await Promise.all(promises);
        }
        const rent = newArray.filter((item => item.type == '2' && item.type == '3'));
        console.log(rent);
        setFlatInfo(newArray);
        setFilterData(newArray);
        const res = await fetch("http://localhost:3300/timer");
        const time = await res.json();//assuming data is json
        set1Timer(time.timer1);
        set2Timer(time.timer2);
        setTimeID(time._id);
        setLoadingState(false);
      })
      .catch((error) => {
      });
  };

  const SaveTime = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: timeID, Time1: time1, Time2: time2 }),
    };
    fetch("http://localhost:3300/saveTime", requestOptions)
      .then((response) => response.json())
      .then((data) => {
      })
      .catch((error) => {
      })
  }

  const onMarkerComplete = (marker) => {
    marker.setMap(null);
  };

  const onPolygonComplete = (polygon) => {
  };

  useEffect(() => {
    getData();
    loadSetting();
  }, []);

  const loadSetting = () => {
    setAppreciateRate(localStorage.getItem('appreciateRate'));
    setPropertyTaxRate(localStorage.getItem('propertyTaxRate'));
    setCapex(localStorage.getItem('capex'));
    setMaintenanceCost(localStorage.getItem('maintenanceCost'));
    setMortgage(localStorage.getItem('mortgage') == 'true' ? true : false);
    setInterest(localStorage.getItem('interestOnly') == 'true' ? true : false);
    setLoanTerm(localStorage.getItem('loanTerm'));
    setLoan2ValRatio(localStorage.getItem('loan2ValRatio'));

    setAcqCost(localStorage.getItem('acqCost'));
    setDivestmentCost(localStorage.getItem('divestmentCost'));
    setLoanAmount(localStorage.getItem('loanAmount'));
    setInterestRate(localStorage.getItem('interestRate'));
    setInvestmentPeriod(localStorage.getItem('investmentPeriod'));
  }

  /**
   * Menu
   */
  //PropertyType
  const [propertyType, setPropertyType] = useState(0);
  const onChangePropertyType = (event) => {
    setPropertyType(event.target.value);
  };
  //Price
  const [minPrice, setMinPrice] = useState(0);
  const onChangeMinPrice = (event) => {
    setMinPrice(event.target.value);
  };

  const [maxPrice, setMaxPrice] = useState(0);
  const onChangeMaxPrice = (event) => {
    setMaxPrice(event.target.value);
  };

  const [anchorPriceEl, setAnchorPriceEl] = useState(null);
  const handlePriceClose = () => {
    setAnchorPriceEl(null);
  };

  const handlePriceClick = (event) => {
    setAnchorPriceEl(event.currentTarget);
  };
  //Room Number
  const [minRmNum, setMinRmNum] = useState(0);
  const onChangeMinRmNum = (event) => {
    setMinRmNum(event.target.value);
  };

  const [maxRmNum, setMaxRmNum] = useState(0);
  const onChangeMaxRmNum = (event) => {
    setMaxRmNum(event.target.value);
  };

  const [anchorRmNumEl, setAnchorRmNumEl] = useState(null);
  const handleRmNumClose = () => {
    setAnchorRmNumEl(null);
  };

  const handleRmNumClick = (event) => {
    setAnchorRmNumEl(event.currentTarget);
  };
  //Area
  const [minArea, setMinArea] = useState(0);
  const onChangeMinArea = (event) => {
    setMinArea(event.target.value);
  };

  const [maxArea, setMaxArea] = useState(0);
  const onChangeMaxArea = (event) => {
    setMaxArea(event.target.value);
  };

  const [anchorAreaEl, setAnchorAreaEl] = useState(null);
  const handleAreaClose = () => {
    setAnchorAreaEl(null);
  };

  const handleAreaClick = (event) => {
    setAnchorAreaEl(event.currentTarget);
  };
  //location
  const [location, setLocation] = useState("");
  const onChangeLocation = (event) => {
    setLocation(event.target.value);
  };
  //Time Setting
  const [anchorTimeEl, setAnchorTimeEl] = useState(null);
  const handleTimeClose = () => {
    setAnchorTimeEl(null);
  };

  const handleTimeClick = (event) => {
    setAnchorTimeEl(event.currentTarget);
  };
  //Detail Setting
  const [anchorDetailEl, setAnchorDetailEl] = useState(null);
  const handleDetailClose = () => {
    setAnchorDetailEl(null);
  };

  const handleDetailClick = (event) => {
    setAnchorDetailEl(event.currentTarget);
  };

  // Mortgage Variables
  const [mortgage, setMortgage] = useState(false);
  //interest_only
  const [interestOnly, setInterest] = useState(true);

  const [appreciateRate, setAppreciateRate] = useState(0);
  const [propertyTaxRate, setPropertyTaxRate] = useState(0);
  const [capex, setCapex] = useState(0);
  const [maintenanceCost, setMaintenanceCost] = useState(0);
  const [acqCost, setAcqCost] = useState(0);
  const [divestmentCost, setDivestmentCost] = useState(0);
  const [loanTerm, setLoanTerm] = useState(0);
  const [loan2ValRatio, setLoan2ValRatio] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [investmentPeriod, setInvestmentPeriod] = useState(0);
  const [rangeDistance, setRangeDistance] = useState(1);

  //time setting(scraping)
  const timeSlots = Array.from(new Array(24)).map(
    (_, index) => `${index < 10 ? '0' : ''}${index}:00`
  );

  const [time1, set1Timer] = useState('00:00');
  const [time2, set2Timer] = useState('12:00');
  const [timeID, setTimeID] = useState("");
  const onChangeTimer1 = (event) => {
    set1Timer(event.target.value);
  };

  const onChangeTimer2 = (event) => {
    set2Timer(event.target.value);
  };


  useEffect(() => {
    if (timeID == "") return;
    SaveTime();
  }, [time1, time2]);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (currentID != "") {
      setOpen(true);
    }
  }, [currentID]);

  useEffect(() => {
    console.log('open changed');
    if (open == false) {
      setCurrentID('');
    }
  }, [open]);


  //sort setting
  const [sort, setSort] = useState(1);
  const onChangeSort = (event) => {
    setSort(event.target.value);
  };
  //Pagination
  const filterDetails = useMemo(() => {
    if (currentPage == 0) return;
    let newArray = [];
    switch (sort) {
      case 1://Payment (High to Low)
        newArray = detailData.sort((a, b) => b.priceEUR - a.priceEUR);
        break;
      case 2://Payment (Low to High)
        newArray = detailData.sort((a, b) => a.priceEUR - b.priceEUR);
        break;
      case 3://Rooms
        newArray = detailData.sort((a, b) => b.rooms - a.rooms);
        break;
      default://Area
        newArray = detailData.sort((a, b) => b.area - a.area);
        break;
    }
    const max = detailData.length >= currentPage * pagUnitLengh ? currentPage * pagUnitLengh : detailData.length;
    const min = (currentPage - 1) * pagUnitLengh;
    const details = newArray.slice(min, max);
    setLoadingDetailState(false);
    return details.map(
      (
        {
          adressline,
          area,
          img,
          priceEUR,
          rooms,
          url,
          id
        },
        index
      ) => {
        return (
          <Grid item xs={6} key={index}>
            <Card className="card" onClick={(e) => { setCurrentID(""); setCurrentID(id) }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="140"
                  image={img}
                  alt="green iguana"
                />
                <CardContent style={{ textAlign: 'left' }}>
                  <Typography gutterBottom variant="h5" component="div" style={{ fontWeight: 'bold' }}>
                    {priceEUR} €
                  </Typography>
                  <Typography variant="p" color="text.secondary">
                    {rooms} Rooms | {area} m2
                  </Typography>
                  <Typography variant="h6" color="text.secondary" style={{ fontWeight: 'bold' }} className="address">
                    {adressline}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        );
      }
    );
  }, [currentPage, sort]);
  /**
   * end Menu
   */

  //Google map
  const [map, setMap] = useState(null);
  const onLoad = (drawer) => {
    setMap(drawer.map);
  };

  const onBoundsChanged = () => {
    if (filterData.length == 0) return;
    if (map == null) return;
    setLoadingDetailState(true);
    var bounds = map.getBounds();
    let j = 0;
    let newArray = [];
    for (var i = 0; i < filterData.length; i++) { // looping through my Markers Collection        
      if (bounds.contains(new google.maps.LatLng(filterData[i].x, filterData[i].y))) {
        newArray.push(filterData[i]);
      }
    }
    setDetailData(newArray);
    setCurrentPage(0);
    setCurrentPage(1);
  };

  const onSearch = () => {
    let newArray = [];
    newArray = homeData.filter((item) => parseInt(item.type) == propertyType);
    newArray = newArray.filter((item) => {
      if (maxPrice != "" && parseFloat(maxPrice) != 0) {
        return item.priceEUR >= parseFloat(minPrice) && item.priceEUR <= parseFloat(maxPrice);
      } else {
        return item.priceEUR >= parseFloat(minPrice);
      }
    });

    newArray = newArray.filter((item) => {
      if (maxArea != "" && parseFloat(maxArea) != 0) {
        return item.area >= parseFloat(minArea) && item.area <= parseFloat(maxArea);
      } else {
        return item.area > parseFloat(minArea);
      }
    });

    newArray = newArray.filter((item) => {
      if (maxRmNum != "" && parseFloat(maxRmNum) != 0) {
        return item.rooms >= parseInt(minRmNum) && item.rooms <= parseInt(maxRmNum);
      } else {
        return item.rooms > parseInt(minRmNum);
      }
    });

    newArray = newArray.filter((item) => {
      if (item.city != null)
        return item.city.includes(location);
    });
    setFilterData(newArray);
  };

  return (

    isLoading ? (
      <div style={{ position: "absolute", backgroundColor: '#91919526', width: '100%', height: '100%' }}>
        <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
      </div>
    ) : (
      <>
        <img src={logo} alt="image not found" style={{ marginTop: '10px' }} />
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
                          value={minPrice}
                          type="number"
                          onChange={onChangeMinPrice}
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
                          type="number"
                          value={maxPrice}
                          onChange={onChangeMaxPrice}
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
                        <OutlinedInput id="outlined-adornment-amount" size="small" type="number" value={minRmNum} onChange={onChangeMinRmNum} label="Min" />
                      </FormControl>
                    </Grid>

                    <Grid item xs={5.8} md={5.8}>
                      <FormControl>
                        <InputLabel htmlFor="outlined-adornment-amount" size="small">Min</InputLabel>
                        <OutlinedInput id="outlined-adornment-amount" size="small" type="number" value={maxRmNum} onChange={onChangeMaxRmNum} label="Min" />
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
                          type="number"
                          value={minArea}
                          max={maxArea}
                          onChange={onChangeMinArea}
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
                          type="number"
                          value={maxArea}
                          min={minArea}
                          onChange={onChangeMaxArea}
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
            <OutlinedInput
              id="outlined-adornment-weight"
              aria-describedby="outlined-weight-helper-text"
              size="small"
              placeholder="Enter City"
              value={location}
              onChange={onChangeLocation}
            />
          </Grid>
          <Grid xs={1} sx={{ ml: 1.5 }}>
            <div>
              <Button
                variant="outlined"
                style={{ height: '40px', color: 'black', fontWeight: 'normal', borderColor: 'gray', width: '100%', justifyContent: 'space-between' }}
                onClick={handleDetailClick}
                endIcon={<KeyboardArrowDownIcon />}
              >
                Setting
              </Button>
              <Popover
                open={Boolean(anchorDetailEl)}
                anchorEl={anchorDetailEl}
                onClose={handleDetailClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
              >
                <div>
                  <p className="popup-menu-header">Setting</p>
                  <Grid container style={{ justifyContent: 'space-between' }} sx={{ p: 1.5 }}>
                    <Grid item xs={5.8} md={5.8}>
                      <FormControl>
                        <InputLabel htmlFor="outlined-adornment-amount">Appreciation Rate</InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-amount"
                          size="small"
                          value={appreciateRate}
                          type="number"
                          onChange={(e) => {
                            setAppreciateRate(e.target.value);
                            localStorage.setItem('appreciateRate', e.target.value);
                          }}
                          startAdornment={<InputAdornment position="start">%</InputAdornment>}
                          label="Appreciation Rate"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={5.8} md={5.8}>
                      <FormControl>
                        <InputLabel htmlFor="outlined-adornment-amount">Property Tax Rate</InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-amount"
                          size="small"
                          type="number"
                          value={propertyTaxRate}
                          onChange={(e) => {
                            setPropertyTaxRate(e.target.value);
                            localStorage.setItem('propertyTaxRate', e.target.value);
                          }}
                          startAdornment={<InputAdornment position="start">%</InputAdornment>}
                          label="Property Tax Rate"
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid container style={{ justifyContent: 'space-between' }} sx={{ p: 1.5 }}>
                    <Grid item xs={12} md={12}>
                      <FormControl fullWidth>
                        <InputLabel htmlFor="outlined-adornment-amount">Investment Period</InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-amount"
                          size="small"
                          value={investmentPeriod}
                          type="number"
                          onChange={(e) => {
                            setInvestmentPeriod(e.target.value);
                            localStorage.setItem('investmentPeriod', e.target.value);
                          }}
                          label="Investment Period"
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid container style={{ justifyContent: 'space-between' }} sx={{ p: 1.5 }}>
                    <Grid item xs={5.8} md={5.8}>
                      <FormControl>
                        <InputLabel htmlFor="outlined-adornment-amount">Capex</InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-amount"
                          size="small"
                          value={capex}
                          type="number"
                          onChange={(e) => {
                            setCapex(e.target.value);
                            localStorage.setItem('capex', e.target.value);
                          }}
                          label="Capex"
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={5.8} md={5.8}>
                      <FormControl>
                        <InputLabel htmlFor="outlined-adornment-amount">Maintenance Cost</InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-amount"
                          size="small"
                          type="number"
                          value={maintenanceCost}
                          onChange={(e) => {
                            setMaintenanceCost(e.target.value);
                            localStorage.setItem('maintenanceCost', e.target.value);
                          }}
                          label="Maintenance Cost"
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid container style={{ justifyContent: 'space-between' }} sx={{ p: 1.5 }}>
                    <Grid item xs={5.8} md={5.8}>
                      <FormControl>
                        <InputLabel htmlFor="outlined-adornment-amount">Acquisition Cost</InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-amount"
                          size="small"
                          value={acqCost}
                          type="number"
                          onChange={(e) => {
                            setAcqCost(e.target.value);
                            localStorage.setItem('acqCost', e.target.value);
                          }}
                          label="Acquisition Cost"
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={5.8} md={5.8}>
                      <FormControl>
                        <InputLabel htmlFor="outlined-adornment-amount">Divestment Cost</InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-amount"
                          size="small"
                          type="number"
                          value={divestmentCost}
                          onChange={(e) => {
                            setDivestmentCost(e.target.value);
                            localStorage.setItem('divestmentCost', e.target.value);
                          }}
                          label="Divestment Cost"
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid container style={{ justifyContent: 'space-between' }} sx={{ px: 1.5 }} className="popup-menu-header">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={mortgage}
                          onChange={(e) => {
                            setMortgage(e.target.checked);
                            localStorage.setItem('mortgage', e.target.checked);
                          }}
                          aria-label="login switch"
                        />
                      }
                      label='Mortgage'
                    />
                  </Grid>
                  {mortgage ? (
                    <>
                      <Grid container style={{ justifyContent: 'space-between' }} sx={{ p: 1.5 }}>
                        <Grid item xs={5.8} md={5.8}>
                          <FormControl>
                            <InputLabel htmlFor="outlined-adornment-amount">Loan Amount</InputLabel>
                            <OutlinedInput
                              id="outlined-adornment-amount"
                              size="small"
                              type="number"
                              value={loanAmount}
                              onChange={(e) => {
                                setLoanAmount(e.target.value);
                                localStorage.setItem('loanAmount', e.target.value);
                              }}
                              label="Loan Amount"
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={5.8} md={5.8}>
                          <FormControl>
                            <InputLabel htmlFor="outlined-adornment-amount">Interest Rate</InputLabel>
                            <OutlinedInput
                              id="outlined-adornment-amount"
                              size="small"
                              type="number"
                              value={interestRate}
                              onChange={(e) => {
                                setInterestRate(e.target.value);
                                localStorage.setItem('interestRate', e.target.value);
                              }}
                              startAdornment={<InputAdornment position="start">%</InputAdornment>}
                              label="Interest Rate"
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                      <Grid container style={{ justifyContent: 'space-between' }} sx={{ px: 1.5 }} className="popup-menu-header">
                        <FormControlLabel
                          control={
                            <Switch
                              checked={interestOnly}
                              onChange={(e) => {
                                setInterest(e.target.checked);
                                localStorage.setItem('interestOnly', e.target.checked);
                              }}
                              aria-label="login switch"
                            />
                          }
                          label='Interest Only'
                        />
                      </Grid>
                      <>
                        <Grid container style={{ justifyContent: 'space-between' }} sx={{ p: 1.5 }} >
                          <Grid item xs={5.8} md={5.8}>
                            <FormControl>
                              <InputLabel htmlFor="outlined-adornment-amount">Loan Term</InputLabel>
                              <OutlinedInput
                                id="outlined-adornment-amount"
                                size="small"
                                value={loanTerm}
                                type="number"
                                onChange={(e) => {
                                  setLoanTerm(e.target.value);
                                  localStorage.setItem('loanTerm', e.target.value);
                                }}
                                label="Loan Term"
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={5.8} md={5.8}>
                            <FormControl>
                              <InputLabel htmlFor="outlined-adornment-amount">Loan-2-Value Ratio</InputLabel>
                              <OutlinedInput
                                id="outlined-adornment-amount"
                                size="small"
                                type="number"
                                value={loan2ValRatio}
                                onChange={(e) => {
                                  setLoan2ValRatio(e.target.value);
                                  localStorage.setItem('loan2ValRatio', e.target.value);
                                }}
                                startAdornment={<InputAdornment position="start">%</InputAdornment>}
                                label="Loan-2-Value Ratio"
                              />
                            </FormControl>
                          </Grid>
                        </Grid>
                      </>
                    </>
                  ) : (<></>)}
                </div>
              </Popover>
            </div>
          </Grid>
          <Button sx={{ ml: 1.5 }} variant="outlined" style={{ color: 'black', fontWeight: 'normal', borderColor: 'gray' }} startIcon={<SearchIcon />} onClick={onSearch}>
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
                    <InputLabel id="demo-simple-select-label"> Timer1 </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={time1}
                      style={{ width: "100%" }}
                      label="Timer1"
                      size="small"
                      onChange={onChangeTimer1}
                    >
                      {timeSlots.map((time, i) => {
                        const iIndex = i;
                        return (
                          <MenuItem key={iIndex} value={time}>
                            {time}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={5.8} md={5.8}>
                  <FormControl>
                    <InputLabel id="demo-simple-select-label"> Timer2 </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={time2}
                      size="small"
                      style={{ width: "100%" }}
                      label="Timer2"
                      onChange={onChangeTimer2}
                    >
                      {timeSlots.map((time, i) => {
                        const iIndex = i;
                        return (
                          <MenuItem key={iIndex} value={time}>
                            {time}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </div>
          </Popover>
          <Typography gutterBottom style={{marginLeft:'10px'}}>Range(km)</Typography>
          <Grid xs={1} sx={{ ml: 1.5 }}>
            <Slider value={rangeDistance} onChange={(e, num) => setRangeDistance(num)} defaultValue={1} aria-label="Default" valueLabelDisplay="auto" step={0.1} min={1} max={10} />
          </Grid>
        </Grid>
        <div style={style}>
          <div style={{ width: "60%" }}>
            <LoadScript
              id="script-loader"
              googleMapsApiKey="AIzaSyCctCn5BfzuPui4BHWF5IUbgvrPUnvfWKQ"
              libraries={["drawing"]}
            >
              <GoogleMap
                id="drawing-manager-example"
                mapContainerStyle={mapContainerStyle}
                zoom={8}
                center={center}
                onBoundsChanged={onBoundsChanged}
              >
                <DrawingManager
                  onLoad={onLoad}
                  options={options}
                  onMarkerComplete={onMarkerComplete}
                  onPolygonComplete={onPolygonComplete}
                />
                {filterMarker}
              </GoogleMap>
            </LoadScript >
          </div>
          {
            isLoadingDetail ? (
              <div style={{ width: '40%', border: '1px solid grey', overflowY: 'auto', backgroundColor: '#91919526' }}>
                <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
              </div>
            ) : (
              <div style={{ width: '40%', border: '1px solid grey', overflowY: 'auto' }}>
                <div className="show-result">
                  <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold', color: 'gray', textAlign: 'left', padding: '10px', marginTop: '10px' }}> Showing Result ({detailData.length})</Typography>
                  <Select
                    value={sort}
                    onChange={onChangeSort}
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
                  {filterDetails}
                </Grid>
                {open ? (<CustomizedDialog
                  open={open}
                  handleClose={setOpen}
                  data={homeData}
                  id={currentID}
                  showDetail={setCurrentID}
                  rangeDistance={rangeDistance}
                  appreciateRate={appreciateRate}
                  propertyTaxRate={propertyTaxRate}
                  capex={capex}
                  maintenanceCost={maintenanceCost}
                  acqCost={acqCost}
                  divestmentCost={divestmentCost}
                  loanTerm={loanTerm}
                  loan2ValRatio={loan2ValRatio}
                  loanAmount={loanAmount}
                  interestRate={interestRate}
                  mortgage={mortgage}
                  interestOnly={interestOnly}
                  investmentPeriod={investmentPeriod}
                />) : (<></>)}
                <Pagination count={Math.ceil(detailData.length / pagUnitLengh)} onChange={(e, page) => setCurrentPage(page)} page={currentPage} color="primary" style={{ display: 'flex', justifyContent: 'center' }} />
              </div>
            )
          }
        </div>
      </>
    )
  );
}
export default Dashboard;
