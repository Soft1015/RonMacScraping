import * as React from 'react';
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
  CardContent
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
  showDetail
}) => {

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyCctCn5BfzuPui4BHWF5IUbgvrPUnvfWKQ"
  })

  const containerStyle = {
    height: '90px'
  };

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
  let filterData = data.filter((item => item.city === city));

  filterData = filterData.filter((item) => {
    const dis = getDistance(detail?.x, detail?.y, item?.x, item?.y) / 1000;
    if (dis <= 1 && item?.id != id) {
      if(Math.abs(parseInt(detail?.rooms - item?.rooms) <= 1)){
        if(Math.abs(parseInt(detail?.area - item?.area) <= 5)){
          return true;
        }
      }
    }
  });

  const center = {
    lat: detail?.x,
    lng: detail?.y
  };

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
                <img src={detail?.img} alt='Image could not found' style={{ width: '100%' }} />
              </a>

              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                  Address:
                </Typography>
                <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                  {detail?.adressline}
                </Typography>
              </div>
              <hr />
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                  City:
                </Typography>
                <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                  {city}
                </Typography>
              </div>
              <hr />
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                  Rooms:
                </Typography>
                <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                  {detail?.rooms}
                </Typography>
              </div>
              <hr />
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                  Area:
                </Typography>
                <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                  {detail?.area}
                </Typography>
              </div>
              <hr />
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                  Price:
                </Typography>
                <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                  {detail?.priceEUR} €
                </Typography>
              </div>
              <hr />
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                  YOC:
                </Typography>
                <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                  99000 €
                </Typography>
              </div>
              <hr />
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                  Capex:
                </Typography>
                <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                  99000 €
                </Typography>
              </div>
              <hr />
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                  Acq without Capex:
                </Typography>
                <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                  99000 €
                </Typography>
              </div>
              <div>
                {isLoaded ? (
                  <GoogleMap
                    zoom={15}
                    mapContainerStyle={containerStyle}
                    center={center}
                    options={options}
                  >
                    <Marker
                      position={center}
                      draggable={false}
                      icon={{ url: icon, scaledSize: new window.google.maps.Size(20, 30) }}
                    />
                  </GoogleMap>
                ) : <></>
                }
              </div>
            </Grid>
            <Grid item xs={7}>
              <div style={{ borderLeft: '1px solid grey', marginLeft: '8px', overflowY: 'auto', height: '780px' }}>
                <Grid container spacing={1} sx={{ p: 1 }}>
                  <Grid item xs={12}>
                    <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                      Similar Houses:
                    </Typography>
                  </Grid>
                  {filterData.map(
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
                        <Grid item xs={6} key={id} onClick={(e) => showDetail(id)}>
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
                  )}
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
