import React, { useState, useEffect, useMemo } from "react";
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { Marker } from "@react-google-maps/api";
import icon from './imgs/img.png';
import {
  Card,
  CardMedia,
  CardActionArea,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Grid,
  Typography,
  CardContent,
  Tabs,
  Tab,
} from "@mui/material";


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}
const CustomizedDialog = ({
  open,
  handleClose,
  data,
  id,
  showDetail,
  appreciateRate,
  propertyTaxRate,
  capex,
  acqCost,
  divestmentCost,
  loanTerm,
  loan2ValRatio,
  loanAmount,
  interestRate,
  mortgage,
  interestOnly,
  investmentPeriod,
  maintenanceCost,
  rangeDistance
}) => {

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyCctCn5BfzuPui4BHWF5IUbgvrPUnvfWKQ"
  })

  const containerStyle = {
    height: '90px'
  };

  const [index, setCurrenIndex] = useState(1);

  const rad = (x) => { return x * Math.PI / 180 };
  const getDistance = (x1, y1, x2, y2) => {
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = rad(x2 - x1);
    var dLong = rad(y2 - y1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(x1)) * Math.cos(rad(x2)) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // returns the distance in meter
  }

  const options = {
    fullscreenControl: false,
  };
  // const detail = data
  const detail = data.find((item => item.id === id));
  const city = detail?.city;
  let filterData = data.filter((item => item.city == city));
  filterData = filterData.filter((item) => {
    return (getDistance(detail?.x, detail?.y, item?.x, item?.y) / 1000) < rangeDistance && item?.id != id;
  });
  filterData = filterData.filter((item) => {
    return Math.abs(parseInt(detail?.rooms - item?.rooms)) <= 1;
  });
  filterData = filterData.filter((item) => {
    return Math.abs(parseInt(detail?.area - item?.area)) <= 10;
  });
  const forRent = filterData.filter((item => item.type == 2 || item.type == 3));
  const forSale = filterData.filter((item => item.type == 0 || item.type == 1));
  let middleValue = 0, meanRent = 0, totalRent = 0, totalExpnse = 0, NOI = 0, equityInvestment = 0, yieldOnCost = 0,
    CashOnCashReturn = 0, equityMultiple = 0, IRR = 0, mortgagePayment = 0, capRate = 0,DSCR = 0;
  if (detail) {
    if (forRent.length > 0) {

      middleValue = (Math.max(...forRent.map(o => o.priceEUR)) + Math.min(...forRent.map(o => o.priceEUR))) / 2;
      meanRent = forRent.reduce((accum, item) => accum + item.priceEUR, 0) / forRent.length;
      meanRent = meanRent.toFixed(2);
      middleValue = middleValue.toFixed(2);
      const MarketRent = meanRent * 1.05;
      totalRent = MarketRent * 12 * investmentPeriod;
      console.log('marketRent', MarketRent);
      const accumulatedApprePrice = parseFloat(detail.priceEUR) * Math.pow(parseFloat(1 + (appreciateRate / 100)), investmentPeriod);
      if (mortgage) {
        const loan_Amount = detail.priceEUR * (parseFloat(loan2ValRatio) / 100);
        const downPayment = detail.priceEUR * parseFloat(1 - parseFloat(loan2ValRatio) / 100);
        console.log('loan_Amount=>', loan_Amount);
        console.log('downPayment=>', downPayment);
        if (interestOnly) {
          mortgagePayment = (loan_Amount * parseFloat(interestRate / 100)) / 12;
        } else {
          mortgagePayment = ((parseFloat(interestRate / 100) / 12) * loan_Amount) / (1 - Math.pow(1 + (parseFloat(interestRate / 100) / 12), parseFloat(-loanTerm) * 12));
        }
        console.log('mortgagePayment=>', mortgagePayment);
        totalExpnse = parseFloat(acqCost) + parseFloat(divestmentCost) + parseFloat(maintenanceCost * 12 * investmentPeriod) +
          parseFloat(propertyTaxRate / 100 * detail.priceEUR * parseFloat(investmentPeriod)) * 12 +
          parseFloat(mortgagePayment * 12) * parseFloat(investmentPeriod) + parseFloat(capex);
        NOI = MarketRent * 12 - parseFloat(detail.priceEUR * propertyTaxRate / 100 * 12) - parseFloat(maintenanceCost * 12) - mortgagePayment * 12;
        equityInvestment = parseFloat(downPayment) + parseFloat(acqCost) - parseFloat(capex);
        yieldOnCost = (totalRent - totalExpnse) / equityInvestment;
        CashOnCashReturn = NOI / equityInvestment;
        equityMultiple = (totalRent + accumulatedApprePrice - totalExpnse) / equityInvestment + 1;
        capRate = NOI / detail.priceEUR;
        DSCR = NOI / (mortgagePayment * 12);
      } else {
        totalExpnse = parseFloat(acqCost) + parseFloat(divestmentCost) + parseFloat(maintenanceCost * 12 * investmentPeriod) + parseFloat(propertyTaxRate / 100 * detail.priceEUR * investmentPeriod) + parseFloat(capex);
        equityInvestment = detail.priceEUR + parseFloat(acqCost) - parseFloat(capex);
        yieldOnCost = (totalRent - totalExpnse) / equityInvestment;
        NOI = MarketRent * 12 - detail.priceEUR * propertyTaxRate / 100 * 12 - maintenanceCost * 12;
        CashOnCashReturn = NOI / equityInvestment;
        equityMultiple = (totalRent + accumulatedApprePrice - totalExpnse) / equityInvestment + 1;
        capRate = NOI / detail.priceEUR;
      }
      yieldOnCost *= 100;
      CashOnCashReturn *= 100;
      IRR *= 100;
      yieldOnCost = yieldOnCost.toFixed(2);
      equityMultiple = equityMultiple.toFixed(2);
      CashOnCashReturn = CashOnCashReturn.toFixed(2);
      mortgagePayment = mortgagePayment.toFixed(2);
      DSCR = DSCR.toFixed(2);
      console.log('middleValue===>', middleValue)
      console.log('meanRent===>', meanRent)
      console.log('totalRent===>', totalRent)
      console.log('NOI===>', NOI)
      console.log('equityInvestment===>', equityInvestment)
      console.log('totalExpnse===>', totalExpnse)
      console.log('CashOnCashReturn===>', CashOnCashReturn)
      console.log('equityMultiple===>', equityMultiple)
      // Monthly payment Mortgage Payment with Principal and Interest= ((Interest Rate/12) x loan amount)/(1-(1+(Interest rate/12))^(-term*12))
      //511500
      // 1705
      // (1-(1+(Interest rate/12))^(-term*12)) 
      //(1 - (1 + 0.04 / 12) ^ (-30 * 12) )
      //(1 - (1.0033)^-360)
      // 
    }
  }
  /**
   * 
   */
  let type = "";
  if (detail?.type == "0") {
    type = "Apartment for sale";
  } else if (detail?.type == "1") {
    type = "House for sale";
  } else if (detail?.type == "2") {
    type = "Apartment for rent";
  } else {
    type = "House for rent";
  }

  const center = {
    lat: parseFloat(detail?.x),
    lng: parseFloat(detail?.y)
  };

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    forRent.forEach((point) => {
        bounds.extend({lat:parseFloat(point.x), lng: parseFloat(point.y)});
    });
    map.fitBounds(bounds);
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  return (
    <div>
      <BootstrapDialog
        onClose={() => handleClose(false)}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth
        maxWidth="md"
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={() => handleClose(false)}>
          Showing Details
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Grid container spacing={0.5} sx={{ p: 1 }}>
            <Grid item xs={5}>
              <a href={detail?.url} target='_blank'>
                <img src={detail?.img} alt='Image could not found' style={{ width: '100%', height: '200px' }} />
              </a>

              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }} className='address'>
                  Address:
                </Typography>
                <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                  {detail?.adressline}
                </Typography>
              </div>
              <hr style={{ margin: '0' }} />
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                  Type:
                </Typography>
                <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                  {type}
                </Typography>
              </div>
              <hr style={{ margin: '0' }} />
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                  City:
                </Typography>
                <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                  {city}
                </Typography>
              </div>
              <hr style={{ margin: '0' }} />
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                  Rooms:
                </Typography>
                <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                  {detail?.rooms}
                </Typography>
              </div>
              <hr style={{ margin: '0' }} />
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                  Area:
                </Typography>
                <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                  {detail?.area}
                </Typography>
              </div>
              <hr style={{ margin: '0' }} />
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                  Price:
                </Typography>
                <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                  {detail?.priceEUR} €
                </Typography>
              </div>
              {
                (detail?.type == "0" || detail?.type == "1") ? (
                  <>
                    <hr style={{ margin: '0' }} />
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                      <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                        YOC:
                      </Typography>
                      <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                        {yieldOnCost} %
                      </Typography>
                    </div>
                    <hr style={{ margin: '0' }} />
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                      <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                        Cash On Cash Return:
                      </Typography>
                      <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                        {CashOnCashReturn} %
                      </Typography>
                    </div>
                    <hr style={{ margin: '0' }} />
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                      <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                        Equity Multiple:
                      </Typography>
                      <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                        {equityMultiple}
                      </Typography>
                    </div>
                    <hr style={{ margin: '0' }} />
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                      <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                        mean rent of the comps:
                      </Typography>
                      <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                        {meanRent}
                      </Typography>
                    </div>
                    <hr style={{ margin: '0' }} />
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                      <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                        Middle Value:
                      </Typography>
                      <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                        {middleValue}
                      </Typography>
                    </div>
                    {mortgage ? (
                      <>
                        <hr style={{ margin: '0' }} />
                        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                          <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                            mortgage Payment:
                          </Typography>
                          <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                            {mortgagePayment}
                          </Typography>
                        </div>
                        <hr style={{ margin: '0' }} />
                        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                          <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                          DSCR:
                          </Typography>
                          <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                            {DSCR}
                          </Typography>
                        </div>
                        
                      </>
                    ) : (<></>)}
                  </>
                ) : (
                  <></>
                )
              }
              <hr style={{ margin: '0' }} />
              <div>
                {isLoaded ? (
                  <GoogleMap
                    zoom={15}
                    mapContainerStyle={containerStyle}
                    center={center}
                    options={options}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                  >
                    {
                        forRent.map(({ x, y}, index) => {
                          return (
                            <Marker
                              key={index}
                              position={{ lat: x, lng: y }}
                              draggable={false}
                              icon={{ url: icon, scaledSize: new window.google.maps.Size(20, 30) }}
                            />
                          );
                        }
                      )
                  }
                  </GoogleMap>
                ) : <></>
                }
              </div>
            </Grid>
            <Grid item xs={7}>
              <div style={{ borderLeft: '1px solid grey', marginLeft: '8px', overflowY: 'auto', height: '780px' }}>
                <Grid container spacing={1} sx={{ p: 1 }}>
                  <Grid item xs={12}>
                    <Tabs value={index} onChange={(e, newVal) => setCurrenIndex(newVal)} aria-label="disabled tabs example" style={{ fontWeight: 'bold' }}>
                      <Tab label="For Sale" />
                      <Tab label="For Rent" />
                    </Tabs>
                    <Grid container spacing={1} sx={{ p: 1 }}
                      role="tabpanel"
                      hidden={0 !== index}
                      id={`simple-tabpanel-${index}`}
                    >
                      {0 === index && (
                        forSale.map(
                          (
                            {
                              adressline,
                              area,
                              img,
                              priceEUR,
                              rooms,
                              id
                            },
                          ) => {
                            return (
                              <Grid item xs={5.9} key={id} onClick={(e) => showDetail(id)}>
                                <Card className="card">
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
                        )
                      )}
                    </Grid>
                    <Grid container spacing={1} sx={{ p: 1 }}
                      role="tabpanel"
                      hidden={1 !== index}
                      id={`simple-tabpanel-${index}`}
                    >
                      {1 === index && (
                        forRent.map(
                          (
                            {
                              adressline,
                              area,
                              img,
                              priceEUR,
                              rooms,
                              id
                            },
                          ) => {
                            return (
                              <Grid item xs={5.9} key={id} onClick={(e) => showDetail(id)}>
                                <Card className="card">
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
                        )
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            </Grid>
          </Grid>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}


export default CustomizedDialog;

