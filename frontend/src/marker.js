import React, { useState } from "react";
import { InfoWindow, Marker } from "@react-google-maps/api";
import icon from './imgs/img.png';

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
} from "@mui/material";

const CustomMarker = ({
  position,
  onUpdate,
  img,
  area,
  address,
  rooms,
  title,
  type,
  price,
  url,
  id,
  showDetail
}) => {
  const [markerRef, setMarkerRef] = useState();
  const [isInfoShown, setIsInfoShown] = useState(false);

  const toggleMarker = () => {
    setIsInfoShown(!isInfoShown);
  };

  const onMarkerDrag = ({ latLng }) => {
    onUpdate({ lat: latLng.lat(), lng: latLng.lng() });
  };

  return (
    <>
      {isInfoShown && (
        <InfoWindow
          anchor={markerRef}
          onCloseClick={() => {
            console.log("close clicked");
            setIsInfoShown(false);
          }}
        >
          <Card className="card" onClick={(e) => showDetail(id)}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image={img}
                alt="green iguana"
              />
              <CardContent style={{ textAlign: 'left' }}>
                <Typography gutterBottom variant="h5" component="div" style={{ fontWeight: 'bold' }}>
                  {price} €
                </Typography>
                <Typography variant="p" color="text.secondary">
                  {rooms} Rooms | {area} m2
                </Typography>
                <Typography variant="h6" color="text.secondary" style={{ fontWeight: 'bold' }} className="address">
                  {address}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </InfoWindow>
      )}
      <Marker
        position={position}
        draggable={false}
        onLoad={setMarkerRef}
        onClick={toggleMarker}
        icon={{ url: icon, scaledSize: new window.google.maps.Size(20, 30) }}
      />
    </>
  );
};

export default CustomMarker;
